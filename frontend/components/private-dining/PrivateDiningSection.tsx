"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getActiveItems, GuestJourneySectionData } from "@/lib/homepage-sections";
import styles from "./PrivateDiningSection.module.css";

type PrivateDiningSectionProps = {
  section: GuestJourneySectionData;
};

function splitHeading(heading: string) {
  if (heading.includes(" To ")) {
    const [beforeTo, afterTo] = heading.split(" To ");
    return [beforeTo, `To ${afterTo}`];
  }

  const words = heading.split(" ");
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")].filter(Boolean);
}

export function PrivateDiningSection({ section }: PrivateDiningSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const highlights = getActiveItems(section.highlights);
  const headingLines = splitHeading(section.heading);

  useEffect(() => {
    const currentSection = sectionRef.current;

    if (!currentSection || isVisible) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(currentSection);

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.privateDining} ${isVisible ? styles.isVisible : ""}`}
      id="private-dining"
      aria-labelledby="private-dining-heading"
    >
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
            src={section.image}
            alt={section.imageAlt}
            fill
            sizes="(max-width: 980px) 90vw, 620px"
          />
        </div>

        <div className={styles.copyPanel}>
          <div className={styles.kicker}>
            <span aria-hidden="true">*</span>
            <p>{section.kicker}</p>
            <span aria-hidden="true">*</span>
          </div>

          <h2 id="private-dining-heading">
            {headingLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <div className={styles.divider} aria-hidden="true" />

          {section.bodyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

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
            <a className={styles.primaryAction} href={section.primaryCtaHref}>
              <span>{section.primaryCtaLabel}</span>
              <b aria-hidden="true">+</b>
            </a>
            <a className={styles.secondaryAction} href={section.secondaryCtaHref}>
              <span>{section.secondaryCtaLabel}</span>
              <b aria-hidden="true">{`\u2192`}</b>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
