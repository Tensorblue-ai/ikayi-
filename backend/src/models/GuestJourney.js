const mongoose = require("mongoose");

const journeyHighlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    copy: { type: String, required: true, trim: true },
    icon: { type: String, default: "*", trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const guestJourneySchema = new mongoose.Schema(
  {
    sectionKey: { type: String, default: "guest-journey", immutable: true, unique: true },
    kicker: { type: String, default: "Guest Journey", trim: true },
    heading: { type: String, required: true, trim: true },
    bodyParagraphs: [{ type: String, required: true, trim: true }],
    image: { type: String, required: true, trim: true },
    imageAlt: { type: String, required: true, trim: true },
    highlights: [journeyHighlightSchema],
    primaryCtaLabel: { type: String, default: "Reserve Your Table", trim: true },
    primaryCtaHref: { type: String, default: "#reservations", trim: true },
    secondaryCtaLabel: { type: String, default: "View The Space", trim: true },
    secondaryCtaHref: { type: String, default: "#gallery", trim: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GuestJourney", guestJourneySchema);