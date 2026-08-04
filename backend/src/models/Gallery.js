const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const gallerySchema = new mongoose.Schema(
  {
    sectionKey: { type: String, default: "gallery", immutable: true, unique: true },
    heading: { type: String, default: "Gallery", trim: true },
    intro: { type: String, required: true, trim: true },
    images: [galleryImageSchema],
    ctaLabel: { type: String, default: "Explore More Moments", trim: true },
    ctaHref: { type: String, default: "#stories", trim: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);