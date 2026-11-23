import { ChefSeasonalSection } from "@/components/chef-seasonal/ChefSeasonalSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { GallerySection } from "@/components/gallery/GallerySection";
import { HeroSection } from "@/components/hero/HeroSection";
import { KitchenExperienceSection } from "@/components/kitchen-experience/KitchenExperienceSection";
import { PrivateDiningSection } from "@/components/private-dining/PrivateDiningSection";
import { SignatureExperiencesSection } from "@/components/signature-experiences/SignatureExperiencesSection";
import { StorySection } from "@/components/story/StorySection";
import { TestimonialsFooterSection } from "@/components/testimonials-footer/TestimonialsFooterSection";
import { getHomepageSections } from "@/lib/homepage-sections";
import { pageMetadata, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata(
  "IKAYI | Modern Indian Restaurant in Lucknow",
  "Discover IKAYI in Lucknow: modern Indian dining, an open kitchen, seasonal menus and signature experiences. Reserve your table for lunch or dinner.",
  "/"
);

export default async function Home() {
  const sections = await getHomepageSections();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "@id": new URL("/#restaurant", siteUrl).href,
        name: "IKAYI",
        url: siteUrl.href,
        image: new URL("/assets/ikayi/dining-room.jpg", siteUrl).href,
        servesCuisine: "Modern Indian",
        sameAs: ["https://www.instagram.com/ikayi_lucknow/"],
        acceptsReservations: new URL("/reservations", siteUrl).href,
      }).replace(/</g, "\\u003c") }} />
      <HeroSection />
      {sections.experience ? <ExperienceSection section={sections.experience} /> : null}
      {sections["kitchen-experience"] ? <KitchenExperienceSection section={sections["kitchen-experience"]} /> : null}
      <ChefSeasonalSection />
      {sections.stories ? <StorySection section={sections.stories} /> : null}
      {sections["signature-experiences"] ? (
        <SignatureExperiencesSection section={sections["signature-experiences"]} />
      ) : null}
      {sections["guest-journey"] ? <PrivateDiningSection section={sections["guest-journey"]} /> : null}
      {sections.gallery ? <GallerySection section={sections.gallery} /> : null}
      <TestimonialsFooterSection />
    </main>
  );
}
