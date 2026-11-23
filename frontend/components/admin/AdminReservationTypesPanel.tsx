"use client";

import { useEffect, useState } from "react";
import styles from "./AdminReservationTypesPanel.module.css";

type ReservationType = {
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

type ReservationTypePayload = {
  reservationTypes?: ReservationType[];
  reservationType?: ReservationType;
  message?: string;
};

const apiOrigin = "";
const iconOptions: ReservationType["icon"][] = ["cloche", "teapot", "briefcase", "lotus", "sun", "handshake", "tractor"];
const emptyDraft: ReservationType = {
  slug: "",
  title: "",
  eyebrow: "",
  description: "",
  details: [],
  badgeLabel: "",
  icon: "cloche",
  pageGroup: "primary",
  cardSize: "standard",
  mealPeriods: ["lunch", "dinner"],
  defaultGuests: 2,
  minGuests: 1,
  maxGuests: 12,
  sortOrder: 10,
  isActive: true,
};

export function AdminReservationTypesPanel() {
  const [reservationTypes, setReservationTypes] = useState<ReservationType[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [draft, setDraft] = useState<ReservationType>(emptyDraft);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isExisting = Boolean(selectedSlug);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReservationTypes() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiOrigin}/api/admin/reservation-types`, { signal: controller.signal });
        const payload = (await response.json()) as ReservationTypePayload;

        if (!response.ok || !payload.reservationTypes) throw new Error(payload.message ?? `Request failed with ${response.status}`);

        setReservationTypes(payload.reservationTypes);
        if (payload.reservationTypes[0]) {
          setSelectedSlug(payload.reservationTypes[0].slug);
          setDraft(normalizeDraft(payload.reservationTypes[0]));
        }
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load reservation types.");
      } finally {
        setIsLoading(false);
      }
    }

    loadReservationTypes();

    return () => controller.abort();
  }, []);

  function selectReservationType(type: ReservationType) {
    setSelectedSlug(type.slug);
    setDraft(normalizeDraft(type));
    setMessage("");
    setError("");
  }

  function startNewReservationType() {
    setSelectedSlug("");
    setDraft({ ...emptyDraft, sortOrder: reservationTypes.length + 1 });
    setMessage("");
    setError("");
  }

  function updateDraft(updates: Partial<ReservationType>) {
    setDraft((current) => ({ ...current, ...updates }));
    setMessage("");
  }

  async function saveReservationType() {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${apiOrigin}/api/admin/reservation-types${isExisting ? `/${selectedSlug}` : ""}`, {
        method: isExisting ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          details: draft.details.filter(Boolean),
          mealPeriods: draft.mealPeriods,
        }),
      });
      const payload = (await response.json()) as ReservationTypePayload;

      if (!response.ok || !payload.reservationType) throw new Error(payload.message ?? `Save failed with ${response.status}`);

      setReservationTypes((current) => upsertReservationType(current, payload.reservationType as ReservationType));
      setSelectedSlug(payload.reservationType.slug);
      setDraft(normalizeDraft(payload.reservationType));
      setMessage("Reservation type saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save reservation type.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deactivateReservationType() {
    if (!selectedSlug) return;

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${apiOrigin}/api/admin/reservation-types/${selectedSlug}`, { method: "DELETE" });
      const payload = (await response.json()) as ReservationTypePayload;

      if (!response.ok || !payload.reservationType) throw new Error(payload.message ?? `Deactivate failed with ${response.status}`);

      setReservationTypes((current) => upsertReservationType(current, payload.reservationType as ReservationType));
      setDraft(normalizeDraft(payload.reservationType));
      setMessage("Reservation type deactivated.");
    } catch (deactivateError) {
      setError(deactivateError instanceof Error ? deactivateError.message : "Unable to deactivate reservation type.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="reservation-types-heading">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="reservation-types-heading">Reservation Types</h2>
          <p>Manage the cards shown on the customer reservation page.</p>
        </div>
        <button className={styles.secondaryButton} type="button" onClick={startNewReservationType}>Add type</button>
      </div>

      {isLoading ? <p className={styles.emptyText}>Loading reservation types...</p> : null}
      {error ? <p className={styles.errorText}>{error}</p> : null}
      {message ? <p className={styles.successText}>{message}</p> : null}

      <div className={styles.editorGrid}>
        <div className={styles.typeList} aria-label="Reservation type list">
          {reservationTypes.map((type) => (
            <button
              className={selectedSlug === type.slug ? styles.typeButtonActive : styles.typeButton}
              type="button"
              onClick={() => selectReservationType(type)}
              key={type.slug}
            >
              <span>{String(type.sortOrder).padStart(2, "0")}</span>
              <strong>{type.title}</strong>
              <small>{type.isActive ? type.pageGroup : "inactive"}</small>
            </button>
          ))}
        </div>

        <div className={styles.formGrid}>
          <label>
            <span>Title</span>
            <input value={draft.title} onChange={(event) => updateDraft({ title: event.currentTarget.value })} />
          </label>
          <label>
            <span>Slug</span>
            <input value={draft.slug} onChange={(event) => updateDraft({ slug: event.currentTarget.value })} disabled={isExisting} />
          </label>
          <label>
            <span>Eyebrow</span>
            <input value={draft.eyebrow} onChange={(event) => updateDraft({ eyebrow: event.currentTarget.value })} />
          </label>
          <label>
            <span>Badge</span>
            <input value={draft.badgeLabel} onChange={(event) => updateDraft({ badgeLabel: event.currentTarget.value })} />
          </label>
          <label className={styles.fieldFull}>
            <span>Description</span>
            <textarea value={draft.description} onChange={(event) => updateDraft({ description: event.currentTarget.value })} />
          </label>
          <label className={styles.fieldFull}>
            <span>Details</span>
            <input value={draft.details.join(" | ")} onChange={(event) => updateDraft({ details: event.currentTarget.value.split("|").map((item) => item.trim()) })} />
          </label>
          <label>
            <span>Icon</span>
            <select value={draft.icon} onChange={(event) => updateDraft({ icon: event.currentTarget.value as ReservationType["icon"] })}>
              {iconOptions.map((icon) => <option value={icon} key={icon}>{icon}</option>)}
            </select>
          </label>
          <label>
            <span>Group</span>
            <select value={draft.pageGroup} onChange={(event) => updateDraft({ pageGroup: event.currentTarget.value as ReservationType["pageGroup"] })}>
              <option value="primary">Primary</option>
              <option value="more">More</option>
            </select>
          </label>
          <label>
            <span>Card Size</span>
            <select value={draft.cardSize} onChange={(event) => updateDraft({ cardSize: event.currentTarget.value as ReservationType["cardSize"] })}>
              <option value="standard">Standard</option>
              <option value="wide">Wide</option>
            </select>
          </label>
          <label>
            <span>Sort Order</span>
            <input type="number" value={draft.sortOrder} onChange={(event) => updateDraft({ sortOrder: event.currentTarget.valueAsNumber || 0 })} />
          </label>
          <label>
            <span>Min Guests</span>
            <input type="number" min="1" value={draft.minGuests} onChange={(event) => updateDraft({ minGuests: event.currentTarget.valueAsNumber || 1 })} />
          </label>
          <label>
            <span>Max Guests</span>
            <input type="number" min="1" value={draft.maxGuests} onChange={(event) => updateDraft({ maxGuests: event.currentTarget.valueAsNumber || 1 })} />
          </label>
          <label className={styles.checkboxField}>
            <input type="checkbox" checked={draft.isActive} onChange={(event) => updateDraft({ isActive: event.currentTarget.checked })} />
            <span>Active on website</span>
          </label>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="checkbox" checked={draft.mealPeriods.includes("lunch")} onChange={(event) => updateDraft({ mealPeriods: toggleMealPeriod(draft.mealPeriods, "lunch", event.currentTarget.checked) })} />
              <span>Lunch</span>
            </label>
            <label>
              <input type="checkbox" checked={draft.mealPeriods.includes("dinner")} onChange={(event) => updateDraft({ mealPeriods: toggleMealPeriod(draft.mealPeriods, "dinner", event.currentTarget.checked) })} />
              <span>Dinner</span>
            </label>
          </div>
          <div className={styles.actions}>
            <button className={styles.primaryButton} type="button" onClick={saveReservationType} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save type"}
            </button>
            {isExisting ? <button className={styles.dangerButton} type="button" onClick={deactivateReservationType} disabled={isSaving}>Deactivate</button> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function normalizeDraft(type: ReservationType): ReservationType {
  return { ...type, details: type.details ?? [], mealPeriods: type.mealPeriods ?? [] };
}

function upsertReservationType(current: ReservationType[], nextType: ReservationType) {
  const existingIndex = current.findIndex((type) => type.slug === nextType.slug);
  const nextTypes = existingIndex >= 0 ? current.map((type) => (type.slug === nextType.slug ? nextType : type)) : [...current, nextType];

  return nextTypes.sort((first, second) => first.sortOrder - second.sortOrder);
}

function toggleMealPeriod(current: ReservationType["mealPeriods"], period: "lunch" | "dinner", isChecked: boolean) {
  if (isChecked) return Array.from(new Set([...current, period]));
  return current.filter((entry) => entry !== period);
}