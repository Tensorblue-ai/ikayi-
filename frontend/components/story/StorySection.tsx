import Image from "next/image";
import styles from "./StorySection.module.css";

const storyCards = [
  {
    image: "/assets/story1.png",
    title: "Rooted",
    copy: "Close to the land, food, and stories of Lucknow and India.",
    href: "#experience",
    icon: "\u2698",
  },
  {
    image: "/assets/story2.png",
    title: "Warm",
    copy: "Every guest welcomed as you would welcome someone home.",
    href: "#kitchen-experience",
    icon: "\u25CE",
  },
  {
    image: "/assets/story3.png",
    title: "Refined",
    copy: "Excellence over excess; every detail considered.",
    href: "#signature-experiences",
    icon: "\u2726",
  },
  {
    image: "/assets/story4.png",
    title: "Curious",
    copy: "Always asking how things can be more honest and thoughtful.",
    href: "#private-dining",
    icon: "\u2302",
  },
  {
    image: "/assets/exp3.png",
    title: "Indian",
    copy: "Proudly Indian, honouring tradition without caricature.",
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
          Hospitality is one of the most powerful ways to bring people together.
          <span>IKAYI belongs to Lucknow, and to those who come to discover it.</span>
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
            Slow down and indulge.
            <br />
            Life is meant to be lived, felt, and shared.
            <span aria-hidden="true">{`\u201D`}</span>
          </p>
          <a href="#gallery">
            See the Space <span aria-hidden="true">{`\u2726`}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
