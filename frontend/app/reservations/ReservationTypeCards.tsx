"use client";

import { useState } from "react";
import { BriefcaseBusiness, Handshake, Leaf, Soup, Sprout, SunMedium, Coffee, Sparkles } from "lucide-react";
import type { ReservationType } from "@/lib/reservation-types";
import styles from "./ReservationTypeCards.module.css";

type ReservationTypeCardsProps = {
  reservationTypes: ReservationType[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  onOpenDetails?: (reservationType: ReservationType) => void;
};

const iconMap = {
  cloche: Soup,
  teapot: Coffee,
  briefcase: BriefcaseBusiness,
  lotus: Leaf,
  sun: SunMedium,
  handshake: Handshake,
  tractor: Sprout,
};

export function ReservationTypeCards({ reservationTypes, selectedSlug, onSelect, onOpenDetails }: ReservationTypeCardsProps) {
  const [isMoreVisible, setIsMoreVisible] = useState(false);
  const primaryTypes = reservationTypes.filter((type) => type.pageGroup === "primary");
  const moreTypes = reservationTypes.filter((type) => type.pageGroup === "more");

  return (
    <div className={styles.groups}>
      <section className={styles.group} aria-labelledby="reservation-heading">
        <div className={styles.headingBlock}>
          <h2 id="reservation-heading">Reservations</h2>
          <div className={styles.rule} aria-hidden="true">
            <span />
          </div>
          <p>Reserve your preferred experience and let us curate unforgettable moments for you.</p>
        </div>
        <ReservationTypeGrid reservationTypes={primaryTypes} selectedSlug={selectedSlug} onSelect={onSelect} onOpenDetails={onOpenDetails} />
      </section>

      {moreTypes.length > 0 && !isMoreVisible ? (
        <div className={styles.morePrompt}>
          <button className={styles.moreButton} type="button" onClick={() => setIsMoreVisible(true)}>
            <Sparkles aria-hidden="true" size={16} strokeWidth={1.7} />
            View More Experiences
          </button>
          <p>Discover more curated experiences on the next page.</p>
        </div>
      ) : null}

      {moreTypes.length > 0 ? (
        <section className={styles.group} aria-labelledby="more-reservations-heading" hidden={!isMoreVisible} style={!isMoreVisible ? { display: "none" } : undefined}>
          <div className={styles.headingBlock}>
            <h2 id="more-reservations-heading">More Reservation Types</h2>
            <div className={styles.rule} aria-hidden="true">
              <span />
            </div>
            <p>Choose from our signature experiences, seasonal gatherings, and curated occasions.</p>
          </div>
          <ReservationTypeGrid reservationTypes={moreTypes} selectedSlug={selectedSlug} onSelect={onSelect} onOpenDetails={onOpenDetails} />
        </section>
      ) : null}
    </div>
  );
}

function ReservationTypeGrid({ reservationTypes, selectedSlug, onSelect, onOpenDetails }: ReservationTypeCardsProps) {
  return (
    <div className={styles.grid}>
      {reservationTypes.map((type) => {
        const Icon = iconMap[type.icon];
        const isSelected = selectedSlug === type.slug;

        return (
          <button
            className={[styles.card, type.cardSize === "wide" ? styles.wideCard : "", isSelected ? styles.selectedCard : ""]
              .join(" ")
              .trim()}
            type="button"
            onClick={() => {
              onSelect(type.slug);
              onOpenDetails?.(type);
            }}
            aria-pressed={isSelected}
            key={type.slug}
          >
            <span className={styles.iconWrap} aria-hidden="true">
              <Icon size={34} strokeWidth={1.5} />
            </span>
            {type.badgeLabel ? <span className={styles.badge}>{type.badgeLabel}</span> : null}
            <strong>{type.title}</strong>
            {type.eyebrow ? <em>{type.eyebrow}</em> : null}
            <p>{type.description}</p>
            {type.details.length > 0 ? <small>{type.details.join(" ")}</small> : null}
            <span className={styles.guestPill}>{type.defaultGuests} Guests</span>
          </button>
        );
      })}
    </div>
  );
}
