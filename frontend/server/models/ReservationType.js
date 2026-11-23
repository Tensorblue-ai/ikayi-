const mongoose = require("mongoose");

const reservationTypeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    title: { type: String, required: true, trim: true },
    eyebrow: { type: String, default: "", trim: true },
    description: { type: String, required: true, trim: true },
    details: [{ type: String, trim: true }],
    badgeLabel: { type: String, default: "", trim: true },
    icon: {
      type: String,
      enum: ["cloche", "teapot", "briefcase", "lotus", "sun", "handshake", "tractor"],
      required: true,
    },
    pageGroup: { type: String, enum: ["primary", "more"], default: "primary", required: true },
    cardSize: { type: String, enum: ["standard", "wide"], default: "standard", required: true },
    mealPeriods: [{ type: String, enum: ["lunch", "dinner"] }],
    defaultGuests: { type: Number, default: 2, min: 1, validate: Number.isInteger },
    minGuests: { type: Number, default: 1, min: 1, validate: Number.isInteger },
    maxGuests: { type: Number, default: 12, min: 1, validate: Number.isInteger },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reservationTypeSchema.index({ pageGroup: 1, sortOrder: 1 });
reservationTypeSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.models.ReservationType || mongoose.model("ReservationType", reservationTypeSchema);