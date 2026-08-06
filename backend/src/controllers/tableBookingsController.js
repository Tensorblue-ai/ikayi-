const crypto = require("crypto");
const TableBooking = require("../models/TableBooking");
const TableSettings = require("../models/TableSettings");

const RESTAURANT_KEY = "ikayi";
const DEFAULT_SETTINGS = {
  numberOfTables: 10,
  chairsPerTable: 4,
  openingTime: "12:00",
  closingTime: "00:00",
  slotLengthMinutes: 60,
  timezone: "Asia/Kolkata",
};
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function parsePositiveInteger(value) {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function parseMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(totalMinutes) {
  const normalizedMinutes = totalMinutes % (24 * 60);
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatSlotLabel(slotStart, slotEnd) {
  return `${formatDisplayTime(slotStart)} - ${formatDisplayTime(slotEnd)}`;
}

function formatDisplayTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function buildSlots(settings) {
  const openingMinutes = parseMinutes(settings.openingTime);
  let closingMinutes = parseMinutes(settings.closingTime);

  if (closingMinutes <= openingMinutes) {
    closingMinutes += 24 * 60;
  }

  const slots = [];

  for (
    let slotStartMinutes = openingMinutes;
    slotStartMinutes + settings.slotLengthMinutes <= closingMinutes;
    slotStartMinutes += settings.slotLengthMinutes
  ) {
    const slotStart = formatTime(slotStartMinutes);
    const slotEnd = formatTime(slotStartMinutes + settings.slotLengthMinutes);

    slots.push({
      slotStart,
      slotEnd,
      label: formatSlotLabel(slotStart, slotEnd),
    });
  }

  return slots;
}

async function getTableSettings() {
  const settings = await TableSettings.findOne({ restaurantKey: RESTAURANT_KEY }).lean();

  return settings ?? DEFAULT_SETTINGS;
}

async function getBookedGuestsBySlot(bookingDate, slotStart) {
  const result = await TableBooking.aggregate([
    {
      $match: {
        bookingDate,
        slotStart,
        status: "confirmed",
      },
    },
    {
      $group: {
        _id: "$slotStart",
        bookedGuests: { $sum: "$guestCount" },
      },
    },
  ]);

  return result[0]?.bookedGuests ?? 0;
}

async function getBookedGuestsForDate(bookingDate) {
  const bookedGuestsBySlot = await TableBooking.aggregate([
    {
      $match: {
        bookingDate,
        status: "confirmed",
      },
    },
    {
      $group: {
        _id: "$slotStart",
        bookedGuests: { $sum: "$guestCount" },
      },
    },
  ]);

  return new Map(bookedGuestsBySlot.map((slot) => [slot._id, slot.bookedGuests]));
}

function findSlot(slots, slotStart) {
  return slots.find((slot) => slot.slotStart === slotStart);
}

function serializeAdminBooking(booking) {
  return {
    bookingReference: booking.bookingReference,
    customerName: booking.customerName,
    phoneNumber: booking.phoneNumber,
    guestCount: booking.guestCount,
    bookingDate: booking.bookingDate,
    slotStart: booking.slotStart,
    slotEnd: booking.slotEnd,
    status: booking.status,
    createdAt: booking.createdAt,
  };
}

function serializeBooking(booking) {
  return {
    bookingReference: booking.bookingReference,
    customerName: booking.customerName,
    phoneNumber: booking.phoneNumber,
    guestCount: booking.guestCount,
    bookingDate: booking.bookingDate,
    slotStart: booking.slotStart,
    slotEnd: booking.slotEnd,
    status: booking.status,
  };
}

function createBookingReference(bookingDate) {
  const compactDate = bookingDate.replaceAll("-", "");
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `IKY-${compactDate}-${randomSuffix}`;
}

function validateBookingPayload(payload) {
  const customerName = typeof payload.customerName === "string" ? payload.customerName.trim() : "";
  const phoneNumber = typeof payload.phoneNumber === "string" ? payload.phoneNumber.trim() : "";
  const guestCount = parsePositiveInteger(payload.guestCount);
  const bookingDate = typeof payload.bookingDate === "string" ? payload.bookingDate.trim() : "";
  const slotStart = typeof payload.slotStart === "string" ? payload.slotStart.trim() : "";
  const errors = [];

  if (!customerName) {
    errors.push("customerName is required.");
  }
  if (!phoneNumber) {
    errors.push("phoneNumber is required.");
  }
  if (!guestCount) {
    errors.push("guestCount must be an integer greater than 0.");
  }
  if (!datePattern.test(bookingDate)) {
    errors.push("bookingDate must be a valid YYYY-MM-DD date.");
  }
  if (!timePattern.test(slotStart)) {
    errors.push("slotStart must be a valid HH:mm time.");
  }

  return {
    data: { customerName, phoneNumber, guestCount, bookingDate, slotStart },
    errors,
  };
}

async function getAvailability(req, res, next) {
  try {
    const date = typeof req.query.date === "string" ? req.query.date.trim() : "";
    const guestCount = parsePositiveInteger(req.query.guestCount);

    if (!datePattern.test(date) || !guestCount) {
      return res.status(400).json({ message: "A valid date and guestCount are required." });
    }

    const settings = await getTableSettings();
    const generatedSlots = buildSlots(settings);
    const totalAvailability = settings.numberOfTables * settings.chairsPerTable;
    const bookedGuestMap = await getBookedGuestsForDate(date);
    const slots = generatedSlots.map((slot) => {
      const bookedGuests = bookedGuestMap.get(slot.slotStart) ?? 0;
      const remainingAvailability = Math.max(totalAvailability - bookedGuests, 0);

      return {
        ...slot,
        totalAvailability,
        bookedGuests,
        remainingAvailability,
        isAvailable: remainingAvailability >= guestCount,
      };
    });

    return res.status(200).json({ date, guestCount, slots });
  } catch (error) {
    return next(error);
  }
}

async function createBooking(req, res, next) {
  try {
    const { data, errors } = validateBookingPayload(req.body ?? {});

    if (errors.length > 0) {
      return res.status(400).json({ message: "Invalid booking request.", errors });
    }

    const settings = await getTableSettings();
    const generatedSlots = buildSlots(settings);
    const selectedSlot = findSlot(generatedSlots, data.slotStart);

    if (!selectedSlot) {
      return res.status(400).json({ message: "Selected slot is not available for booking." });
    }

    const totalAvailability = settings.numberOfTables * settings.chairsPerTable;
    const bookedGuests = await getBookedGuestsBySlot(data.bookingDate, data.slotStart);
    const remainingAvailability = Math.max(totalAvailability - bookedGuests, 0);

    if (remainingAvailability < data.guestCount) {
      return res.status(409).json({ error: "Selected slot is no longer available for this guest count." });
    }

    const booking = await TableBooking.create({
      bookingReference: createBookingReference(data.bookingDate),
      customerName: data.customerName,
      phoneNumber: data.phoneNumber,
      guestCount: data.guestCount,
      bookingDate: data.bookingDate,
      slotStart: selectedSlot.slotStart,
      slotEnd: selectedSlot.slotEnd,
      status: "confirmed",
      source: "website",
    });

    return res.status(201).json({ booking: serializeBooking(booking) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(500).json({ message: "Unable to create a unique booking reference." });
    }

    return next(error);
  }
}


async function getAdminBookings(_req, res, next) {
  try {
    const bookings = await TableBooking.find({}).sort({ createdAt: -1 }).lean();

    return res.status(200).json({ bookings: bookings.map(serializeAdminBooking) });
  } catch (error) {
    return next(error);
  }
}
module.exports = {
  createBooking,
  getAdminBookings,
  getAvailability,
};

