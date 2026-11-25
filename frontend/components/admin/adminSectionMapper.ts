import type { HomepageSection, SectionStatus } from "./AdminDashboard";
import { initialSections } from "./adminDashboardData";

type SectionData = Record<string, unknown>;

export type AdminSectionPayload = {
  sectionKey: string;
  title?: string;
  summary?: string;
  isPublished?: boolean;
  data?: SectionData;
};

function isRecord(value: unknown): value is SectionData {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function readRecords(value: unknown) {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function imageEntry(id: string, label: string, src?: string, alt?: string) {
  return src ? { id, label, src, alt } : null;
}

function compactImages(images: Array<ReturnType<typeof imageEntry>>) {
  return images.filter(Boolean) as HomepageSection["images"];
}

function getStatus(section: AdminSectionPayload): SectionStatus {
  return section.isPublished === false || section.data?.isPublished === false ? "draft" : "published";
}

function getTitle(section: AdminSectionPayload, fallback: string) {
  return section.title || fallback;
}

function getHeadingLines(data: SectionData) {
  return readStringArray(data.headingLines);
}

function mapBackendSection(section: AdminSectionPayload): HomepageSection | null {
  const data = section.data ?? {};
  const status = getStatus(section);

  switch (section.sectionKey) {
    case "experience":
      return {
        id: "experience",
        title: getTitle(section, getHeadingLines(data)[0] ?? "Experience"),
        copy: readString(data.lede) ?? "",
        summary: readString(data.body) ?? section.summary ?? "",
        layout: "Guest feelings",
        status,
        images: compactImages([imageEntry("heroImage", "Section hero image", readString(data.heroImage), readString(data.heroImageAlt))]),
        items: readRecords(data.carryHomeCards).map((card) => ({
          title: readString(card.title) ?? "",
          copy: readString(card.meta) ?? "",
          image: readString(card.image),
          alt: readString(card.alt),
        })),
      };
    case "kitchen-experience": {
      const heading = [readString(data.heading), readString(data.headingAccent)].filter(Boolean).join(" ");

      return {
        id: "kitchen",
        title: getTitle(section, heading || "Kitchen Experience"),
        copy: readString(data.kicker) ?? "",
        summary: readString(data.body) ?? section.summary ?? "",
        layout: "Image collage",
        status,
        items: readRecords(data.images).map((image, index) => {
          const layoutSlot = readString(image.layoutSlot);

          return {
            title: layoutSlot ? `${layoutSlot[0].toUpperCase()}${layoutSlot.slice(1)} image` : `Image ${index + 1}`,
            copy: readString(image.alt) ?? "",
            image: readString(image.src),
            alt: readString(image.alt),
          };
        }),
      };
    }
    case "stories":
      return {
        id: "stories",
        title: getTitle(section, readString(data.heading) ?? "Stories"),
        copy: readString(data.introAccent) ?? "",
        summary: readString(data.intro) ?? section.summary ?? "",
        layout: "Story cards",
        status,
        images: compactImages([imageEntry("bannerImage", "Section banner image", readString(data.bannerImage))]),
        items: readRecords(data.cards).map((card) => ({
          title: readString(card.title) ?? "",
          copy: readString(card.copy) ?? "",
          image: readString(card.image),
          alt: readString(card.imageAlt),
        })),
      };
    case "signature-experiences":
      return {
        id: "signature",
        title: getTitle(section, readString(data.heading) ?? "Signature Experiences"),
        copy: readString(data.introAccent) ?? "",
        summary: readString(data.intro) ?? section.summary ?? "",
        layout: "Experience cards",
        status,
        items: readRecords(data.cards).map((card) => ({
          title: readString(card.title) ?? "",
          copy: readString(card.copy) ?? "",
          image: readString(card.image),
          alt: readString(card.imageAlt),
        })),
      };
    case "guest-journey": {
      const bodyParagraphs = readStringArray(data.bodyParagraphs);

      return {
        id: "guest-journey",
        title: getTitle(section, readString(data.heading) ?? "Guest Journey"),
        copy: bodyParagraphs[0] ?? "",
        summary: bodyParagraphs.join("\n\n") || section.summary || "",
        layout: "Journey highlights",
        status,
        images: compactImages([imageEntry("image", "Section image", readString(data.image), readString(data.imageAlt))]),
        items: readRecords(data.highlights).map((highlight) => ({
          title: readString(highlight.title) ?? "",
          copy: readString(highlight.copy) ?? "",
        })),
      };
    }
    case "gallery":
      return {
        id: "gallery",
        title: getTitle(section, readString(data.heading) ?? "Gallery"),
        copy: readString(data.intro) ?? "",
        summary: readString(data.intro) ?? section.summary ?? "",
        layout: "Image grid",
        status,
        items: readRecords(data.images).map((image, index) => ({
          title: `Gallery image ${index + 1}`,
          copy: readString(image.alt) ?? "",
          image: readString(image.src),
          alt: readString(image.alt),
        })),
      };
    default:
      if (section.sectionKey.startsWith("custom-")) {
        return {
          id: section.sectionKey, title: getTitle(section, "New section"),
          copy: readString(data.copy) ?? "", summary: readString(data.summary) ?? "",
          layout: "Text and image", status, isNew: false, items: [],
          images: [{ id: "image", label: "Section image", src: readString(data.image) ?? "", alt: readString(data.imageAlt) ?? "" }],
        };
      }
      return null;
  }
}

export function mapAdminSectionsResponse(sections: AdminSectionPayload[] = []) {
  const mappedSections = sections.map(mapBackendSection).filter(Boolean) as HomepageSection[];
  const sectionById = new Map(mappedSections.map((section) => [section.id, section]));

  return [...initialSections.map((fallbackSection) => sectionById.get(fallbackSection.id) ?? fallbackSection),
    ...mappedSections.filter((section) => section.id.startsWith("custom-"))];
}

