export type SortableItem = {
  sortOrder?: number;
  isActive?: boolean;
};

export type ExperienceCard = SortableItem & {
  title: string;
  meta: string;
  image: string;
  alt?: string;
};

export type ExperienceSectionData = {
  sectionKey: "experience";
  kicker: string;
  headingLines: string[];
  lede: string;
  body: string;
  heroImage: string;
  heroImageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  carryHomeTitle: string;
  carryHomeCards: ExperienceCard[];
  isPublished?: boolean;
};

export type KitchenImage = SortableItem & {
  src: string;
  alt: string;
  layoutSlot: "large" | "top" | "middle" | "bottom";
};

export type KitchenExperienceSectionData = {
  sectionKey: "kitchen-experience";
  kicker: string;
  heading: string;
  headingAccent: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  images: KitchenImage[];
  isPublished?: boolean;
};

export type StoryCard = SortableItem & {
  title: string;
  copy: string;
  image: string;
  imageAlt?: string;
  href: string;
  icon: string;
};

export type StorySectionData = {
  sectionKey: "stories";
  heading: string;
  intro: string;
  introAccent: string;
  cards: StoryCard[];
  bannerQuote: string;
  bannerImage: string;
  bannerCtaLabel: string;
  bannerCtaHref: string;
  isPublished?: boolean;
};

export type SignatureCard = SortableItem & {
  title: string;
  copy: string;
  image: string;
  icon: string;
};

export type SignatureExperienceSectionData = {
  sectionKey: "signature-experiences";
  heading: string;
  intro: string;
  introAccent: string;
  cards: SignatureCard[];
  footerTitle: string;
  footerCopy: string;
  footerCtaLabel: string;
  footerCtaHref: string;
  isPublished?: boolean;
};

export type GuestJourneyHighlight = SortableItem & {
  title: string;
  copy: string;
  icon: string;
};

export type GuestJourneySectionData = {
  sectionKey: "guest-journey";
  kicker: string;
  heading: string;
  bodyParagraphs: string[];
  image: string;
  imageAlt: string;
  highlights: GuestJourneyHighlight[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  isPublished?: boolean;
};

export type GalleryImage = SortableItem & {
  src: string;
  alt: string;
};

export type GallerySectionData = {
  sectionKey: "gallery";
  heading: string;
  intro: string;
  images: GalleryImage[];
  ctaLabel: string;
  ctaHref: string;
  isPublished?: boolean;
};

export type HomepageSections = {
  experience?: ExperienceSectionData;
  "kitchen-experience"?: KitchenExperienceSectionData;
  stories?: StorySectionData;
  "signature-experiences"?: SignatureExperienceSectionData;
  "guest-journey"?: GuestJourneySectionData;
  gallery?: GallerySectionData;
};

type ApiSection = {
  sectionKey: keyof HomepageSections;
  isPublished?: boolean;
  data?: HomepageSections[keyof HomepageSections];
};

type ApiSectionsResponse = {
  sections?: ApiSection[];
};

export function getActiveItems<T extends SortableItem>(items: T[] = []): T[] {
  return items
    .filter((item) => item.isActive !== false)
    .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0));
}

export async function getHomepageSections(): Promise<HomepageSections> {
  const apiOrigin = process.env.IKAYI_API_ORIGIN || process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:5000";
  const response = await fetch(`${apiOrigin}/api/admin/sections`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Homepage sections request failed with ${response.status}`);
  }

  const payload = (await response.json()) as ApiSectionsResponse;
  const homepageSections: HomepageSections = {};

  for (const entry of payload.sections ?? []) {
    if (!entry.data || entry.isPublished === false || entry.data.isPublished === false) {
      continue;
    }

    switch (entry.sectionKey) {
      case "experience":
        homepageSections.experience = entry.data as ExperienceSectionData;
        break;
      case "kitchen-experience":
        homepageSections["kitchen-experience"] = entry.data as KitchenExperienceSectionData;
        break;
      case "stories":
        homepageSections.stories = entry.data as StorySectionData;
        break;
      case "signature-experiences":
        homepageSections["signature-experiences"] = entry.data as SignatureExperienceSectionData;
        break;
      case "guest-journey":
        homepageSections["guest-journey"] = entry.data as GuestJourneySectionData;
        break;
      case "gallery":
        homepageSections.gallery = entry.data as GallerySectionData;
        break;
    }
  }

  return homepageSections;
}
