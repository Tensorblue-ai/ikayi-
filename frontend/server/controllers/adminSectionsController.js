const Experience = require("../models/Experience");
const KitchenExperience = require("../models/KitchenExperience");
const Story = require("../models/Story");
const SignatureExperience = require("../models/SignatureExperience");
const GuestJourney = require("../models/GuestJourney");
const Gallery = require("../models/Gallery");
const Reservation = require("../models/Reservation");
const { getCustomSections } = require("./customSectionsController");

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
  {
    sectionKey: "reservations",
    model: Reservation,
    getTitle: (doc) => doc.title,
    getSummary: (doc) => doc.description,
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


class PayloadValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readPayloadString(value, fieldLabel, options = {}) {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new PayloadValidationError(`${fieldLabel} must be a string.`);
  }

  const trimmedValue = value.trim();

  if (options.required && !trimmedValue) {
    throw new PayloadValidationError(`${fieldLabel} is required.`);
  }

  return trimmedValue;
}

function readImageUrl(value, fieldLabel) {
  const imageUrl = readPayloadString(value, fieldLabel, { required: true });

  if (imageUrl === undefined) {
    return undefined;
  }

  if (!imageUrl.startsWith("/") && !/^https?:\/\//i.test(imageUrl)) {
    throw new PayloadValidationError(`${fieldLabel} must be an http(s) URL or local asset path.`);
  }

  return imageUrl;
}

function getSectionImage(payload, imageId) {
  if (!Array.isArray(payload.images)) {
    return null;
  }

  const image = payload.images.find((entry) => isObject(entry) && entry.id === imageId);
  return isObject(image) ? image : null;
}

function applyImageField(target, fieldName, value, fieldLabel) {
  const imageUrl = readImageUrl(value, fieldLabel);

  if (imageUrl !== undefined) {
    target[fieldName] = imageUrl;
  }
}

function applyTextField(target, fieldName, value, fieldLabel, options = {}) {
  const textValue = readPayloadString(value, fieldLabel, options);

  if (textValue !== undefined) {
    target[fieldName] = textValue;
  }
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

  const heroImage = getSectionImage(payload, "heroImage");
  if (heroImage) {
    applyImageField(doc, "heroImage", heroImage.src, "Experience hero image URL");
    applyTextField(doc, "heroImageAlt", heroImage.alt, "Experience hero image alt text", { required: true });
  }

  updateIndexedItems(doc.carryHomeCards, payload.items, (card, item) => {
    if (hasText(item.title)) {
      card.title = item.title.trim();
    }
    if (hasText(item.copy)) {
      card.meta = item.copy.trim();
    }
    applyImageField(card, "image", item.image, "Experience card image URL");
    applyTextField(card, "alt", item.alt, "Experience card image alt text");
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
    applyImageField(image, "src", item.image, "Kitchen image URL");
    applyTextField(image, "alt", item.alt, "Kitchen image alt text", { required: true });
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

  const bannerImage = getSectionImage(payload, "bannerImage");
  if (bannerImage) {
    applyImageField(doc, "bannerImage", bannerImage.src, "Stories banner image URL");
  }

  updateIndexedItems(doc.cards, payload.items, (card, item) => {
    if (hasText(item.title)) {
      card.title = item.title.trim();
    }
    if (hasText(item.copy)) {
      card.copy = item.copy.trim();
    }
    applyImageField(card, "image", item.image, "Story card image URL");
    applyTextField(card, "imageAlt", item.alt, "Story card image alt text");
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

  const sectionImage = getSectionImage(payload, "image");
  if (sectionImage) {
    applyImageField(doc, "image", sectionImage.src, "Guest journey image URL");
    applyTextField(doc, "imageAlt", sectionImage.alt, "Guest journey image alt text", { required: true });
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
    applyImageField(image, "src", item.image, "Gallery image URL");
    applyTextField(image, "alt", item.alt, "Gallery image alt text", { required: true });
  });
}

function applySignatureUpdate(doc, payload) {
  setTitleAndCopy(doc, payload);
  updateIndexedItems(doc.cards, payload.items, (card, item) => {
    if (hasText(item.title)) {
      card.title = item.title.trim();
    }
    if (hasText(item.copy)) {
      card.copy = item.copy.trim();
    }
    applyImageField(card, "image", item.image, "Signature experience image URL");
    applyTextField(card, "imageAlt", item.alt, "Signature experience image alt text");
  });
}

function applyReservationUpdate(doc, payload) {
  if (hasText(payload.title)) doc.title = payload.title.trim();
  if (hasText(payload.copy)) doc.priceLabel = payload.copy.trim();
  if (hasText(payload.summary)) doc.description = payload.summary.trim();

  const sectionImage = getSectionImage(payload, "image");
  if (sectionImage) {
    applyImageField(doc, "image", sectionImage.src, "Reservation image URL");
    applyTextField(doc, "imageAlt", sectionImage.alt, "Reservation image alt text", { required: true });
  }
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
    case "reservations":
      if (hasText(payload.title)) doc.title = payload.title.trim();
      if (hasText(payload.copy)) doc.priceLabel = payload.copy.trim();
      if (hasText(payload.summary)) doc.description = payload.summary.trim();
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

    res.status(200).json({ sections: [...sections.filter(Boolean), ...await getCustomSections()] });
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
    if (error instanceof PayloadValidationError) {
      return res.status(error.status).json({ message: error.message });
    }

    return next(error);
  }
}

module.exports = {
  getAdminSections,
  getAdminSectionByKey,
  updateAdminSectionByKey,
};
