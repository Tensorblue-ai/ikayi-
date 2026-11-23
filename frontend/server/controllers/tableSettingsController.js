const TableSettings = require("../models/TableSettings");

const RESTAURANT_KEY = "ikayi";
const DEFAULT_SETTINGS = {
  restaurantKey: RESTAURANT_KEY,
  numberOfTables: 10,
  chairsPerTable: 4,
  openingTime: "12:00",
  closingTime: "00:00",
  slotLengthMinutes: 90,
  timezone: "Asia/Kolkata",
  isActive: true,
};
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function serializeSettings(settings) {
  return {
    restaurantKey: settings.restaurantKey,
    numberOfTables: settings.numberOfTables,
    chairsPerTable: settings.chairsPerTable,
    openingTime: settings.openingTime,
    closingTime: settings.closingTime,
    slotLengthMinutes: settings.slotLengthMinutes,
    timezone: settings.timezone,
    isActive: settings.isActive,
    availability: settings.numberOfTables * settings.chairsPerTable,
    updatedAt: settings.updatedAt,
  };
}

function validateSettingsPayload(payload) {
  const errors = [];

  if (!isPositiveInteger(payload.numberOfTables)) {
    errors.push("numberOfTables must be an integer greater than 0.");
  }
  if (!isPositiveInteger(payload.chairsPerTable)) {
    errors.push("chairsPerTable must be an integer greater than 0.");
  }
  if (typeof payload.openingTime !== "string" || !timePattern.test(payload.openingTime.trim())) {
    errors.push("openingTime must be a valid HH:mm time.");
  }
  if (typeof payload.closingTime !== "string" || !timePattern.test(payload.closingTime.trim())) {
    errors.push("closingTime must be a valid HH:mm time.");
  }
  if (!isPositiveInteger(payload.slotLengthMinutes)) {
    errors.push("slotLengthMinutes must be an integer greater than 0.");
  }

  return errors;
}

async function getOrCreateTableSettings() {
  const settings = await TableSettings.findOne({ restaurantKey: RESTAURANT_KEY });

  if (settings) {
    return settings;
  }

  return TableSettings.create(DEFAULT_SETTINGS);
}

async function getTableSettings(_req, res, next) {
  try {
    const settings = await getOrCreateTableSettings();

    return res.status(200).json({ settings: serializeSettings(settings) });
  } catch (error) {
    return next(error);
  }
}

async function updateTableSettings(req, res, next) {
  try {
    const payload = req.body ?? {};
    const errors = validateSettingsPayload(payload);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Invalid table settings.", errors });
    }

    const settings = await TableSettings.findOneAndUpdate(
      { restaurantKey: RESTAURANT_KEY },
      {
        $set: {
          numberOfTables: payload.numberOfTables,
          chairsPerTable: payload.chairsPerTable,
          openingTime: payload.openingTime.trim(),
          closingTime: payload.closingTime.trim(),
          slotLengthMinutes: payload.slotLengthMinutes,
        },
        $setOnInsert: {
          restaurantKey: RESTAURANT_KEY,
          timezone: DEFAULT_SETTINGS.timezone,
          isActive: true,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({ settings: serializeSettings(settings) });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getTableSettings,
  updateTableSettings,
};
