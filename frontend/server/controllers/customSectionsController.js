const CustomSection = require("../models/CustomSection");

function serializeSection(section) {
  return { sectionKey: section.sectionKey, title: section.title, summary: section.copy, isPublished: section.isPublished, updatedAt: section.updatedAt, data: section };
}

async function getCustomSections() {
  return (await CustomSection.find({}).sort({ createdAt: 1 }).lean()).map(serializeSection);
}

async function saveCustomSection(req, res, next) {
  try {
    const payload = req.body ?? {};
    const sectionKey = req.params.sectionKey || payload.sectionKey;
    if (typeof sectionKey !== "string" || !/^custom-[a-f0-9-]{36}$/.test(sectionKey)
      || typeof payload.title !== "string" || !payload.title.trim()
      || !["draft", "published"].includes(payload.status)) {
      return res.status(400).json({ message: "A title and valid publishing status are required." });
    }
    const image = payload.images?.find((item) => item.id === "image");
    if (image?.src && !/^\/(?!\/)|^https?:\/\//i.test(image.src)) {
      return res.status(400).json({ message: "Use a relative or HTTP image URL." });
    }
    const data = { title: payload.title, copy: payload.copy ?? "", summary: payload.summary ?? "", image: image?.src ?? "", imageAlt: image?.alt ?? "", isPublished: payload.status === "published" };
    const section = req.params.sectionKey
      ? await CustomSection.findOneAndUpdate({ sectionKey }, { $set: data }, { returnDocument: "after", runValidators: true })
      : await CustomSection.create({ sectionKey, ...data });
    if (!section) return res.status(404).json({ message: "Section not found" });
    return res.status(req.params.sectionKey ? 200 : 201).json({ summary: serializeSection(section.toObject()) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Section already exists." });
    if (error.name === "ValidationError") return res.status(400).json({ message: "Invalid section content." });
    return next(error);
  }
}

async function getCustomSection(req, res, next) {
  try {
    const section = await CustomSection.findOne({ sectionKey: req.params.sectionKey }).lean();
    return section ? res.json({ section }) : res.status(404).json({ message: "Section not found" });
  } catch (error) { return next(error); }
}

async function deleteCustomSection(req, res, next) {
  try {
    const section = await CustomSection.findOneAndDelete({ sectionKey: req.params.sectionKey });
    return section ? res.json({ message: "Section deleted" }) : res.status(404).json({ message: "Section not found" });
  } catch (error) { return next(error); }
}

module.exports = { getCustomSections, saveCustomSection, getCustomSection, deleteCustomSection };
