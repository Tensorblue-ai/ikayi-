import type { Metadata } from "next";

export const siteUrl = new URL(process.env.IKAYI_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"));

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: new URL(path, siteUrl).href },
    openGraph: {
      type: "website",
      siteName: "IKAYI",
      locale: "en_IN",
      title,
      description,
      url: new URL(path, siteUrl).href,
      images: [{ url: new URL("/assets/ikayi/dining-room.jpg", siteUrl).href, alt: "IKAYI modern Indian restaurant in Lucknow" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/assets/ikayi/dining-room.jpg", siteUrl).href],
    },
  };
}
