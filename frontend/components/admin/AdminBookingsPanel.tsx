"use client";

import { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";

type AdminBooking = {
  bookingReference: string;
  customerName: string;
  phoneNumber: string;
  guestCount: number;
  bookingDate: string;
  slotStart: string;
  slotEnd: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  createdAt: string;
};

const apiOrigin = "";

export function AdminBookingsPanel() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadBookings() {
      if (!isActive) return;

      setIsLoading(true);
      setHasLoaded(false);
      setError("");

      try {
        const response = await fetch(`${apiOrigin}/api/admin/bookings`, { signal: controller.signal });

        if (!response.ok) throw new Error(`Bookings request failed with status ${response.status}`);

        const payload = (await response.json()) as { bookings: AdminBooking[] };
        if (!isActive) return;

        setBookings(payload.bookings ?? []);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        if (!isActive) return;

        setBookings([]);
        setError(loadError instanceof Error ? loadError.message : "Unable to load bookings.");
      } finally {
        if (!isActive) return;

        setIsLoading(false);
        setHasLoaded(true);
      }
    }

    loadBookings();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  return (
    <section className={styles.bookingsPanel} id="bookings" aria-labelledby="bookings-heading">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="bookings-heading">Bookings</h2>
          <p>Customer table bookings from the reservation flow.</p>
        </div>
      </div>

      {isLoading ? <p className={styles.emptyText}>Loading bookings...</p> : null}
      {error ? <p className={styles.errorText}>{error}</p> : null}

      {!isLoading && !error && bookings.length > 0 ? (
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Guests</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingReference}>
                  <td>{booking.bookingReference}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.phoneNumber}</td>
                  <td>{booking.guestCount}</td>
                  <td>{booking.bookingDate}</td>
                  <td>{booking.slotStart} - {booking.slotEnd}</td>
                  <td>{booking.status}</td>
                  <td>{formatCreatedAt(booking.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!isLoading && hasLoaded && !error && bookings.length === 0 ? (
        <p className={styles.emptyText}>Bookings will appear here once customers reserve a table.</p>
      ) : null}
    </section>
  );
}

function formatCreatedAt(createdAt: string) {
  if (!createdAt) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
}
