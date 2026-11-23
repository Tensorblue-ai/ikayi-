const mongoose = require("mongoose");

const kitchenImageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    layoutSlot: {
      type: String,
      enum: ["large", "top", "middle", "bottom"],
      required: true,
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const kitchenExperienceSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, default: "kitchen-experience", immutable: true, unique: true },
    kicker: { type: String, default: "Dining Concept", trim: true },
    heading: { type: String, required: true, trim: true },
    headingAccent: { type: String, default: "Experience", trim: true },
    body: { type: String, required: true, trim: true },
    ctaLabel: { type: String, default: "Plan Your Visit", trim: true },
    ctaHref: { type: String, default: "#reservations", trim: true },
    images: [kitchenImageSchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.KitchenExperience || mongoose.model("KitchenExperience", kitchenExperienceSchema);