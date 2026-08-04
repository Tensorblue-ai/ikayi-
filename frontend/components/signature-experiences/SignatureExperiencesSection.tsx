import Image from "next/image";
import { getActiveItems, SignatureExperienceSectionData } from "@/lib/homepage-sections";
import styles from "./SignatureExperiencesSection.module.css";

type SignatureExperiencesSectionProps = {
  section: SignatureExperienceSectionData;
};

function getIconSymbol(icon: string) {
  return icon === "cup" ? "~" : icon === "table" ? "*" : "+";
}

export function SignatureExperiencesSection({ section }: SignatureExperiencesSectionProps) {
  const experiences = getActiveItems(section.cards);

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
        <h2 id="signature-heading">{section.heading}</h2>
        <div className={styles.titleRule} aria-hidden="true">
          <span />
        </div>
      </div>

      <p className={styles.intro}>
        {section.intro}
        {section.introAccent ? <span>{section.introAccent}</span> : null}
      </p>

      <div className={styles.cards} aria-label="Signature experiences">
        {experiences.map((experience) => (
          <article className={styles.card} key={experience.title}>
            <div className={styles.imageWrap}>
              <Image src={experience.image} alt={experience.title} fill sizes="280px" />
            </div>
            <div className={styles.iconBadge} aria-hidden="true">
              <span>{getIconSymbol(experience.icon)}</span>
            </div>
            <h3>{experience.title}</h3>
            <div className={styles.cardDivider} aria-hidden="true" />
            <p>{experience.copy}</p>
          </article>
        ))}
      </div>

      <div className={styles.footerPanel}>
        <div className={styles.dotGrid} aria-hidden="true" />
        <p>{section.footerTitle}</p>
        <span>{section.footerCopy}</span>
        <a href={section.footerCtaHref}>
          <span>{section.footerCtaLabel}</span>
          <b aria-hidden="true">+</b>
        </a>
      </div>
    </section>
  );
}
