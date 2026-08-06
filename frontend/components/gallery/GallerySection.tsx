import Image from "next/image";
import { GallerySectionData, getActiveItems } from "@/lib/homepage-sections";
import styles from "./GallerySection.module.css";

type GallerySectionProps = {
  section: GallerySectionData;
};

export function GallerySection({ section }: GallerySectionProps) {
  const galleryImages = getActiveItems(section.images);

  return (
    <section className={styles.gallery} id="gallery" aria-labelledby="gallery-heading">
      <div className={styles.leftLeaf} aria-hidden="true" />
      <div className={styles.rightFloral} aria-hidden="true" />

      <div className={styles.headingBlock}>
        <div className={styles.titleRule} aria-hidden="true">
          <span />
        </div>
        <h2 id="gallery-heading">{section.heading}</h2>
        <div className={styles.titleRule} aria-hidden="true">
          <span />
        </div>
      </div>

      <p className={styles.intro}>{section.intro}</p>

      <div className={styles.collage} aria-label="Ikayi gallery collage">
        {galleryImages.map((image) => (
          <div className={styles.tile} key={image.src}>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 620px) 92vw, (max-width: 980px) 50vw, 32vw" />
          </div>
        ))}
      </div>

      <a className={styles.cta} href={section.ctaHref}>
        <span>{section.ctaLabel}</span>
        <b aria-hidden="true">{`\u2726`}</b>
      </a>
    </section>
  );
}
