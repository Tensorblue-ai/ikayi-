import Image from "next/image";
import styles from "./GallerySection.module.css";

const galleryImages = [
  {
    src: "/assets/chef5.png",
    alt: "Ikayi chef preparing a refined modern Indian plate",
  },
  {
    src: "/assets/exp1.png",
    alt: "Signature Ikayi plated dessert served with dramatic presentation",
  },
  {
    src: "/assets/exp4.png",
    alt: "Ikayi cocktail with small plates in the background",
  },
  {
    src: "/assets/kitch1.png",
    alt: "Ikayi chef cooking over an open flame",
  },
  {
    src: "/assets/exp3.png",
    alt: "Ikayi signature dish presented with warm table styling",
  },
  {
    src: "/assets/kitch3.png",
    alt: "Guests watching the Ikayi open kitchen counter",
  },
  {
    src: "/assets/exp2.png",
    alt: "Ikayi dish with herbs and cocktail styling",
  },
  {
    src: "/assets/story4.png",
    alt: "Lucknow architecture at sunset",
  },
  {
    src: "/assets/exp5.png",
    alt: "Creamy Ikayi cocktail with garnish",
  },
  {
    src: "/assets/kitch2.png",
    alt: "Ikayi chef preparing dishes in the kitchen",
  },
  {
    src: "/assets/chef9.png",
    alt: "Ikayi curry plated with Indian breads",
  },
];

export function GallerySection() {
  return (
    <section className={styles.gallery} id="gallery" aria-labelledby="gallery-heading">
      <div className={styles.logoBadge} aria-hidden="true">
        <span>IKAYI</span>
        <small>Modern Indian</small>
      </div>
      <div className={styles.leftLeaf} aria-hidden="true" />
      <div className={styles.rightFloral} aria-hidden="true" />

      <div className={styles.headingBlock}>
        <div className={styles.titleRule} aria-hidden="true">
          <span />
        </div>
        <h2 id="gallery-heading">Gallery</h2>
        <div className={styles.titleRule} aria-hidden="true">
          <span />
        </div>
      </div>

      <p className={styles.intro}>A glimpse into our world of flavours, ambiance, and unforgettable moments.</p>

      <div className={styles.collage} aria-label="Ikayi gallery collage">
        {galleryImages.map((image) => (
          <div className={styles.tile} key={image.src}>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 45vw, 210px" />
          </div>
        ))}
      </div>

      <a className={styles.cta} href="#stories">
        <span>Explore More Moments</span>
        <b aria-hidden="true">{`\u2726`}</b>
      </a>
    </section>
  );
}