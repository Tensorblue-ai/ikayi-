import { connection } from "next/server";
import { handleApi } from "@/server/api";
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
  imageAlt?: string;
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


export type ReservationDateOption = SortableItem & {
  day: string;
  label: string;
  selected?: boolean;
};

export type ReservationSectionData = {
  sectionKey: "reservations";
  image: string;
  imageAlt: string;
  tabs: string[];
  details: string[];
  title: string;
  priceLabel: string;
  description: string;
  note: string;
  bookingTitle: string;
  dateOptions?: ReservationDateOption[];
  timeSlots: string[];
  defaultGuests: number;
  helperText: string;
  primaryCtaLabel: string;
  inquiryCtaLabel: string;
  inquiryCtaHref: string;
  policyLabel: string;
  policyHref: string;
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

const sectionPhotos: Record<string, [string, string]> = {
  "exp1.png": ["table-setting", "A table set for guests in Ikayi's dining room"],
  "exp2.png": ["welcome", "A member of Ikayi's hospitality team"],
  "exp3.png": ["table-details", "Floral tableware and flowers at Ikayi"],
  "exp4.png": ["arched-dining", "An intimate dining corner framed by warm arches"],
  "exp5.png": ["hospitality-team", "Ikayi's hospitality team in the dining room"],
  "3a74090f-1488-4026-a5ae-8a1e845600e2.png": ["ikayi-team", "The Ikayi team gathered by the open kitchen"],
  "kitch1.png": ["chef-at-work", "An Ikayi chef preparing a dish in the open kitchen"],
  "kitch2.png": ["finishing-touches", "An Ikayi chef adding finishing touches to small bites"],
  "kitch3.png": ["open-kitchen", "Ikayi's open kitchen overlooking the dining room"],
  "kitch4.png": ["kitchen-preparation", "An Ikayi chef preparing ingredients at the counter"],
  "story1.png": ["kitchen-team", "Ikayi's kitchen team together before service"],
  "story2.png": ["hospitality-team", "A warm welcome from Ikayi's hospitality team"],
  "story3.png": ["intimate-table", "A carefully set table beneath Ikayi's arches"],
  "story4.png": ["dining-corner", "Warm lighting and thoughtful details in Ikayi's dining room"],
  "chef5.png": ["small-bites", "A selection of small bites served at Ikayi"],
  "chef7.png": ["shared-dining", "Tables ready for a shared meal at Ikayi"],
  "chef9.png": ["dining-perspective", "Ikayi's dining room set for arriving guests"],
  "reservation.png": ["intimate-table", "A table ready for an intimate dining experience at Ikayi"],
};

function replaceSectionPhotos(_key: string, value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/^https?:\/\/((localhost|127\.0\.0\.1)(:\d+)?|[a-z0-9-]+\.trycloudflare\.com)\/api\/assets\//i, "/api/assets/");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;

  const item = value as Record<string, unknown>;
  for (const [imageKey, altKey] of [["image", "imageAlt" in item ? "imageAlt" : "alt"], ["src", "alt"], ["heroImage", "heroImageAlt"]]) {
    const source = item[imageKey];
    if (typeof source !== "string" || !source.includes("/api/assets/assets/")) continue;
    const photo = sectionPhotos[source.split("/").pop() ?? ""];
    if (!photo) continue;
    item[imageKey] = `/assets/ikayi/${photo[0]}.jpg`;
    item[altKey] = photo[1];
  }
  return item;
}

export async function getHomepageSections(): Promise<HomepageSections> {
  await connection();
  const response = await handleApi(new Request("http://ikayi.internal/api/admin/sections"));

  if (!response.ok) {
    throw new Error(`Homepage sections request failed with ${response.status}`);
  }

  const payload = JSON.parse(await response.text(), replaceSectionPhotos) as ApiSectionsResponse;
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
type ApiSectionResponse<T> = {
  section?: T;
};

export async function getReservationSection(): Promise<ReservationSectionData | null> {
  await connection();
  const response = await handleApi(new Request("http://ikayi.internal/api/admin/sections/reservations"));

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Reservation section request failed with ${response.status}`);
  }

  const payload = JSON.parse(await response.text(), replaceSectionPhotos) as ApiSectionResponse<ReservationSectionData>;
  return payload.section && payload.section.isPublished !== false ? payload.section : null;
}
