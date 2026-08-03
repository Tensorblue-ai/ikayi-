import Image from "next/image";
import styles from "./StorySection.module.css";

const storyCards = [
  {
    image: "/assets/story1.png",
    title: "Farmers",
    copy: "Honoring the hands that nourish our tables.",
    href: "#experience",
    icon: "\u2698",
  },
  {
    image: "/assets/story2.png",
    title: "Ingredients",
    copy: "The best of India, thoughtfully sourced.",
    href: "#kitchen-experience",
    icon: "\u25CE",
  },
  {
    image: "/assets/story3.png",
    title: "Craftsmanship",
    copy: "Time-honored techniques, made with pride.",
    href: "#signature-experiences",
    icon: "\u2726",
  },
  {
    image: "/assets/story4.png",
    title: "Lucknow Stories",
    copy: "A city of elegance, culture, and cuisine.",
    href: "#private-dining",
    icon: "\u2302",
  },
  {
    image: "/assets/exp3.png",
    title: "Ikayi Moments",
    copy: "Gatherings shaped by warmth and memory.",
    href: "#gallery",
    icon: "\u2605",
  },
];

export function StorySection() {
  return (
    <section className={styles.story} id="stories" aria-labelledby="stories-heading">
      <div className={styles.logoBadge} aria-hidden="true">
        <span>IKAYI</span>
        <small>Modern Indian</small>
      </div>

      <div className={styles.inner}>
        <div className={styles.headingBlock}>
          <div className={styles.titleRule} aria-hidden="true">
            <span />
          </div>
          <h2 id="stories-heading">Stories</h2>
          <div className={styles.titleRule} aria-hidden="true">
            <span />
          </div>
        </div>

        <p className={styles.intro}>
          Every ingredient has a story. Every tradition has a soul.
          <span>Discover the people, places, and passions that inspire IKAYI.</span>
        </p>

        <div className={styles.cards}>
          {storyCards.map((card) => (
            <article className={styles.card} key={card.title}>
              <div className={styles.imageWrap}>
                <Image src={card.image} alt={`${card.title} at IKAYI`} fill sizes="(max-width: 760px) 82vw, 220px" />
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
          <Image className={styles.bannerArt} src="/assets/footer.png" alt="" width={170} height={132} aria-hidden="true" />
          <p>
            <span aria-hidden="true">{`\u201C`}</span>
            Our stories are rooted in tradition,
            <br />
            yet inspired by the world around us.
            <span aria-hidden="true">{`\u201D`}</span>
          </p>
          <a href="#gallery">
            Discover More <span aria-hidden="true">{`\u2726`}</span>
          </a>
        </div>
      </div>
    </section>
  );
}