import { getReservationSection } from "@/lib/homepage-sections";
import { getReservationTypes } from "@/lib/reservation-types";
import { ReservationsClient } from "./ReservationsClient";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Table Reservations | IKAYI, Lucknow",
  "Reserve your table at IKAYI in Lucknow. Explore modern Indian lunch and dinner experiences, check availability and plan your visit.",
  "/reservations"
);

export default async function ReservationsPage() {
  const [section, reservationTypes] = await Promise.all([getReservationSection(), getReservationTypes()]);

  return <ReservationsClient section={section} reservationTypes={reservationTypes} />;
}
