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

function getSectionEntry(sectionKey) {
  return sectionRegistry.find((section) => section.sectionKey === sectionKey);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function applyPublicationState(doc, status) {
  if (status === "published" || status === "draft") {
    doc.isPublished = status === "published";
  }
}

function updateIndexedItems(currentItems, incomingItems, updateItem) {
  if (!Array.isArray(incomingItems)) {
    return;
  }

  incomingItems.forEach((incomingItem, index) => {
    const currentItem = currentItems?.[index];
    if (!currentItem || !incomingItem) {
      return;
    }

    updateItem(currentItem, incomingItem);
  });
}

function setTitleAndCopy(doc, payload) {
  if (hasText(payload.title)) {
    doc.heading = payload.title.trim();
  }
  if (hasText(payload.copy)) {
    doc.intro = payload.copy.trim();
  }
  if (hasText(payload.summary)) {
    doc.introAccent = payload.summary.trim();
  }
}

function applyExperienceUpdate(doc, payload) {
  if (hasText(payload.title)) {
    doc.headingLines = [payload.title.trim(), ...(doc.headingLines ?? []).slice(1)];
  }
  if (hasText(payload.copy)) {
    doc.lede = payload.copy.trim();
  }
  if (hasText(payload.summary)) {
    doc.body = payload.summary.trim();
  }
  updateIndexedItems(doc.carryHomeCards, payload.items, (card, item) => {
    if (hasText(item.title)) {
      card.title = item.title.trim();
    }
    if (hasText(item.copy)) {
      card.meta = item.copy.trim();
    }
  });
}

function applyKitchenUpdate(doc, payload) {
  if (hasText(payload.title)) {
    const title = payload.title.trim();
    const accent = doc.headingAccent?.trim();
    doc.heading = accent && title.endsWith(` ${accent}`) ? title.slice(0, -accent.length).trim() : title;
  }
  if (hasText(payload.summary) || hasText(payload.copy)) {
    doc.body = (payload.summary || payload.copy).trim();
  }
  updateIndexedItems(doc.images, payload.items, (image, item) => {
    if (hasText(item.copy) || hasText(item.title)) {
      image.alt = (item.copy || item.title).trim();
    }
  });
}

function applyStoriesUpdate(doc, payload) {
  if (hasText(payload.title)) {
    doc.heading = payload.title.trim();
  }
  if (hasText(payload.summary)) {
    doc.intro = payload.summary.trim();
  }
  if (hasText(payload.copy)) {
    doc.introAccent = payload.copy.trim();
  }
  updateIndexedItems(doc.cards, payload.items, (card, item) => {
    if (hasText(item.title)) {
      card.title = item.title.trim();
    }
    if (hasText(item.copy)) {
      card.copy = item.copy.trim();
    }
  });
}

function applyGuestJourneyUpdate(doc, payload) {
  if (hasText(payload.title)) {
    doc.heading = payload.title.trim();
  }
  if (hasText(payload.summary) || hasText(payload.copy)) {
    const bodyParagraphs = doc.bodyParagraphs ?? [];
    bodyParagraphs[0] = (payload.summary || payload.copy).trim();
    doc.bodyParagraphs = bodyParagraphs;
  }
  updateIndexedItems(doc.highlights, payload.items, (highlight, item) => {
    if (hasText(item.title)) {
      highlight.title = item.title.trim();
    }
    if (hasText(item.copy)) {
      highlight.copy = item.copy.trim();
    }
  });
}

function applyGalleryUpdate(doc, payload) {
  if (hasText(payload.title)) {
    doc.heading = payload.title.trim();
  }
  if (hasText(payload.summary) || hasText(payload.copy)) {
    doc.intro = (payload.summary || payload.copy).trim();
  }
  updateIndexedItems(doc.images, payload.items, (image, item) => {
    if (hasText(item.copy) || hasText(item.title)) {
      image.alt = (item.copy || item.title).trim();
    }
  });
}

function applyAdminSummaryUpdate(entry, doc, payload) {
  applyPublicationState(doc, payload.status);

  switch (entry.sectionKey) {
    case "experience":
      applyExperienceUpdate(doc, payload);
      break;
    case "kitchen-experience":
      applyKitchenUpdate(doc, payload);
      break;
    case "stories":
      applyStoriesUpdate(doc, payload);
      break;
    case "signature-experiences":
      setTitleAndCopy(doc, payload);
      updateIndexedItems(doc.cards, payload.items, (card, item) => {
        if (hasText(item.title)) {
          card.title = item.title.trim();
        }
        if (hasText(item.copy)) {
          card.copy = item.copy.trim();
        }
      });
      break;
    case "guest-journey":
      applyGuestJourneyUpdate(doc, payload);
      break;
    case "gallery":
      applyGalleryUpdate(doc, payload);
      break;
  }
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
    const entry = getSectionEntry(req.params.sectionKey);

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

async function updateAdminSectionByKey(req, res, next) {
  try {
    const entry = getSectionEntry(req.params.sectionKey);

    if (!entry) {
      return res.status(404).json({ message: "Section not found" });
    }

    const section = await entry.model.findOne({ sectionKey: entry.sectionKey });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    applyAdminSummaryUpdate(entry, section, req.body ?? {});
    await section.save();

    const savedSection = section.toObject();

    return res.status(200).json({
      section: savedSection,
      summary: normalizeSectionSummary(entry, savedSection),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAdminSections,
  getAdminSectionByKey,
  updateAdminSectionByKey,
};
