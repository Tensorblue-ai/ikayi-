export type ReservationType = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  details: string[];
  badgeLabel: string;
  icon: "cloche" | "teapot" | "briefcase" | "lotus" | "sun" | "handshake" | "tractor";
  pageGroup: "primary" | "more";
  cardSize: "standard" | "wide";
  mealPeriods: Array<"lunch" | "dinner">;
  defaultGuests: number;
  minGuests: number;
  maxGuests: number;
  sortOrder: number;
  isActive: boolean;
};

type ReservationTypesResponse = {
  reservationTypes?: ReservationType[];
};

export async function getReservationTypes(): Promise<ReservationType[]> {
  const apiOrigin = process.env.IKAYI_API_ORIGIN || process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:5000";
  const response = await fetch(`${apiOrigin}/api/reservations/types`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Reservation types request failed with ${response.status}`);
  }

  const payload = (await response.json()) as ReservationTypesResponse;

  return (payload.reservationTypes ?? []).sort((first, second) => first.sortOrder - second.sortOrder);
}