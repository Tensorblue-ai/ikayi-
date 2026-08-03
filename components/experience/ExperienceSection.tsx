import Image from "next/image";
import styles from "./ExperienceSection.module.css";

const dishes = [
  {
    image: "/assets/exp2.png",
    title: "Smoked Galouti Kebab",
    meta: "Saffron / Raw Papaya / Gulab Jal",
  },
  {
    image: "/assets/exp3.png",
    title: "Lucknowi Nalli Nihari",
    meta: "Slow Cooked / Heritage Spices",
  },
  {
    image: "/assets/exp4.png",
    title: "Tandoori Black Cod",
    meta: "Kasundi / Methi / Leek Ash",
  },
  {
    image: "/assets/exp5.png",
    title: "Kesar Pista Rasmalai",
    meta: "Saffron Milk / Rose / Pistachio",
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
            At IKAYI, we bring together Indian fine culinary heritage through a modern lens,
            creating a space where warmth, intent, and authenticity shape every moment.
          </p>

          <a className={styles.cta} href="#stories">
            <span>Explore Our Journey</span>
            <span aria-hidden="true">+</span>
          </a>
        </div>
      </div>

      <div className={styles.featuredHeader}>
        <span aria-hidden="true" />
        <p>* Featured Signature Dishes *</p>
        <span aria-hidden="true" />
      </div>

      <div className={styles.cardRow} aria-label="Featured signature dishes">
        <button className={styles.arrowButton} type="button" aria-label="Previous dishes">
          ←
        </button>

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

        <button className={styles.arrowButton} type="button" aria-label="Next dishes">
          →
        </button>
      </div>
    </section>
  );
}


