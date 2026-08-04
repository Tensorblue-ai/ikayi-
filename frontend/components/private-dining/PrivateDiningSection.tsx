"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./PrivateDiningSection.module.css";

const highlights = [
  {
    title: "Arrival",
    copy: "Reservation details, names, and preferences remembered",
    icon: "*",
  },
  {
    title: "At The Table",
    copy: "Welcome drink first, then menus once guests settle",
    icon: "+",
  },
  {
    title: "Departure",
    copy: "A sincere thank-you, feedback, and a memorable final touch",
    icon: "~",
  },
];

export function PrivateDiningSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || isVisible) {
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

    observer.observe(section);

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
            src="/assets/chef9.png"
            alt="Private dining table set inside Ikayi's arched dining room"
            fill
            sizes="(max-width: 980px) 90vw, 620px"
          />
        </div>

        <div className={styles.copyPanel}>
          <div className={styles.kicker}>
            <span aria-hidden="true">*</span>
            <p>Guest Journey</p>
            <span aria-hidden="true">*</span>
          </div>

          <h2 id="private-dining-heading">
            <span>From Reservation</span>
            <span>To Departure</span>
          </h2>
          <div className={styles.divider} aria-hidden="true" />

          <p>
            The guest journey begins when a reservation is made, not when someone reaches
            the door. Names and preferences should be captured so recognition feels natural.
          </p>
          <p>
            Guests should feel as though they have arrived at someone&apos;s home: greeted warmly,
            seated with care, welcomed immediately, and thanked personally before they leave.
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
              <b aria-hidden="true">{`\u2192`}</b>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
