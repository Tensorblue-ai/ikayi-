const ReservationType = require("../models/ReservationType");

const allowedIcons = new Set(["cloche", "teapot", "briefcase", "lotus", "sun", "handshake", "tractor"]);
const allowedPageGroups = new Set(["primary", "more"]);
const allowedCardSizes = new Set(["standard", "wide"]);
const allowedMealPeriods = new Set(["lunch", "dinner"]);

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function readString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createSlug(value) {
  return readString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function serializeReservationType(type) {
  return {
    id: String(type._id),
    slug: type.slug,
    title: type.title,
    eyebrow: type.eyebrow,
    description: type.description,
    details: type.details ?? [],
    badgeLabel: type.badgeLabel,
    icon: type.icon,
    pageGroup: type.pageGroup,
    cardSize: type.cardSize,
    mealPeriods: type.mealPeriods ?? [],
    defaultGuests: type.defaultGuests,
    minGuests: type.minGuests,
    maxGuests: type.maxGuests,
    sortOrder: type.sortOrder,
    isActive: type.isActive,
    updatedAt: type.updatedAt,
  };
}

function validateReservationTypePayload(payload, { partial = false } = {}) {
  const errors = [];
  const title = readString(payload.title);
  const slug = createSlug(payload.slug || title);
  const description = readString(payload.description);
  const icon = readString(payload.icon);
  const pageGroup = readString(payload.pageGroup) || "primary";
  const cardSize = readString(payload.cardSize) || "standard";
  const details = Array.isArray(payload.details) ? payload.details.map(readString).filter(Boolean) : [];
  const mealPeriods = Array.isArray(payload.mealPeriods) ? payload.mealPeriods.map(readString).filter(Boolean) : [];
  const defaultGuests = payload.defaultGuests === undefined ? undefined : Number(payload.defaultGuests);
  const minGuests = payload.minGuests === undefined ? undefined : Number(payload.minGuests);
  const maxGuests = payload.maxGuests === undefined ? undefined : Number(payload.maxGuests);
  const sortOrder = payload.sortOrder === undefined ? undefined : Number(payload.sortOrder);
  const data = {};

  if (!partial || payload.title !== undefined) {
    if (!title) errors.push("title is required.");
    data.title = title;
  }
  if (!partial || payload.slug !== undefined || payload.title !== undefined) {
    if (!slug) errors.push("slug is required.");
    data.slug = slug;
  }
  if (!partial || payload.description !== undefined) {
    if (!description) errors.push("description is required.");
    data.description = description;
  }
  if (!partial || payload.icon !== undefined) {
    if (!allowedIcons.has(icon)) errors.push("icon must be one of the supported reservation icons.");
    data.icon = icon;
  }
  if (!partial || payload.pageGroup !== undefined) {
    if (!allowedPageGroups.has(pageGroup)) errors.push("pageGroup must be primary or more.");
    data.pageGroup = pageGroup;
  }
  if (!partial || payload.cardSize !== undefined) {
    if (!allowedCardSizes.has(cardSize)) errors.push("cardSize must be standard or wide.");
    data.cardSize = cardSize;
  }
  if (payload.details !== undefined) data.details = details;
  if (payload.mealPeriods !== undefined) {
    const invalidMealPeriod = mealPeriods.find((period) => !allowedMealPeriods.has(period));
    if (invalidMealPeriod) errors.push("mealPeriods can only include lunch or dinner.");
    data.mealPeriods = mealPeriods;
  }
  if (payload.eyebrow !== undefined) data.eyebrow = readString(payload.eyebrow);
  if (payload.badgeLabel !== undefined) data.badgeLabel = readString(payload.badgeLabel);
  if (payload.defaultGuests !== undefined) {
    if (!isPositiveInteger(defaultGuests)) errors.push("defaultGuests must be an integer greater than 0.");
    data.defaultGuests = defaultGuests;
  }
  if (payload.minGuests !== undefined) {
    if (!isPositiveInteger(minGuests)) errors.push("minGuests must be an integer greater than 0.");
    data.minGuests = minGuests;
  }
  if (payload.maxGuests !== undefined) {
    if (!isPositiveInteger(maxGuests)) errors.push("maxGuests must be an integer greater than 0.");
    data.maxGuests = maxGuests;
  }
  if (payload.sortOrder !== undefined) {
    if (!Number.isInteger(sortOrder)) errors.push("sortOrder must be an integer.");
    data.sortOrder = sortOrder;
  }
  if (payload.isActive !== undefined) {
    if (typeof payload.isActive !== "boolean") errors.push("isActive must be a boolean.");
    data.isActive = payload.isActive;
  }

  const nextMinGuests = data.minGuests ?? payload.minGuests;
  const nextMaxGuests = data.maxGuests ?? payload.maxGuests;
  if (isPositiveInteger(nextMinGuests) && isPositiveInteger(nextMaxGuests) && nextMaxGuests < nextMinGuests) {
    errors.push("maxGuests must be greater than or equal to minGuests.");
  }

  return { data, errors };
}

async function getPublicReservationTypes(req, res, next) {
  try {
    const pageGroup = typeof req.query.pageGroup === "string" ? req.query.pageGroup.trim() : "";
    const query = { isActive: true };

    if (pageGroup) {
      if (!allowedPageGroups.has(pageGroup)) {
        return res.status(400).json({ message: "pageGroup must be primary or more." });
      }
      query.pageGroup = pageGroup;
    }

    const types = await ReservationType.find(query).sort({ sortOrder: 1, title: 1 }).lean();

    return res.status(200).json({ reservationTypes: types.map(serializeReservationType) });
  } catch (error) {
    return next(error);
  }
}

async function getAdminReservationTypes(_req, res, next) {
  try {
    const types = await ReservationType.find({}).sort({ sortOrder: 1, title: 1 }).lean();

    return res.status(200).json({ reservationTypes: types.map(serializeReservationType) });
  } catch (error) {
    return next(error);
  }
}

async function createReservationType(req, res, next) {
  try {
    const { data, errors } = validateReservationTypePayload(req.body ?? {});

    if (errors.length > 0) {
      return res.status(400).json({ message: "Invalid reservation type.", errors });
    }

    const type = await ReservationType.create(data);

    return res.status(201).json({ reservationType: serializeReservationType(type) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "A reservation type with this slug already exists." });
    }

    return next(error);
  }
}

async function updateReservationType(req, res, next) {
  try {
    const { data, errors } = validateReservationTypePayload(req.body ?? {}, { partial: true });

    if (errors.length > 0) {
      return res.status(400).json({ message: "Invalid reservation type.", errors });
    }

    const type = await ReservationType.findOneAndUpdate({ slug: req.params.slug }, { $set: data }, { new: true, runValidators: true });

    if (!type) {
      return res.status(404).json({ message: "Reservation type not found." });
    }

    return res.status(200).json({ reservationType: serializeReservationType(type) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "A reservation type with this slug already exists." });
    }

    return next(error);
  }
}

async function deleteReservationType(req, res, next) {
  try {
    const type = await ReservationType.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: { isActive: false } },
      { new: true, runValidators: true }
    );

    if (!type) {
      return res.status(404).json({ message: "Reservation type not found." });
    }

    return res.status(200).json({ reservationType: serializeReservationType(type) });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createReservationType,
  deleteReservationType,
  getAdminReservationTypes,
  getPublicReservationTypes,
  updateReservationType,
};