import { getReservationSection } from "@/lib/homepage-sections";
import { getReservationTypes } from "@/lib/reservation-types";
import { ReservationsClient } from "./ReservationsClient";

export default async function ReservationsPage() {
  const [section, reservationTypes] = await Promise.all([getReservationSection(), getReservationTypes()]);

  return <ReservationsClient section={section} reservationTypes={reservationTypes} />;
}