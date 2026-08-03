import Image from "next/image";
import styles from "./PrivateDiningSection.module.css";

const highlights = [
  {
    title: "Intimate Celebrations",
    copy: "Birthdays, anniversaries, special evenings",
    icon: "*",
  },
  {
    title: "Curated Dining",
    copy: "Personalized menus and attentive service",
    icon: "+",
  },
  {
    title: "Elegant Setting",
    copy: "Warm interiors, privacy, and refined atmosphere",
    icon: "~",
  },
];

export function PrivateDiningSection() {
  return (
    <section className={styles.privateDining} id="private-dining" aria-labelledby="private-dining-heading">
      <div className={styles.logoBadge} aria-hidden="true">
        <span>IKAYI</span>
        <small>Modern Indian</small>
      </div>
      <div className={styles.dotGrid} aria-hidden="true" />
      <div className={styles.archMark} aria-hidden="true" />
      <div className={styles.circleAccent} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.imagePanel}>
          <Image
            className={styles.heroImage}
            src="/assets/chef9.png"
            alt="Private dining table set inside Ikayi's arched dining room"
            fill
            sizes="(max-width: 980px) 90vw, 620px"
          />
        </div>

        <div className={styles.copyPanel}>
          <div className={styles.kicker}>
            <span aria-hidden="true">*</span>
            <p>Exclusive Gatherings</p>
            <span aria-hidden="true">*</span>
          </div>

          <h2 id="private-dining-heading">Private Dining</h2>
          <div className={styles.divider} aria-hidden="true" />

          <p>
            Host intimate celebrations, milestone dinners, and meaningful gatherings in a
            space designed for warmth, privacy, and effortless hospitality.
          </p>
          <p>
            From family occasions to curated business dinners, every detail is thoughtfully
            arranged to make the evening feel personal and memorable.
          </p>

          <div className={styles.highlights}>
            {highlights.map((highlight) => (
              <article className={styles.highlightCard} key={highlight.title}>
                <div className={styles.iconBadge} aria-hidden="true">
                  {highlight.icon}
                </div>
                <h3>{highlight.title}</h3>
                <div className={styles.cardDivider} aria-hidden="true" />
                <p>{highlight.copy}</p>
              </article>
            ))}
          </div>

          <div className={styles.actions}>
            <a className={styles.primaryAction} href="#reservations">
              <span>Enquire Now</span>
              <b aria-hidden="true">+</b>
            </a>
            <a className={styles.secondaryAction} href="#gallery">
              <span>View Dining Spaces</span>
              <b aria-hidden="true">→</b>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
