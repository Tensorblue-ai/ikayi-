"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReservationType } from "@/lib/reservation-types";
import styles from "./page.module.css";

type DateOption = {
  isoDate: string;
  day: string;
  label: string;
};

type AvailabilitySlot = {
  slotStart: string;
  slotEnd: string;
  label: string;
  remainingAvailability: number;
  isAvailable: boolean;
};

type ReservationBookingCardProps = {
  reservationTypes?: ReservationType[];
  selectedReservationTypeSlug?: string;
  onReservationTypeChange?: (slug: string) => void;
  inquiryHref?: string;
  inquiryLabel?: string;
  policyHref?: string;
  policyLabel?: string;
};

type BookingSummary = {
  bookingReference: string;
  bookingDate: string;
  slotStart: string;
  slotEnd: string;
  guestCount?: number;
  reservationTypeTitle?: string;
};

const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:5000";
const reservationTimeZone = "Asia/Kolkata";
const phonePattern = /^\d{10}$/;

export function ReservationBookingCard({
  reservationTypes = [],
  selectedReservationTypeSlug = "",
  onReservationTypeChange,
  inquiryHref = "/#reservations",
  inquiryLabel = "Send Inquiry",
  policyHref = "#cancellation-policy",
  policyLabel = "Cancellation Policy",
}: ReservationBookingCardProps) {
  const dateOptions = useMemo(() => getUpcomingReservationDates(), []);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.isoDate ?? "");
  const [reservationTypeSlug, setReservationTypeSlug] = useState(selectedReservationTypeSlug || reservationTypes[0]?.slug || "");
  const [mealPeriod, setMealPeriod] = useState<"lunch" | "dinner">("lunch");
  const [guestCount, setGuestCount] = useState(2);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const selectedReservationType = reservationTypes.find((type) => type.slug === reservationTypeSlug);
  const selectedReservationLabel = selectedReservationType?.title ?? "Select reservation type";
  const hasAvailableSlots = slots.some((slot) => slot.isAvailable);
  const isPhoneValid = phonePattern.test(phoneNumber);
  const phoneWarning = phoneTouched && phoneNumber.length > 0 && !isPhoneValid;
  const minGuests = selectedReservationType?.minGuests ?? 1;
  const maxGuests = selectedReservationType?.maxGuests ?? 12;

  useEffect(() => {
    if (selectedReservationTypeSlug) {
      setReservationTypeSlug(selectedReservationTypeSlug);
    }
  }, [selectedReservationTypeSlug]);

  useEffect(() => {
    if (!selectedReservationType) return;

    setGuestCount((current) => Math.min(Math.max(current, selectedReservationType.minGuests), selectedReservationType.maxGuests));
    if (selectedReservationType.mealPeriods.length > 0 && !selectedReservationType.mealPeriods.includes(mealPeriod)) {
      setMealPeriod(selectedReservationType.mealPeriods[0]);
    }
  }, [mealPeriod, selectedReservationType]);

  function updateReservationType(nextSlug: string) {
    setReservationTypeSlug(nextSlug);
    onReservationTypeChange?.(nextSlug);
  }

  async function checkAvailability() {
    setIsChecking(true);
    setError("");
    setSelectedSlot(null);
    setBookingSummary(null);

    try {
      const response = await fetch(`${apiOrigin}/api/reservations/availability?date=${selectedDate}&guestCount=${guestCount}`);
      const payload = (await response.json()) as { slots?: AvailabilitySlot[]; message?: string };

      if (!response.ok || !payload.slots) throw new Error(payload.message ?? `Availability failed with status ${response.status}`);

      setSlots(payload.slots);
      setIsAvailabilityOpen(true);
    } catch (availabilityError) {
      setError(availabilityError instanceof Error ? availabilityError.message : "Unable to check availability.");
    } finally {
      setIsChecking(false);
    }
  }

  async function submitBooking() {
    if (!selectedSlot) return;

    setPhoneTouched(true);
    setError("");

    if (!isPhoneValid) {
      setError("Enter a valid 10 digit mobile number before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiOrigin}/api/reservations/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phoneNumber,
          guestCount,
          bookingDate: selectedDate,
          slotStart: selectedSlot.slotStart,
          reservationTypeSlug,
          mealPeriod,
        }),
      });
      const payload = (await response.json()) as { booking?: BookingSummary; error?: string; message?: string };

      if (!response.ok || !payload.booking) {
        throw new Error(payload.error ?? payload.message ?? `Booking failed with status ${response.status}`);
      }

      setBookingSummary(payload.booking);
      setSelectedSlot(null);
      setIsAvailabilityOpen(false);
      setCustomerName("");
      setPhoneNumber("");
      setPhoneTouched(false);
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : "Unable to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className={styles.bookingCard} onSubmit={(event) => event.preventDefault()}>
        <h2>Book Now</h2>
        <div className={styles.smallDivider} aria-hidden="true">
          <span />
        </div>

        <div className={styles.fieldGroup}>
          <span id="reservation-type-label">Reservation Type</span>
          <div
            className={styles.customSelect}
            onBlur={(event) => {
              const nextFocus = event.relatedTarget;
              if (!(nextFocus instanceof Node) || !event.currentTarget.contains(nextFocus)) {
                setIsTypeMenuOpen(false);
              }
            }}
          >
            <button
              className={styles.selectButton}
              type="button"
              aria-labelledby="reservation-type-label"
              aria-haspopup="listbox"
              aria-expanded={isTypeMenuOpen}
              onClick={() => setIsTypeMenuOpen((isOpen) => !isOpen)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsTypeMenuOpen(false);
                }
              }}
            >
              <span>{selectedReservationLabel}</span>
              <b className={styles.selectChevron} aria-hidden="true" />
            </button>

            {isTypeMenuOpen ? (
              <div className={styles.selectMenu} role="listbox" aria-labelledby="reservation-type-label">
                {reservationTypes.map((type) => {
                  const isSelected = reservationTypeSlug === type.slug;

                  return (
                    <button
                      className={isSelected ? styles.selectOptionActive : styles.selectOption}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        updateReservationType(type.slug);
                        setIsTypeMenuOpen(false);
                      }}
                      key={type.slug}
                    >
                      {type.title}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <label className={styles.fieldGroup}>
          <span>Select Date</span>
          <div className={styles.dateGrid}>
            {dateOptions.map((option) => (
              <button
                className={selectedDate === option.isoDate ? styles.selectedDate : ""}
                type="button"
                onClick={() => setSelectedDate(option.isoDate)}
                key={option.isoDate}
              >
                <strong>{option.day}</strong>
                <small>{option.label}</small>
              </button>
            ))}
          </div>
        </label>

        <label className={styles.fieldGroup}>
          <span>Custom Date</span>
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.currentTarget.value)} />
        </label>

        <label className={styles.fieldGroup}>
          <span>Meal</span>
          <div className={styles.mealToggle}>
            {(["lunch", "dinner"] as const).map((period) => (
              <button
                className={mealPeriod === period ? styles.selectedMeal : ""}
                type="button"
                onClick={() => setMealPeriod(period)}
                disabled={Boolean(selectedReservationType?.mealPeriods.length) && !selectedReservationType?.mealPeriods.includes(period)}
                key={period}
              >
                {period === "lunch" ? "Lunch" : "Dinner"}
              </button>
            ))}
          </div>
        </label>

        <label className={styles.fieldGroup}>
          <span>Guests</span>
          <div className={styles.guestControl}>
            <button type="button" aria-label="Decrease guests" onClick={() => setGuestCount((current) => Math.max(current - 1, minGuests))}>-</button>
            <strong>{guestCount} Guests</strong>
            <button type="button" aria-label="Increase guests" onClick={() => setGuestCount((current) => Math.min(current + 1, maxGuests))}>+</button>
          </div>
        </label>

        <button className={styles.checkButton} type="button" onClick={checkAvailability} disabled={isChecking || !selectedDate || !reservationTypeSlug}>
          {isChecking ? "Checking..." : "Check Availability"}
        </button>

        {error ? <p className={styles.errorText}>{error}</p> : null}

        <p className={styles.helperText}>
          {selectedReservationType
            ? `${selectedReservationType.title} reservations can be reviewed and confirmed on the next step.`
            : "Choose a reservation type, date, and guest count to see live slots."}
        </p>
        <a className={styles.inquiryButton} href={inquiryHref}>{inquiryLabel}</a>
        <a className={styles.policyLink} href={policyHref}>{policyLabel}</a>
      </form>

      {isAvailabilityOpen ? (
        <div className={styles.modalOverlay} role="presentation">
          <div className={styles.bookingModal} role="dialog" aria-modal="true" aria-labelledby="availability-modal-title">
            <button
              className={styles.modalClose}
              type="button"
              onClick={() => {
                setIsAvailabilityOpen(false);
                setSelectedSlot(null);
              }}
              aria-label="Close availability"
            >
              x
            </button>
            <div className={styles.modalHeader}>
              <span>Reservation availability</span>
              <h3 id="availability-modal-title">Select a Slot</h3>
              <p>{selectedReservationType?.title ?? "Reservation"} on {selectedDate} for {guestCount} guests, {mealPeriod}</p>
            </div>

            <div className={styles.modalContent}>
              <section className={styles.slotPanel} aria-labelledby="slot-list-heading">
                <div className={styles.panelHeader}>
                  <h4 id="slot-list-heading">Available times</h4>
                  <span>{hasAvailableSlots ? "Choose one" : "No open slots"}</span>
                </div>

                {slots.length > 0 ? (
                  <div className={styles.slotGrid} aria-label="Available reservation times">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot?.slotStart === slot.slotStart;

                      return (
                        <button
                          className={[
                            slot.isAvailable ? styles.slotButton : styles.slotButtonDisabled,
                            isSelected ? styles.selectedSlotButton : "",
                          ].join(" ").trim()}
                          type="button"
                          onClick={() => {
                            if (!slot.isAvailable) return;
                            setSelectedSlot(slot);
                          }}
                          disabled={!slot.isAvailable}
                          aria-pressed={isSelected}
                          key={slot.slotStart}
                        >
                          <strong>{slot.label}</strong>
                          <small>{slot.remainingAvailability} seats left</small>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p>No slots are available for this date.</p>
                )}
              </section>

              <section className={styles.guestPanel} aria-labelledby="guest-details-heading">
                <div className={styles.panelHeader}>
                  <h4 id="guest-details-heading">Guest details</h4>
                  <span>{selectedSlot ? selectedSlot.label : "Slot required"}</span>
                </div>

                <label className={styles.fieldGroup}>
                  <span>Name</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.currentTarget.value)}
                    placeholder="Guest name"
                  />
                </label>
                <label className={styles.fieldGroup}>
                  <span>Phone number</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) => {
                      const nextPhoneNumber = event.currentTarget.value.replace(/\D/g, "").slice(0, 10);
                      setPhoneNumber(nextPhoneNumber);
                      if (nextPhoneNumber.length > 0) setPhoneTouched(true);
                    }}
                    onBlur={() => setPhoneTouched(true)}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    aria-invalid={phoneWarning}
                    aria-describedby="phone-warning"
                    placeholder="10 digit mobile number"
                  />
                </label>
                {phoneWarning ? (
                  <p className={styles.fieldWarning} id="phone-warning">Enter exactly 10 digits.</p>
                ) : null}

                <button
                  className={styles.checkButton}
                  type="button"
                  onClick={submitBooking}
                  disabled={isSubmitting || !selectedSlot || !customerName.trim() || !isPhoneValid}
                >
                  {isSubmitting ? "Confirming..." : "Submit Reservation"}
                </button>
              </section>
            </div>
          </div>
        </div>
      ) : null}

      {bookingSummary ? (
        <div className={styles.modalOverlay} role="presentation">
          <div className={styles.confirmationModal} role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
            <span className={styles.confirmationEyebrow}>Reservation confirmed</span>
            <h3 id="confirmation-title">Your table is booked.</h3>
            <p>Please keep this reservation ID for your visit.</p>
            <div className={styles.referenceBox} aria-label="Reservation ID">
              <span>Reservation ID</span>
              <strong>{bookingSummary.bookingReference}</strong>
            </div>
            <dl className={styles.confirmationDetails}>
              <div>
                <dt>Type</dt>
                <dd>{bookingSummary.reservationTypeTitle || selectedReservationType?.title || "Reservation"}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{bookingSummary.bookingDate}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{formatDisplayTimeRange(bookingSummary.slotStart, bookingSummary.slotEnd)}</dd>
              </div>
              <div>
                <dt>Guests</dt>
                <dd>{bookingSummary.guestCount ?? guestCount}</dd>
              </div>
            </dl>
            <button className={styles.checkButton} type="button" onClick={() => setBookingSummary(null)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getUpcomingReservationDates(count = 7) {
  const dayFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: reservationTimeZone,
  });
  const labelFormatter = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    timeZone: reservationTimeZone,
  });
  const today = new Date();

  return Array.from({ length: count }, (_, index): DateOption => {
    const date = new Date(today);
    date.setDate(today.getDate() + index + 1);

    return {
      isoDate: formatIsoDate(date),
      day: dayFormatter.format(date),
      label: labelFormatter.format(date),
    };
  });
}

function formatDisplayTimeRange(slotStart: string, slotEnd: string) {
  return `${formatDisplayTime(slotStart)} - ${formatDisplayTime(slotEnd)}`;
}

function formatDisplayTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatIsoDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: reservationTimeZone,
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}
