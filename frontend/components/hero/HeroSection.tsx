import Image from "next/image";
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
          <span className={styles.star}>*</span>
          <span>Modern Indian</span>
        </div>

        <h1>
          Gather Around
          <span>The Table.</span>
        </h1>

        <div className={styles.divider} aria-hidden="true">
          <span />
        </div>

        <div className={styles.actions}>
          <a className={styles.primaryAction} href="#reservations">
            <span>Reserve Your Table</span>
            <span aria-hidden="true">+</span>
          </a>
          <a className={styles.secondaryAction} href="#experience">
            <span>Explore Ikayi</span>
            <span aria-hidden="true">+</span>
          </a>
        </div>
      </div>
    </section>
  );
}


