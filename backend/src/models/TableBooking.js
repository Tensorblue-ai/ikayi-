const mongoose = require("mongoose");

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const bookingStatuses = ["confirmed", "cancelled", "completed", "no_show"];

const tableBookingSchema = new mongoose.Schema(
  {
    bookingReference: { type: String, required: true, trim: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    guestCount: { type: Number, required: true, min: 1, validate: Number.isInteger },
    bookingDate: {
      type: String,
      required: true,
      trim: true,
      match: datePattern,
    },
    slotStart: {
      type: String,
      required: true,
      trim: true,
      match: timePattern,
    },
    slotEnd: {
      type: String,
      required: true,
      trim: true,
      match: timePattern,
    },
    status: { type: String, enum: bookingStatuses, default: "confirmed", required: true },
    source: { type: String, default: "website", required: true, trim: true },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

tableBookingSchema.index({ bookingDate: 1, slotStart: 1, status: 1 });
tableBookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("TableBooking", tableBookingSchema);

