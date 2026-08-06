import Image from "next/image";
import { getActiveItems, KitchenExperienceSectionData, KitchenImage } from "@/lib/homepage-sections";
import styles from "./KitchenExperienceSection.module.css";

type KitchenExperienceSectionProps = {
  section: KitchenExperienceSectionData;
};

function getTileClass(image: KitchenImage) {
  const slotClasses = {
    large: styles.largeTile,
    top: styles.topTile,
    middle: styles.middleTile,
    bottom: styles.bottomTile,
  };

  return slotClasses[image.layoutSlot];
}

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
              <div className={`${styles.tile} ${getTileClass(image)}`} key={image.src}>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 82vw, 620px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
