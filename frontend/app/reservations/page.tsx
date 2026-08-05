import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const section = {
  image: "/assets/reservation%20(2).png",
  imageAlt: "Ikayi reservation experience collage",
  tabs: ["Overview", "Reservations", "More Information", "Location"],
  bookingTitle: "Book Now",
  timeSlots: ["12:30 PM", "2:30 PM", "7:30 PM", "9:30 PM"],
  defaultGuests: 2,
  primaryCtaLabel: "Check Availability",
  helperText: "Online reservations will open soon.",
  inquiryCtaLabel: "Send Inquiry",
  inquiryCtaHref: "/#reservations",
  policyLabel: "Cancellation Policy",
  policyHref: "#cancellation-policy",
};

const RESERVATION_TIME_ZONE = "Asia/Kolkata";

export default function ReservationsPage() {
  return (
    <main className={styles.page}>
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
            <BookingCard />
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
            <h1 id="reservation-heading">Coming Soon</h1>
            <div className={styles.divider} aria-hidden="true">
              <span />
            </div>
            <p>Reservation details, availability, more information, and location content are coming soon.</p>
          </article>
        </div>

        <aside className={styles.bookingPanel}>
          <BookingCard />
        </aside>
      </section>
    </main>
  );
}

function BookingCard() {
  const dateOptions = getUpcomingReservationDates();

  return (
    <form className={styles.bookingCard}>
      <h2>{section.bookingTitle}</h2>
      <div className={styles.smallDivider} aria-hidden="true">
        <span />
      </div>

      <label className={styles.fieldGroup}>
        <span>Select Date</span>
        <div className={styles.dateGrid}>
          {dateOptions.map((option) => (
            <button className={option.selected ? styles.selectedDate : ""} type="button" key={option.day}>
              <strong>{option.day}</strong>
              <small>{option.label}</small>
            </button>
          ))}
        </div>
      </label>

      <div className={styles.orRule}>Or</div>

      <label className={styles.fieldGroup}>
        <span>Custom Date</span>
        <input type="text" placeholder="DD-MM-YYYY" aria-label="Custom date" />
      </label>

      <label className={styles.fieldGroup}>
        <span>Select Time</span>
        <select defaultValue="" aria-label="Select a time slot">
          <option value="" disabled>
            Select a time slot
          </option>
          {section.timeSlots.map((timeSlot) => (
            <option key={timeSlot}>{timeSlot}</option>
          ))}
        </select>
      </label>

      <label className={styles.fieldGroup}>
        <span>Guests</span>
        <div className={styles.guestControl}>
          <button type="button" aria-label="Decrease guests">-</button>
          <strong>{section.defaultGuests} Guests</strong>
          <button type="button" aria-label="Increase guests">+</button>
        </div>
      </label>

      <button className={styles.checkButton} type="button">
        {section.primaryCtaLabel}
      </button>
      <p className={styles.helperText}>{section.helperText}</p>
      <Link className={styles.inquiryButton} href={section.inquiryCtaHref}>
        {section.inquiryCtaLabel}
      </Link>
      <a className={styles.policyLink} href={section.policyHref}>
        {section.policyLabel}
      </a>
    </form>
  );
}

function getUpcomingReservationDates(count = 7) {
  const dayFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: RESERVATION_TIME_ZONE,
  });
  const labelFormatter = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    timeZone: RESERVATION_TIME_ZONE,
  });
  const today = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index + 1);

    return {
      day: dayFormatter.format(date),
      label: labelFormatter.format(date),
      selected: index === 0,
    };
  });
}
