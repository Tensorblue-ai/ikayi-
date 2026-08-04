import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { KitchenExperienceSection } from "@/components/kitchen-experience/KitchenExperienceSection";
import { ChefSeasonalSection } from "@/components/chef-seasonal/ChefSeasonalSection";
import { StorySection } from "@/components/story/StorySection";
import { SignatureExperiencesSection } from "@/components/signature-experiences/SignatureExperiencesSection";
import { PrivateDiningSection } from "@/components/private-dining/PrivateDiningSection";
import { GallerySection } from "@/components/gallery/GallerySection";
import { TestimonialsFooterSection } from "@/components/testimonials-footer/TestimonialsFooterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ExperienceSection />
      <KitchenExperienceSection />
      <ChefSeasonalSection />
      <StorySection />
      <SignatureExperiencesSection />
      <PrivateDiningSection />
      <GallerySection />
      <TestimonialsFooterSection />
    </main>
  );
}
