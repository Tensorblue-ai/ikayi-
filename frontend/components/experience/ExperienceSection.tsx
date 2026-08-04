import Image from "next/image";
import styles from "./ExperienceSection.module.css";

const dishes = [
  {
    image: "/assets/exp2.png",
    title: "Welcomed",
    meta: "Expected / Recognised / Genuinely cared for",
  },
  {
    image: "/assets/exp3.png",
    title: "Celebrated",
    meta: "Personal / Thoughtful / Occasion-led",
  },
  {
    image: "/assets/exp4.png",
    title: "Calm",
    meta: "Unhurried / Easy / Without performance",
  },
  {
    image: "/assets/exp5.png",
    title: "Connected",
    meta: "Guests / Team / Community / Craft",
  },
];

export function ExperienceSection() {
  return (
    <section className={styles.experience} id="experience" aria-labelledby="experience-heading">
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={styles.introGrid}>
        <div className={styles.archImageWrap}>
          <Image
            className={styles.archImage}
            src="/assets/exp1.png"
            alt="An intimate Ikayi dining table set inside an arched room"
            fill
            sizes="(max-width: 900px) 72vw, 340px"
          />
        </div>

        <div className={styles.copyBlock}>
          <div className={styles.kicker}>
            <span />
            <p>Our Philosophy</p>
            <b aria-hidden="true">*</b>
          </div>

          <h2 id="experience-heading">
            <span>Hospitality</span> before service.
            <br />
            <span>Connection</span> before transaction.
            <br />
            <span>Experience</span> before consumption.
          </h2>

          <div className={styles.smallDivider} aria-hidden="true">
            <span>*</span>
          </div>

          <p className={styles.lede}>Every meal begins with a welcome.</p>
          <p className={styles.bodyCopy}>
            IKAYI is built on oneness: guests, team, community, artisans, farmers,
            Lucknow, and India held as one thread. Every detail should feel warm,
            harmonious, and refined.
          </p>

          <a className={styles.cta} href="#stories">
            <span>Explore Our Journey</span>
            <span aria-hidden="true">+</span>
          </a>
        </div>
      </div>

      <div className={styles.featuredHeader}>
        <span aria-hidden="true" />
        <p>* The Feeling Guests Carry Home *</p>
        <span aria-hidden="true" />
      </div>

      <div className={styles.cardRow} aria-label="Guest feelings">

        <div className={styles.cards}>
          {dishes.map((dish) => (
            <article className={styles.card} key={dish.title}>
              <div className={styles.cardImageWrap}>
                <Image className={styles.cardImage} src={dish.image} alt={dish.title} fill sizes="260px" />
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
