const mongoose = require("mongoose");

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const tableSettingsSchema = new mongoose.Schema(
  {
    restaurantKey: { type: String, default: "ikayi", trim: true, unique: true, required: true },
    numberOfTables: { type: Number, required: true, min: 1, validate: Number.isInteger },
    chairsPerTable: { type: Number, required: true, min: 1, validate: Number.isInteger },
    openingTime: {
      type: String,
      default: "12:00",
      required: true,
      trim: true,
      match: timePattern,
    },
    closingTime: {
      type: String,
      default: "00:00",
      required: true,
      trim: true,
      match: timePattern,
    },
    slotLengthMinutes: { type: Number, default: 60, required: true, min: 1, validate: Number.isInteger },
    timezone: { type: String, default: "Asia/Kolkata", required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TableSettings", tableSettingsSchema);

