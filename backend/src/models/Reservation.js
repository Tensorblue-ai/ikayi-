const mongoose = require("mongoose");

const reservationDateOptionSchema = new mongoose.Schema(
  {
    day: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    selected: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const reservationSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, default: "reservations", immutable: true, unique: true },
    image: { type: String, required: true, trim: true },
    imageAlt: { type: String, required: true, trim: true },
    tabs: [{ type: String, required: true, trim: true }],
    details: [{ type: String, required: true, trim: true }],
    title: { type: String, required: true, trim: true },
    priceLabel: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    note: { type: String, required: true, trim: true },
    bookingTitle: { type: String, default: "Book Now", trim: true },
    dateOptions: [reservationDateOptionSchema],
    timeSlots: [{ type: String, required: true, trim: true }],
    defaultGuests: { type: Number, default: 2, min: 1 },
    helperText: { type: String, default: "", trim: true },
    primaryCtaLabel: { type: String, default: "Check Availability", trim: true },
    inquiryCtaLabel: { type: String, default: "Send Inquiry", trim: true },
    inquiryCtaHref: { type: String, default: "/#reservations", trim: true },
    policyLabel: { type: String, default: "Cancellation Policy", trim: true },
    policyHref: { type: String, default: "#cancellation-policy", trim: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
