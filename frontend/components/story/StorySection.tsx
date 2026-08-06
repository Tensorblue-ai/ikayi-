import Image from "next/image";
import { getActiveItems, StorySectionData } from "@/lib/homepage-sections";
import { BrandLogo } from "@/components/brand/BrandLogo";
import styles from "./StorySection.module.css";

type StorySectionProps = {
  section: StorySectionData;
};

export function StorySection({ section }: StorySectionProps) {
  const cards = getActiveItems(section.cards);
  const quoteLines = section.bannerQuote.split("\n");

  return (
    <section className={styles.story} id="stories" aria-labelledby="stories-heading">
      <div className={styles.logoBadge} aria-hidden="true">
        <BrandLogo variant="mark" className={styles.logoImage} decorative />
      </div>

      <div className={styles.inner}>
        <div className={styles.headingBlock}>
          <div className={styles.titleRule} aria-hidden="true">
            <span />
          </div>
          <h2 id="stories-heading">{section.heading}</h2>
          <div className={styles.titleRule} aria-hidden="true">
            <span />
          </div>
        </div>

        <p className={styles.intro}>
          {section.intro}
          {section.introAccent ? <span>{section.introAccent}</span> : null}
        </p>

        <div className={styles.cards}>
          {cards.map((card) => (
            <article className={styles.card} key={card.title}>
              <div className={styles.imageWrap}>
                <Image src={card.image} alt={card.imageAlt || `${card.title} at IKAYI`} fill sizes="(max-width: 760px) 82vw, 220px" />
              </div>
              <div className={styles.iconBadge} aria-hidden="true">{card.icon}</div>
              <h3>{card.title}</h3>
              <div className={styles.cardRule} aria-hidden="true">
                <span />
              </div>
              <p>{card.copy}</p>
              <a href={card.href}>
                Read More <span aria-hidden="true">{`\u2192`}</span>
              </a>
            </article>
          ))}
        </div>

        <div className={styles.storyBanner}>
          <div className={styles.bannerDots} aria-hidden="true" />
          <Image className={styles.bannerArt} src={section.bannerImage} alt="" width={170} height={132} aria-hidden="true" />
          <p>
            <span aria-hidden="true">{`\u201C`}</span>
            {quoteLines.map((line, index) => (
              <span className={styles.quoteLine} key={line}>
                {line}
                {index < quoteLines.length - 1 ? <br /> : null}
              </span>
            ))}
            <span aria-hidden="true">{`\u201D`}</span>
          </p>
          <a href={section.bannerCtaHref}>
            {section.bannerCtaLabel} <span aria-hidden="true">{`\u2726`}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
