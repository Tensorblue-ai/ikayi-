const mongoose = require("mongoose");

const experienceCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    meta: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, default: "experience", immutable: true, unique: true },
    kicker: { type: String, default: "Our Philosophy", trim: true },
    headingLines: [{ type: String, required: true, trim: true }],
    lede: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    heroImage: { type: String, required: true, trim: true },
    heroImageAlt: { type: String, required: true, trim: true },
    ctaLabel: { type: String, default: "Explore Our Journey", trim: true },
    ctaHref: { type: String, default: "#stories", trim: true },
    carryHomeTitle: { type: String, default: "The Feeling Guests Carry Home", trim: true },
    carryHomeCards: [experienceCardSchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);