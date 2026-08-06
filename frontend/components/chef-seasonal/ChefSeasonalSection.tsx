"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloudRain, Snowflake, Sun, type LucideIcon } from "lucide-react";
import styles from "./ChefSeasonalSection.module.css";

const seasonIcons: Record<string, LucideIcon> = {
  sun: Sun,
  rain: CloudRain,
  snow: Snowflake,
};

function SeasonIcon({ name }: { name: string }) {
  const Icon = seasonIcons[name] ?? Sun;

  return <Icon aria-hidden="true" />;
}

const seasonalMenus = [
  {
    image: "/assets/chef2.png",
    title: "Summer Reverie",
    meta: "Light / Zesty / Refreshing",
    icon: "sun",
  },
  {
    image: "/assets/chef3.png",
    title: "Monsoon Comforts",
    meta: "Warm / Spiced / Hearty",
    icon: "rain",
  },
  {
    image: "/assets/chef4.png",
    title: "Winter Indulgence",
    meta: "Rich / Aromatic / Soulful",
    icon: "snow",
  },
];

export function ChefSeasonalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || isVisible) {
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
      className={`${styles.chefSeasonal} ${isVisible ? styles.isVisible : ""}`}
      id="chef-seasonal"
      aria-labelledby="chef-seasonal-heading"
    >
      <div className={styles.dotPattern} aria-hidden="true" />
      <div className={styles.archSketch} aria-hidden="true" />

      <div className={styles.inner}>
        <article className={styles.chefStory} aria-labelledby="chef-story-heading">
<div className={styles.kicker}>
            <span aria-hidden="true">*</span>
            <p>Our Kitchen</p>
          </div>

          <h2 id="chef-story-heading">Chef&apos;s Story</h2>

          <div className={styles.fineRule} aria-hidden="true">
            <span />
          </div>

          <div className={styles.chefGrid}>
            <div className={styles.storyCopy}>
              <p>Rooted in tradition. Driven by curiosity.</p>
              <p>
                Our chef brings years of experience and a deep respect for Indian flavours,
                reimagined for today&apos;s palate.
              </p>
              <p>Every dish is a memory, every memory a masterpiece.</p>

              <div className={styles.signature}>
                <span>Chef Arjun Mehta</span>
                <small>Executive Chef</small>
              </div>
            </div>

            <div className={styles.chefPortrait}>
              <Image
                src="/assets/chef1.png"
                alt="Ikayi executive chef portrait"
                fill
                sizes="(max-width: 900px) 72vw, 300px"
              />
            </div>
          </div>
        </article>

        <div className={styles.verticalRule} aria-hidden="true" />

        <article className={styles.menuPanel} aria-labelledby="chef-seasonal-heading">
          <div className={styles.kicker}>
            <span aria-hidden="true">*</span>
            <p>From The Seasons</p>
          </div>

          <h2 id="chef-seasonal-heading">Seasonal Menu</h2>
          <p className={styles.menuIntro}>
            Our menu evolves with the seasons, honoring the best of local produce and time-honored ingredients.
          </p>

          <div className={styles.menuCards}>
            {seasonalMenus.map((item) => (
              <article className={styles.menuCard} key={item.title}>
                <div className={styles.seasonIcon} aria-hidden="true"><SeasonIcon name={item.icon} /></div>
                <div className={styles.menuImage}>
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 82vw, 220px" />
                </div>
                <div className={styles.cardCopy}>
                  <h3>{item.title}</h3>
                  <div className={styles.cardRule} aria-hidden="true">
                    <span />
                  </div>
                  <p>{item.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>

      <p className={styles.closingLine}>Thoughtful ingredients. Timeless recipes. Always in season.</p>
      <div className={styles.bottomRule} aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
