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

export default async function Home() {
  const sections = await getHomepageSections();

  return (
    <main>
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
