import Image from "next/image";
import { ReservationBookingCard } from "./ReservationBookingCard";
import Link from "next/link";
import styles from "./page.module.css";

const section = {
  image: "/assets/reservation%20(2).png",
  imageAlt: "Ikayi reservation experience collage",
  tabs: ["Overview", "Reservations", "More Information", "Location"],
};

export default function ReservationsPage() {
  return (
    <main className={styles.page}>
      <Link className={styles.homeLink} href="/">
        Return Home
      </Link>

      <section className={styles.shell} aria-labelledby="reservation-heading">
        <div className={styles.content}>
          <div className={styles.visualPanel}>
            <Image
              src={section.image}
              alt={section.imageAlt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </div>

          <div className={styles.mobileBooking}>
            <ReservationBookingCard />
          </div>

          <nav className={styles.tabs} aria-label="Reservation details">
            {section.tabs.map((tab, index) => (
              <a className={index === 0 ? styles.activeTab : ""} href={`#${tab.toLowerCase().replaceAll(" ", "-")}`} key={tab}>
                <span aria-hidden="true">{index === 0 ? "^" : index === 1 ? "[]" : index === 2 ? "i" : "+"}</span>
                {tab}
              </a>
            ))}
          </nav>

          <article className={styles.overview} id="overview">
            <h1 id="reservation-heading">Reserve Your Table</h1>
            <div className={styles.divider} aria-hidden="true">
              <span />
            </div>
            <p>Select your party size and date to see live hourly availability from the restaurant.</p>
          </article>
        </div>

        <aside className={styles.bookingPanel}>
          <ReservationBookingCard />
        </aside>
      </section>
    </main>
  );
}
