import Image from "next/image";
import styles from "./TestimonialsFooterSection.module.css";

const testimonials = [
  {
    quote:
      "IKAYI is a beautiful blend of tradition and modernity. The food, the ambiance, the warmth-everything feels so thoughtfully curated.",
    name: "Ananya S.",
    city: "Mumbai",
  },
  {
    quote:
      "From the Galouti Kebabs to the Sunset Sessions, every detail is perfect. A must-visit in Lucknow!",
    name: "Rohan M.",
    city: "Delhi",
  },
  {
    quote:
      "The hospitality at IKAYI is unparalleled. It's more than a meal-it's an experience that stays with you.",
    name: "Neha & Arjun",
    city: "Bangalore",
  },
];

const footerLinkGroups = [
  {
    title: "Explore",
    links: [
      { label: "Experience", href: "#experience" },
      { label: "Open Kitchen", href: "#kitchen-experience" },
      { label: "Stories", href: "#stories" },
    ],
  },
  {
    title: "Dining",
    links: [
      { label: "Signature Experiences", href: "#signature-experiences" },
      { label: "Private Dining", href: "#private-dining" },
      { label: "Reservations", href: "#reservations" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Gallery", href: "#gallery" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Instagram", href: "https://www.instagram.com/ikayi_lucknow/" },
    ],
  },
];

export function TestimonialsFooterSection() {
  return (
    <section className={styles.closingSection} id="testimonials" aria-labelledby="testimonials-heading">
      <div className={styles.testimonials}>
        <div className={styles.logoBadge} aria-hidden="true">
          <span>IKAYI</span>
          <small>Modern Indian</small>
        </div>

        <div className={styles.headingBlock}>
          <div className={styles.titleRule} aria-hidden="true">
            <span />
          </div>
          <h2 id="testimonials-heading">Testimonials</h2>
          <div className={styles.titleRule} aria-hidden="true">
            <span />
          </div>
        </div>

        <p className={styles.intro}>
          Moments shared. Experiences cherished.
          <span>Here&apos;s what our guests have to say.</span>
        </p>

        <div className={styles.cards}>
          {testimonials.map((testimonial) => (
            <article className={styles.card} key={testimonial.name}>
              <div className={styles.quoteMark} aria-hidden="true">{"\u201C"}</div>
              <p>{testimonial.quote}</p>
              <div className={styles.cardDivider} aria-hidden="true" />
              <div className={styles.rating} aria-label="Five star rating">{"\u2605\u2605\u2605\u2605\u2605"}</div>
              <h3>{testimonial.name}</h3>
              <span>{testimonial.city}</span>
            </article>
          ))}
        </div>
      </div>

      <footer className={styles.footer} id="reservations">
        <div className={styles.footerInner}>
          <div className={styles.brandBlock}>
            <div className={styles.footerLogo} aria-hidden="true">
              <span>IKAYI</span>
              <small>Modern Indian</small>
            </div>
            <p>Come together over unforgettable food, warm conversations, and moments that matter.</p>
            <div className={styles.socials} aria-label="Social links">
              <a href="https://www.instagram.com/ikayi_lucknow/" aria-label="Instagram">{"\u25CE"}</a>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#tripadvisor" aria-label="Travel reviews">{"\u2615"}</a>
            </div>
          </div>

          {footerLinkGroups.map((group) => (
            <nav className={styles.linkColumn} aria-label={`${group.title} links`} key={group.title}>
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <a href={link.href} key={link.label}>{link.label}</a>
              ))}
            </nav>
          ))}

          <address className={styles.contactBlock}>
            <h3>Contact</h3>
            <a href="https://maps.google.com/?q=SECTOR-C%2C%20ALKAPURI%2C%20Aliganj%20Main%20Rd%2C%20Ekta%20Vihar%2C%20SP-1%2C%20Chandralok%2C%20Lucknow%2C%20Uttar%20Pradesh%20226020">
              SECTOR-C, ALKAPURI, Aliganj Main Rd, Ekta Vihar, SP-1, Chandralok, Lucknow, Uttar Pradesh 226020
            </a>
            <a href="mailto:hello@ikayirestaurant.com">hello@ikayirestaurant.com</a>
            <a href="tel:+911234567890">+91 123 456 7890</a>
          </address>

          <div className={styles.footerArt} aria-hidden="true">
            <Image src="/assets/footer.png" alt="" fill sizes="240px" />
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>{"\u00A9"} 2024 IKAYI Modern Indian. All rights reserved.</span>
          <div>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </section>
  );
}