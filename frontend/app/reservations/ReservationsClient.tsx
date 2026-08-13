"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CalendarDays, Home, Info, MapPin } from "lucide-react";
import type { ReservationSectionData } from "@/lib/homepage-sections";
import type { ReservationType } from "@/lib/reservation-types";
import { ReservationBookingCard } from "./ReservationBookingCard";
import { ReservationTypeCards } from "./ReservationTypeCards";
import styles from "./page.module.css";

type ReservationsClientProps = {
  section: ReservationSectionData | null;
  reservationTypes: ReservationType[];
};

const fallbackTabs = ["Overview", "Reservations", "More Information", "Location"];
const tabIcons = [Home, CalendarDays, Info, MapPin];
const fallbackCollageSrc = "/assets/reservation%20(2).png";

export function ReservationsClient({ section, reservationTypes }: ReservationsClientProps) {
  const defaultSlug = reservationTypes[0]?.slug ?? "";
  const [selectedSlug, setSelectedSlug] = useState(defaultSlug);
  const selectedType = useMemo(
    () => reservationTypes.find((type) => type.slug === selectedSlug) ?? reservationTypes[0],
    [reservationTypes, selectedSlug]
  );
  const tabs = section?.tabs?.length ? section.tabs : fallbackTabs;
  const collageSrc = getReservationCollageSrc(section?.image);
  const collageAlt = section?.imageAlt?.trim() || "Ikayi reservation experience collage";

  return (
    <main className={styles.page}>
      <section className={styles.shell} aria-labelledby="reservation-heading">
        <div className={styles.content}>
          <div className={styles.visualPanel}>
            <Image src={collageSrc} alt={collageAlt} fill sizes="(max-width: 980px) 100vw, 760px" priority />
          </div>

          <nav className={styles.tabs} aria-label="Reservation details">
            {tabs.map((tab, index) => {
              const Icon = tabIcons[index] ?? Info;

              return (
                <a className={index === 1 ? styles.activeTab : ""} href={`#${tab.toLowerCase().replaceAll(" ", "-")}`} key={tab}>
                  <Icon aria-hidden="true" size={15} strokeWidth={1.6} />
                  {tab}
                </a>
              );
            })}
          </nav>

          <ReservationTypeCards reservationTypes={reservationTypes} selectedSlug={selectedType?.slug ?? ""} onSelect={setSelectedSlug} />

          <aside className={styles.breakfastNote}>
            <span aria-hidden="true">i</span>
            <div>
              <strong>We do not serve breakfast.</strong>
              <p>Reservations are available for lunch and dinner only.</p>
            </div>
          </aside>
        </div>

        <aside className={styles.bookingPanel}>
          <ReservationBookingCard
            reservationTypes={reservationTypes}
            selectedReservationTypeSlug={selectedType?.slug ?? ""}
            onReservationTypeChange={setSelectedSlug}
            inquiryHref={section?.inquiryCtaHref ?? "/#reservations"}
            inquiryLabel={section?.inquiryCtaLabel ?? "Send Inquiry"}
            policyHref={section?.policyHref ?? "#cancellation-policy"}
            policyLabel={section?.policyLabel ?? "Cancellation Policy"}
          />
        </aside>
      </section>
    </main>
  );
}
function getReservationCollageSrc(src?: string) {
  const imageSrc = src?.trim();

  if (!imageSrc || imageSrc.includes("/assets/reservation.png") || imageSrc.includes("/api/assets/assets/reservation%20(2).png")) {
    return fallbackCollageSrc;
  }

  return imageSrc.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/assets/i, "/api/assets");
}
