"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AdminOverviewPanel.module.css";

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

type TableSettings = {
  numberOfTables: number;
  chairsPerTable: number;
  openingTime: string;
  closingTime: string;
  slotLengthMinutes: number;
  timezone: string;
  availability?: number;
  updatedAt?: string;
};

type AvailabilitySlot = {
  label: string;
  remainingAvailability: number;
  isAvailable: boolean;
};

type AdminSectionSummary = {
  sectionKey: string;
  title: string;
  summary: string;
  isPublished: boolean;
  updatedAt?: string;
};

type OverviewState = {
  bookings: AdminBooking[];
  tableSettings: TableSettings | null;
  slots: AvailabilitySlot[];
  sections: AdminSectionSummary[];
};

type AdminOverviewPanelProps = {
  onEditSection: (sectionKey: string) => void;
  onViewBookings: () => void;
  onViewTables: () => void;
};

const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:5000";

export function AdminOverviewPanel({ onEditSection, onViewBookings, onViewTables }: AdminOverviewPanelProps) {
  const today = useMemo(() => getTodayIsoDate(), []);
  const [overview, setOverview] = useState<OverviewState>({
    bookings: [],
    tableSettings: null,
    slots: [],
    sections: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadOverview() {
      setIsLoading(true);
      setError("");

      try {
        const [bookingsResponse, settingsResponse, availabilityResponse, sectionsResponse] = await Promise.all([
          fetch(`${apiOrigin}/api/admin/bookings`, { signal: controller.signal }),
          fetch(`${apiOrigin}/api/admin/tables/settings`, { signal: controller.signal }),
          fetch(`${apiOrigin}/api/reservations/availability?date=${today}&guestCount=1`, { signal: controller.signal }),
          fetch(`${apiOrigin}/api/admin/sections`, { signal: controller.signal }),
        ]);

        if (!bookingsResponse.ok) throw new Error(`Bookings request failed with status ${bookingsResponse.status}`);
        if (!settingsResponse.ok) throw new Error(`Table settings request failed with status ${settingsResponse.status}`);
        if (!availabilityResponse.ok) throw new Error(`Availability request failed with status ${availabilityResponse.status}`);
        if (!sectionsResponse.ok) throw new Error(`Sections request failed with status ${sectionsResponse.status}`);

        const bookingsPayload = (await bookingsResponse.json()) as { bookings?: AdminBooking[] };
        const settingsPayload = (await settingsResponse.json()) as { settings?: TableSettings };
        const availabilityPayload = (await availabilityResponse.json()) as { slots?: AvailabilitySlot[] };
        const sectionsPayload = (await sectionsResponse.json()) as { sections?: AdminSectionSummary[] };

        if (!isActive) return;

        setOverview({
          bookings: bookingsPayload.bookings ?? [],
          tableSettings: settingsPayload.settings ?? null,
          slots: availabilityPayload.slots ?? [],
          sections: sectionsPayload.sections ?? [],
        });
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        if (!isActive) return;

        setError(loadError instanceof Error ? loadError.message : "Unable to load overview.");
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    }

    loadOverview();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [today]);

  const activeBookings = overview.bookings.filter((booking) => booking.status !== "cancelled" && booking.status !== "no_show");
  const todayBookings = activeBookings.filter((booking) => booking.bookingDate === today);
  const totalGuestsToday = todayBookings.reduce((total, booking) => total + booking.guestCount, 0);
  const availableSlots = overview.slots.filter((slot) => slot.isAvailable);
  const hourlyCapacity =
    overview.tableSettings?.availability ??
    ((overview.tableSettings?.numberOfTables ?? 0) * (overview.tableSettings?.chairsPerTable ?? 0));
  const latestBookings = [...overview.bookings]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 5);
  const publishedSections = overview.sections.filter((section) => section.isPublished);
  const draftSections = overview.sections.filter((section) => !section.isPublished);

  return (
    <section className={styles.overviewPanel} aria-labelledby="overview-heading">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="overview-heading">Overview</h2>
          <p>Live booking, table, and content status from the current backend.</p>
        </div>
      </div>

      {isLoading ? <p className={styles.helperText}>Loading overview...</p> : null}
      {error ? <p className={styles.errorText}>{error}</p> : null}

      <div className={styles.metricGrid}>
        <MetricCard label="Today's bookings" value={todayBookings.length} detail={today} />
        <MetricCard label="Guests today" value={totalGuestsToday} detail="Active reservations" />
        <MetricCard label="Available slots" value={availableSlots.length} detail={`${overview.slots.length} total slots today`} />
        <MetricCard label="Hourly capacity" value={hourlyCapacity} detail="Seats per slot" />
      </div>

      <div className={styles.contentGrid}>
        <article className={styles.latestCard}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Latest bookings</h3>
              <p>Most recent customer reservations.</p>
            </div>
            <button type="button" onClick={onViewBookings}>View all</button>
          </div>

          {latestBookings.length > 0 ? (
            <div className={styles.bookingList}>
              {latestBookings.map((booking) => (
                <div className={styles.bookingRow} key={booking.bookingReference}>
                  <div>
                    <strong>{booking.customerName}</strong>
                    <span>{booking.bookingDate} at {formatTimeRange(booking.slotStart, booking.slotEnd)}</span>
                  </div>
                  <div>
                    <strong>{booking.guestCount}</strong>
                    <span>{formatStatus(booking.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.helperText}>Bookings will appear once customers reserve a table.</p>
          )}
        </article>

        <aside className={styles.setupCard}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Table setup</h3>
              <p>Current reservation capacity rules.</p>
            </div>
            <button type="button" onClick={onViewTables}>Edit</button>
          </div>

          <dl className={styles.setupList}>
            <div>
              <dt>Tables</dt>
              <dd>{overview.tableSettings?.numberOfTables ?? "-"}</dd>
            </div>
            <div>
              <dt>Chairs per table</dt>
              <dd>{overview.tableSettings?.chairsPerTable ?? "-"}</dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>{overview.tableSettings ? `${overview.tableSettings.openingTime} - ${overview.tableSettings.closingTime}` : "-"}</dd>
            </div>
            <div>
              <dt>Slot length</dt>
              <dd>{overview.tableSettings ? `${overview.tableSettings.slotLengthMinutes} min` : "-"}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <article className={styles.contentStatusCard}>
        <div className={styles.cardHeader}>
          <div>
            <h3>Content status</h3>
            <p>{publishedSections.length} published, {draftSections.length} draft.</p>
          </div>
        </div>

        <div className={styles.sectionGrid}>
          {overview.sections.map((section) => (
            <button type="button" onClick={() => onEditSection(section.sectionKey)} key={section.sectionKey}>
              <span>{section.isPublished ? "Published" : "Draft"}</span>
              <strong>{section.title}</strong>
              <small>{section.summary || section.sectionKey}</small>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className={styles.metricCard}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function getTodayIsoDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function formatStatus(status: AdminBooking["status"]) {
  return status.replace("_", " ");
}

function formatTimeRange(slotStart: string, slotEnd: string) {
  return `${formatDisplayTime(slotStart)} - ${formatDisplayTime(slotEnd)}`;
}

function formatDisplayTime(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}
