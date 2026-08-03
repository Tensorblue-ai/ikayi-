import Image from "next/image";
import styles from "./SignatureExperiencesSection.module.css";

const experiences = [
  {
    image: "/assets/chef5.png",
    title: "Chef's Table",
    copy: "A curated multi-course journey crafted just for you.",
    icon: "cloche",
  },
  {
    image: "/assets/chef6.png",
    title: "High Tea",
    copy: "Elegant conversations over curated teas and delicacies.",
    icon: "cup",
  },
  {
    image: "/assets/chef7.png",
    title: "Sunday Brunch",
    copy: "Long tables, great food, and even better company.",
    icon: "table",
  },
  {
    image: "/assets/chef8.png",
    title: "Sunset Sessions",
    copy: "Cocktails, conversations and Lucknow's golden hour.",
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
        Curated moments. Timeless flavours. Unforgettable memories.
        <span>
          At IKAYI, every experience is designed to bring people together through food,
          conversation, and the joy of being present.
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
        <p>Where Every Occasion Becomes Special</p>
        <span>
          From intimate dinners to grand celebrations, our spaces and experiences are tailored
          to make every moment extraordinary.
        </span>
        <a href="#gallery">
          <span>Explore Our Spaces</span>
          <b aria-hidden="true">+</b>
        </a>
      </div>
    </section>
  );
}

