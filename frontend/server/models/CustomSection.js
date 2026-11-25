const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  sectionKey: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  copy: { type: String, default: "", trim: true, maxlength: 5000 },
  summary: { type: String, default: "", trim: true, maxlength: 10000 },
  image: { type: String, default: "", trim: true },
  imageAlt: { type: String, default: "", trim: true },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.CustomSection || mongoose.model("CustomSection", schema);
