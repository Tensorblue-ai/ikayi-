const mongoose = require("mongoose");

const storyCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    copy: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    imageAlt: { type: String, default: "", trim: true },
    href: { type: String, default: "#", trim: true },
    icon: { type: String, default: "*", trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const storySchema = new mongoose.Schema(
  {
    sectionKey: { type: String, default: "stories", immutable: true, unique: true },
    heading: { type: String, default: "Stories", trim: true },
    intro: { type: String, required: true, trim: true },
    introAccent: { type: String, default: "", trim: true },
    cards: [storyCardSchema],
    bannerQuote: { type: String, required: true, trim: true },
    bannerImage: { type: String, default: "/assets/footer.png", trim: true },
    bannerCtaLabel: { type: String, default: "See the Space", trim: true },
    bannerCtaHref: { type: String, default: "#gallery", trim: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Story || mongoose.model("Story", storySchema);