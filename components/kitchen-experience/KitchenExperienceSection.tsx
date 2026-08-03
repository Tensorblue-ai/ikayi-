import Image from "next/image";
import Link from "next/link";
import styles from "./KitchenExperienceSection.module.css";

const collageImages = [
  {
    src: "/assets/kitch1.png",
    alt: "Ikayi chef cooking over an open flame in the kitchen",
    className: styles.largeTile,
  },
  {
    src: "/assets/kitch2.png",
    alt: "Chef plating dishes in the Ikayi kitchen",
    className: styles.topTile,
  },
  {
    src: "/assets/kitch3.png",
    alt: "Guests watching the Ikayi open kitchen counter",
    className: styles.middleTile,
  },
  {
    src: "/assets/kitch4.png",
    alt: "Final garnish being placed on a plated dish",
    className: styles.bottomTile,
  },
];

export function KitchenExperienceSection() {
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
            <Link className={styles.logoBadge} href="/" aria-label="Ikayi home">
              <span>IKAYI</span>
              <small>Modern Indian</small>
            </Link>

            <div className={styles.kicker}>
              <span aria-hidden="true">*</span>
              <p>The Ikayi Experience</p>
            </div>

            <h2 id="kitchen-experience-heading">
              Open Kitchen
              <span>Experience</span>
            </h2>

            <div className={styles.divider} aria-hidden="true">
              <span />
            </div>

            <p>
              Step into the heart of IKAYI and witness culinary craftsmanship come alive.
              Our open kitchen invites you to experience the rhythm of fire, the artistry
              of flavour, and the joy of connection up close and unfiltered.
            </p>

            <a className={styles.cta} href="#reservations">
              <span>Discover the Kitchen</span>
              <span aria-hidden="true">+</span>
            </a>
          </div>

          <div className={styles.collage} aria-label="Ikayi open kitchen collage">
            {collageImages.map((image) => (
              <div className={`${styles.tile} ${image.className}`} key={image.src}>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 82vw, 620px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}