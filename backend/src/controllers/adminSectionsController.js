const Experience = require("../models/Experience");
const KitchenExperience = require("../models/KitchenExperience");
const Story = require("../models/Story");
const SignatureExperience = require("../models/SignatureExperience");
const GuestJourney = require("../models/GuestJourney");
const Gallery = require("../models/Gallery");

const sectionRegistry = [
  {
    sectionKey: "experience",
    model: Experience,
    getTitle: (doc) => doc.headingLines?.[0] ?? "Experience",
    getSummary: (doc) => doc.lede,
  },
  {
    sectionKey: "kitchen-experience",
    model: KitchenExperience,
    getTitle: (doc) => [doc.heading, doc.headingAccent].filter(Boolean).join(" "),
    getSummary: (doc) => doc.body,
  },
  {
    sectionKey: "stories",
    model: Story,
    getTitle: (doc) => doc.heading,
    getSummary: (doc) => doc.introAccent || doc.intro,
  },
  {
    sectionKey: "signature-experiences",
    model: SignatureExperience,
    getTitle: (doc) => doc.heading,
    getSummary: (doc) => doc.intro,
  },
  {
    sectionKey: "guest-journey",
    model: GuestJourney,
    getTitle: (doc) => doc.heading,
    getSummary: (doc) => doc.bodyParagraphs?.[0],
  },
  {
    sectionKey: "gallery",
    model: Gallery,
    getTitle: (doc) => doc.heading,
    getSummary: (doc) => doc.intro,
  },
];

function normalizeSectionSummary(entry, doc) {
  return {
    sectionKey: entry.sectionKey,
    title: entry.getTitle(doc) || entry.sectionKey,
    summary: entry.getSummary(doc) || "",
    isPublished: Boolean(doc.isPublished),
    updatedAt: doc.updatedAt,
    data: doc,
  };
}

async function getAdminSections(_req, res, next) {
  try {
    const sections = await Promise.all(
      sectionRegistry.map(async (entry) => {
        const doc = await entry.model.findOne({ sectionKey: entry.sectionKey }).lean();
        return doc ? normalizeSectionSummary(entry, doc) : null;
      })
    );

    res.status(200).json({ sections: sections.filter(Boolean) });
  } catch (error) {
    next(error);
  }
}

async function getAdminSectionByKey(req, res, next) {
  try {
    const entry = sectionRegistry.find((section) => section.sectionKey === req.params.sectionKey);

    if (!entry) {
      return res.status(404).json({ message: "Section not found" });
    }

    const section = await entry.model.findOne({ sectionKey: entry.sectionKey }).lean();

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    return res.status(200).json({ section });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAdminSections,
  getAdminSectionByKey,
};

