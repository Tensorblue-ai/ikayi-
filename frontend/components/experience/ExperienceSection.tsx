import Image from "next/image";
import { getActiveItems } from "@/lib/active-items";
import type { ExperienceSectionData } from "@/lib/homepage-sections";
import styles from "./ExperienceSection.module.css";

type ExperienceSectionProps = {
  section: ExperienceSectionData;
};

function renderHeadingLine(line: string) {
  const [firstWord, ...remainingWords] = line.split(" ");

  return (
    <>
      <span>{firstWord}</span>{remainingWords.length ? ` ${remainingWords.join(" ")}` : ""}
    </>
  );
}

export function ExperienceSection({ section }: ExperienceSectionProps) {
  const cards = getActiveItems(section.carryHomeCards);

  return (
    <section className={styles.experience} id="experience" aria-labelledby="experience-heading">
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={styles.introGrid}>
        <div className={styles.archImageWrap}>
          <Image
            className={styles.archImage}
            src={section.heroImage}
            alt={section.heroImageAlt}
            fill
            sizes="(max-width: 900px) 72vw, 340px"
          />
        </div>

        <div className={styles.copyBlock}>
          <div className={styles.kicker}>
            <span />
            <p>{section.kicker}</p>
            <b aria-hidden="true">*</b>
          </div>

          <h2 id="experience-heading">
            {section.headingLines.map((line, index) => (
              <span className={styles.headingLine} key={line}>
                {renderHeadingLine(line)}
                {index < section.headingLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>

          <div className={styles.smallDivider} aria-hidden="true">
            <span>*</span>
          </div>

          <p className={styles.lede}>{section.lede}</p>
          <p className={styles.bodyCopy}>{section.body}</p>

          <a className={styles.cta} href={section.ctaHref}>
            <span>{section.ctaLabel}</span>
            <span aria-hidden="true">+</span>
          </a>
        </div>
      </div>

      <div className={styles.featuredHeader}>
        <span aria-hidden="true" />
        <p>* {section.carryHomeTitle} *</p>
        <span aria-hidden="true" />
      </div>

      <div className={styles.cardRow} aria-label="Guest feelings">
        <div className={styles.cards}>
          {cards.map((dish) => (
            <article className={styles.card} key={dish.title}>
              <div className={styles.cardImageWrap}>
                <Image className={styles.cardImage} src={dish.image} alt={dish.alt || dish.title} fill sizes="260px" />
              </div>
              <h3>{dish.title}</h3>
              <p>{dish.meta}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
