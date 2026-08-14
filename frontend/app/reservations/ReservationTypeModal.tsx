"use client";

import { CalendarDays, Camera, Clock, MapPin, Phone, Utensils, X } from "lucide-react";
import type { ReservationType } from "@/lib/reservation-types";
import styles from "./ReservationTypeModal.module.css";

type ReservationTypeModalProps = {
  reservationType: ReservationType | null;
  onClose: () => void;
};

const serviceRows = [
  ["Reservations", "10am - 10pm"],
  ["Operations", "12pm - 11pm"],
  ["Closed", "Tuesdays"],
];

const venueRows = [
  ["Address", "SECTOR-C, ALKAPURI, Aliganj Main Rd, Etka Vihar, SP-1, Chandralok, Lucknow, Uttar Pradesh 226020"],
  ["Reservations Contact", "+91 7905690000"],
  ["Instagram", "@ikayi_lucknow"],
];

export function ReservationTypeModal({ reservationType, onClose }: ReservationTypeModalProps) {
  if (!reservationType) {
    return null;
  }

  const description = getDescription(reservationType);
  const preBooking = getPreBookingCopy(reservationType);
  const serviceHours = getServiceHours(reservationType);
  const priceLine = getPriceLine(reservationType);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="reservation-type-modal-title">
      <article className={styles.modal}>
        <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close reservation details">
          <X aria-hidden="true" size={18} strokeWidth={1.8} />
        </button>

        <header className={styles.header}>
          <h2 id="reservation-type-modal-title">{reservationType.title}</h2>
          <p>{priceLine}</p>
        </header>

        <div className={styles.metaGrid} aria-label="Reservation quick details">
          <span>
            <MapPin aria-hidden="true" size={17} strokeWidth={1.7} />
            IKAYI, Lucknow
          </span>
          <span>
            <Clock aria-hidden="true" size={17} strokeWidth={1.7} />
            90-120 minutes
          </span>
          <span>
            <Utensils aria-hidden="true" size={17} strokeWidth={1.7} />
            {getExperienceLabel(reservationType)}
          </span>
        </div>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <span aria-hidden="true">i</span>
            <h3>Description</h3>
          </div>
          {description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <CalendarDays aria-hidden="true" size={18} strokeWidth={1.7} />
            <h3>Pre-booking</h3>
          </div>
          <p>{preBooking}</p>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <Clock aria-hidden="true" size={18} strokeWidth={1.7} />
            <h3>Service Information</h3>
          </div>
          <dl className={styles.infoTable}>
            {[...serviceRows, ["Service Hours", serviceHours], ["Note", "We do not provide breakfast"]].map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <Phone aria-hidden="true" size={18} strokeWidth={1.7} />
            <h3>Contact & Venue</h3>
          </div>
          <dl className={styles.infoTable}>
            {venueRows.map(([term, detail]) => (
              <div key={term}>
                <dt>
                  {term === "Instagram" ? <Camera aria-hidden="true" size={15} strokeWidth={1.7} /> : null}
                  {term}
                </dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className={styles.note}>
          <span aria-hidden="true">i</span>
          <p>Lunch and dinner reservations only. Closed on Tuesdays.</p>
        </aside>
      </article>
    </div>
  );
}

function getDescription(reservationType: ReservationType) {
  const paragraphs = [reservationType.description, ...reservationType.details].filter(Boolean);

  if (paragraphs.length > 1) {
    return paragraphs;
  }

  return [
    reservationType.description,
    "Designed for intimate lunches and elegant dinners, this experience is served as a considered progression from first bite to last.",
  ].filter(Boolean);
}

function getPreBookingCopy(reservationType: ReservationType) {
  if (reservationType.badgeLabel.toLowerCase().includes("a la carte")) {
    return "Our team confirms availability and any minimum spend before the visit. The final bill is settled at the restaurant.";
  }

  return "A booking deposit of Rs 1,000 per guest is required to confirm the reservation. The remaining balance is settled at the restaurant.";
}

function getServiceHours(reservationType: ReservationType) {
  if (reservationType.mealPeriods.length === 0) {
    return "lunch and dinner only";
  }

  return `${reservationType.mealPeriods.join(" and ")} only`;
}

function getPriceLine(reservationType: ReservationType) {
  if (!reservationType.eyebrow) {
    return "curated ikayi reservation experience";
  }

  return reservationType.eyebrow.replace(/^chef'?s menu\s+/i, "");
}

function getExperienceLabel(reservationType: ReservationType) {
  return reservationType.title.toLowerCase().includes("chef") ? "chef's tasting experience" : "curated ikayi experience";
}
