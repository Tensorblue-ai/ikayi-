import Image from "next/image";
import { BrandLogo } from "@/components/brand/BrandLogo";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Ikayi restaurant hero">
      <Image
        className={styles.backgroundImage}
        src="/assets/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.leftBlurLayer} aria-hidden="true" />
      <div className={styles.tintLayer} aria-hidden="true" />
      <div className={styles.floralLeft} aria-hidden="true" />
      <div className={styles.floralRight} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <BrandLogo variant="mark" className={styles.eyebrowLogo} decorative />
          <span>Rooted in Unity</span>
        </div>

        <h1>
          We Are Because
          <span>You Are.</span>
        </h1>

        <div className={styles.divider} aria-hidden="true">
          <BrandLogo variant="mark" className={styles.dividerLogo} decorative />
        </div>

        <div className={styles.actions}>
          <a className={styles.primaryAction} href="/reservations">
            <span>Reserve Your Table</span>
            <span aria-hidden="true">+</span>
          </a>
          <a className={styles.secondaryAction} href="#experience">
            <span>Discover Ikayi</span>
            <span aria-hidden="true">+</span>
          </a>
        </div>

        <div className={styles.heroDetails} aria-label="Ikayi dining details">
          <span>
            <strong>Lucknow</strong>
            <small>Modern Indian</small>
          </span>
          <span>
            <strong>Open Kitchen</strong>
            <small>Seasonal fire-led plates</small>
          </span>
          <span>
            <strong>Hospitality First</strong>
            <small>Connection before transaction</small>
          </span>
        </div>
      </div>
    </section>
  );
}
