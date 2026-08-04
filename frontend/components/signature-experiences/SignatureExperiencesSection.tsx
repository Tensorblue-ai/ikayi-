import Image from "next/image";
import styles from "./SignatureExperiencesSection.module.css";

const experiences = [
  {
    image: "/assets/chef5.png",
    title: "Ikayi High Tea",
    copy: "A relaxed, elegant afternoon pause with sweet and savoury offerings.",
    icon: "cloche",
  },
  {
    image: "/assets/chef6.png",
    title: "Veranda Ritual",
    copy: "Sunset cocktails, small bites, and a curated shift into evening.",
    icon: "cup",
  },
  {
    image: "/assets/chef7.png",
    title: "Ikayi Brunch",
    copy: "Sharing-style dishes served to the table with convivial abundance.",
    icon: "table",
  },
  {
    image: "/assets/chef8.png",
    title: "Welcome Ritual",
    copy: "A signature IKAYI gesture being developed ahead of opening.",
    icon: "glass",
  },
];

export function SignatureExperiencesSection() {
  return (
    <section className={styles.signature} id="signature-experiences" aria-labelledby="signature-heading">
      <div className={styles.logoBadge} aria-hidden="true">
        <span>IKAYI</span>
        <small>Modern Indian</small>
      </div>

      <div className={styles.headingBlock}>
        <div className={styles.titleRule} aria-hidden="true">
          <span />
        </div>
        <h2 id="signature-heading">Signature Experiences</h2>
        <div className={styles.titleRule} aria-hidden="true">
          <span />
        </div>
      </div>

      <p className={styles.intro}>
        Signature moments shaped by warmth, rhythm, and recognition.
        <span>
          These experiences are designed to make afternoons unhurried, sunsets memorable,
          and gatherings feel abundant without overwhelming conversation.
        </span>
      </p>

      <div className={styles.cards} aria-label="Signature experiences">
        {experiences.map((experience) => (
          <article className={styles.card} key={experience.title}>
            <div className={styles.imageWrap}>
              <Image src={experience.image} alt={experience.title} fill sizes="280px" />
            </div>
            <div className={styles.iconBadge} aria-hidden="true">
              <span>{experience.icon === "cup" ? "~" : experience.icon === "table" ? "*" : "+"}</span>
            </div>
            <h3>{experience.title}</h3>
            <div className={styles.cardDivider} aria-hidden="true" />
            <p>{experience.copy}</p>
          </article>
        ))}
      </div>

      <div className={styles.footerPanel}>
        <div className={styles.dotGrid} aria-hidden="true" />
        <p>Traffic Tools, Not Brand Positioning</p>
        <span>
          Happy Hour and selective 20% vouchers can support quieter periods, but they should
          never compete with IKAYI&apos;s premium, artisan-led identity.
        </span>
        <a href="#gallery">
          <span>Explore Our Spaces</span>
          <b aria-hidden="true">+</b>
        </a>
      </div>
    </section>
  );
}
