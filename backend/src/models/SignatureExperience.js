const mongoose = require("mongoose");

const signatureCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    copy: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    imageAlt: { type: String, default: "", trim: true },
    icon: {
      type: String,
      enum: ["cloche", "cup", "table", "glass", "other"],
      default: "other",
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const signatureExperienceSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, default: "signature-experiences", immutable: true, unique: true },
    heading: { type: String, default: "Signature Experiences", trim: true },
    intro: { type: String, required: true, trim: true },
    introAccent: { type: String, default: "", trim: true },
    cards: [signatureCardSchema],
    footerTitle: { type: String, default: "Traffic Tools, Not Brand Positioning", trim: true },
    footerCopy: { type: String, default: "", trim: true },
    footerCtaLabel: { type: String, default: "Explore Our Spaces", trim: true },
    footerCtaHref: { type: String, default: "#gallery", trim: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SignatureExperience", signatureExperienceSchema);