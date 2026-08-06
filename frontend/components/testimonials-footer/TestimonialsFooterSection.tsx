import Image from "next/image";
import { BrandLogo } from "@/components/brand/BrandLogo";
import styles from "./TestimonialsFooterSection.module.css";

const testimonials = [
  {
    quote: "They knew our names before we reached the table.",
    name: "Recognition",
    city: "Guest takeaway",
  },
  {
    quote: "The evening felt calm, unhurried, and beautifully looked after.",
    name: "Ease",
    city: "Guest takeaway",
  },
  {
    quote: "We left feeling closer to each other, and to the place.",
    name: "Oneness",
    city: "Guest takeaway",
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
      { label: "Guest Journey", href: "#private-dining" },
      { label: "Reservations", href: "#reservations" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Gallery", href: "#gallery" },
      { label: "Guest Feelings", href: "#testimonials" },
      { label: "Instagram", href: "https://www.instagram.com/ikayi_lucknow/" },
    ],
  },
];

export function TestimonialsFooterSection() {
  return (
    <section className={styles.closingSection} id="testimonials" aria-labelledby="testimonials-heading">
      <div className={styles.testimonials}>
<div className={styles.headingBlock}>
          <div className={styles.titleRule} aria-hidden="true">
            <span />
          </div>
          <h2 id="testimonials-heading">
            <span>What Guests</span>
            <span>Carry Home</span>
          </h2>
          <div className={styles.titleRule} aria-hidden="true">
            <span />
          </div>
        </div>

        <p className={styles.intro}>
          Not only the food, but the feeling after the meal.
          <span>Welcomed, celebrated, calm, inspired, and connected.</span>
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
              <BrandLogo variant="wordmark" className={styles.footerLogoImage} decorative />
            </div>
            <p>Rooted in unity, built for meaningful dining experiences in Lucknow.</p>
            <div className={styles.socials} aria-label="Social links">
              <a href="https://www.instagram.com/ikayi_lucknow/" aria-label="Instagram">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="5" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="17" cy="7" r="1" />
                </svg>
              </a>
              <a href="#facebook" aria-label="Facebook">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" />
                </svg>
              </a>
              <a href="#tripadvisor" aria-label="Travel reviews">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M3.5 9.5h3.2A7.5 7.5 0 0 1 12 7.4a7.5 7.5 0 0 1 5.3 2.1h3.2" />
                  <circle cx="8.2" cy="13.2" r="3.2" />
                  <circle cx="15.8" cy="13.2" r="3.2" />
                  <circle cx="8.2" cy="13.2" r="1" />
                  <circle cx="15.8" cy="13.2" r="1" />
                  <path d="M11.1 15.3 12 17l.9-1.7" />
                </svg>
              </a>
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
