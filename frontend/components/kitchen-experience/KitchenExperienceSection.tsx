import Image from "next/image";
import { getActiveItems } from "@/lib/active-items";
import type { KitchenExperienceSectionData } from "@/lib/homepage-sections";
import styles from "./KitchenExperienceSection.module.css";

type KitchenExperienceSectionProps = {
  section: KitchenExperienceSectionData;
};

export function KitchenExperienceSection({ section }: KitchenExperienceSectionProps) {
  const images = getActiveItems(section.images);

  return (
    <section
      className={styles.kitchenExperience}
      id="kitchen-experience"
      aria-labelledby="kitchen-experience-heading"
    >
      <div className={styles.frame}>
        <div className={styles.dotCluster} aria-hidden="true" />
        <div className={styles.leafMark} aria-hidden="true" />

        <div className={styles.contentGrid}>
          <div className={styles.copyBlock}>
<div className={styles.kicker}>
              <span aria-hidden="true">*</span>
              <p>{section.kicker}</p>
            </div>

            <h2 id="kitchen-experience-heading">
              {section.heading}
              <span>{section.headingAccent}</span>
            </h2>

            <div className={styles.divider} aria-hidden="true">
              <span />
            </div>

            <p>{section.body}</p>

            <a className={styles.cta} href={section.ctaHref}>
              <span>{section.ctaLabel}</span>
              <span aria-hidden="true">+</span>
            </a>
          </div>

          <div className={styles.collage} aria-label="Ikayi open kitchen collage">
            {images.map((image) => (
              <div className={styles.tile} key={image.src}>
                <Image src={image.src} alt={image.alt} width={1200} height={1800} sizes="(max-width: 620px) 82vw, (max-width: 980px) 42vw, 310px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
