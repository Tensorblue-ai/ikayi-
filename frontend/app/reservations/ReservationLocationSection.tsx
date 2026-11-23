import Image from "next/image";
import { Car, MapPin, Phone } from "lucide-react";
import styles from "./ReservationLocationSection.module.css";

export function ReservationLocationSection() {
  return (
    <section className={styles.locationSection} aria-labelledby="location-heading">
      <div className={styles.headingBlock}>
        <h2 id="location-heading">Location</h2>
        <div className={styles.rule} aria-hidden="true">
          <span />
        </div>
        <p>find ikayi in the heart of lucknow for refined lunch and dinner experiences.</p>
      </div>

      <div className={styles.mapPanel}>
        <Image src="/assets/location.png" alt="map showing ikayi location in lucknow" fill sizes="(max-width: 980px) 100vw, 760px" />
      </div>

      <div className={styles.infoGrid}>
        <article className={styles.infoCard}>
          <MapPin aria-hidden="true" size={24} strokeWidth={1.7} />
          <div>
            <h2>Address</h2>
            <p>sector-c, alkapuri, aliganj main rd, ekta vihar, sp-1, chandralok, lucknow, uttar pradesh 226020</p>
          </div>
        </article>

        <article className={styles.infoCard}>
          <Phone aria-hidden="true" size={24} strokeWidth={1.7} />
          <div>
            <h2>Contact for Reservations</h2>
            <p>+91 7905690000</p>
          </div>
        </article>

        <article className={styles.infoCard}>
          <Car aria-hidden="true" size={24} strokeWidth={1.7} />
          <div>
            <h2>Directions</h2>
            <p>located in aliganj, lucknow. easily accessible from major roads and landmarks.</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Sector-C%2C%20Alkapuri%2C%20Aliganj%20Main%20Rd%2C%20Lucknow%20226020" target="_blank" rel="noreferrer">
              Get Directions
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
