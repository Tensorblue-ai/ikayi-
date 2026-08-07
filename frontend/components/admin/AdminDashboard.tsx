"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminBookingsPanel } from "./AdminBookingsPanel";
import { AdminSectionEditorModal } from "./AdminSectionEditorModal";
import { AdminSidebar, type AdminView } from "./AdminSidebar";
import { AdminOverviewPanel } from "./AdminOverviewPanel";
import { initialSections } from "./adminDashboardData";
import { mapAdminSectionsResponse, type AdminSectionPayload } from "./adminSectionMapper";
import styles from "./AdminDashboard.module.css";

export type SectionStatus = "published" | "draft";

export type HomepageSection = {
  id: string;
  title: string;
  copy: string;
  summary: string;
  layout: string;
  status: SectionStatus;
  images?: Array<{ id: string; label: string; src: string; alt?: string }>;
  items: Array<{ title: string; copy: string; image?: string; alt?: string }>;
};

export type Booking = {
  reference: string;
  service: string;
  scheduled: string;
  total: string;
  status: "confirmed" | "completed" | "cancelled";
};

type TableSettings = {
  numberOfTables: number;
  chairsPerTable: number;
  openingTime: string;
  closingTime: string;
  slotLengthMinutes: number;
  timezone: string;
};

type TableSettingsField = keyof Pick<
  TableSettings,
  "numberOfTables" | "chairsPerTable" | "openingTime" | "closingTime" | "slotLengthMinutes"
>;

type UploadAssetResponse = {
  url?: string;
  message?: string;
};

const defaultTableSettings: TableSettings = {
  numberOfTables: 10,
  chairsPerTable: 4,
  openingTime: "12:00",
  closingTime: "00:00",
  slotLengthMinutes: 60,
  timezone: "Asia/Kolkata",
};

const backendSectionKeyById: Record<string, string> = {
  experience: "experience",
  kitchen: "kitchen-experience",
  stories: "stories",
  signature: "signature-experiences",
  "guest-journey": "guest-journey",
  gallery: "gallery",
};
const dashboardIdByBackendSectionKey = Object.fromEntries(
  Object.entries(backendSectionKeyById).map(([dashboardId, backendSectionKey]) => [backendSectionKey, dashboardId])
) as Record<string, string>;

const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:5000";

export function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>("content");
  const [sections, setSections] = useState(initialSections);
  const [selectedId, setSelectedId] = useState(initialSections[0].id);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [editorError, setEditorError] = useState("");
  const [sectionsError, setSectionsError] = useState("");
  const [tableSettings, setTableSettings] = useState<TableSettings>(defaultTableSettings);
  const [hasLoadedTableSettings, setHasLoadedTableSettings] = useState(false);
  const [isLoadingTableSettings, setIsLoadingTableSettings] = useState(false);
  const [isSavingTableSettings, setIsSavingTableSettings] = useState(false);
  const [tableSettingsError, setTableSettingsError] = useState("");
  const [tableSettingsStatus, setTableSettingsStatus] = useState("");
  const viewTitle =
    activeView === "content"
      ? "Overview"
      : activeView === "media"
        ? "Pages & content"
        : activeView[0].toUpperCase() + activeView.slice(1);

  const selectedSection = useMemo(
    () => sections.find((section) => section.id === selectedId) ?? sections[0],
    [sections, selectedId]
  );
  const availability = Math.max(tableSettings.numberOfTables, 0) * Math.max(tableSettings.chairsPerTable, 0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSections() {
      setSectionsError("");

      try {
        const response = await fetch(`${apiOrigin}/api/admin/sections`, { signal: controller.signal });

        if (!response.ok) throw new Error(`Sections request failed with status ${response.status}`);

        const payload = (await response.json()) as { sections?: AdminSectionPayload[] };
        setSections(mapAdminSectionsResponse(payload.sections));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSectionsError(error instanceof Error ? error.message : "Unable to load homepage sections.");
      }
    }

    loadSections();

    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (activeView !== "tables" || hasLoadedTableSettings) return;

    const controller = new AbortController();

    async function loadTableSettings() {
      setIsLoadingTableSettings(true);
      setTableSettingsError("");

      try {
        const response = await fetch(`${apiOrigin}/api/admin/tables/settings`, { signal: controller.signal });

        if (!response.ok) throw new Error(`Settings request failed with status ${response.status}`);

        const payload = (await response.json()) as { settings: TableSettings };
        setTableSettings(payload.settings);
        setHasLoadedTableSettings(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setTableSettingsError(error instanceof Error ? error.message : "Unable to load table settings.");
      } finally {
        setIsLoadingTableSettings(false);
      }
    }

    loadTableSettings();

    return () => controller.abort();
  }, [activeView, hasLoadedTableSettings]);

  function updateSelectedSection(updates: Partial<HomepageSection>) {
    setSections((currentSections) =>
      currentSections.map((section) =>
        section.id === selectedSection.id ? { ...section, ...updates } : section
      )
    );
  }

  function updateTableSetting(field: TableSettingsField, value: string | number) {
    setTableSettingsStatus("");
    setTableSettings((currentSettings) => ({ ...currentSettings, [field]: value }));
  }

  function openEditor(sectionId: string) {
    setSelectedId(sectionId);
    setEditorError("");
    setIsEditorOpen(true);
  }

  function openOverviewSection(sectionKey: string) {
    const sectionId = dashboardIdByBackendSectionKey[sectionKey];

    if (!sectionId) return;

    setActiveView("media");
    openEditor(sectionId);
  }

  async function uploadAdminImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${apiOrigin}/api/assets/admin/upload`, {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json()) as UploadAssetResponse;

    if (!response.ok || !payload.url) {
      throw new Error(payload.message ?? `Upload failed with status ${response.status}`);
    }

    return payload.url;
  }

  async function saveSelectedSection() {
    const sectionKey = backendSectionKeyById[selectedSection.id];

    if (!sectionKey) {
      setEditorError("This section is not mapped to a backend API yet.");
      return;
    }

    setIsSavingSection(true);
    setEditorError("");

    try {
      const response = await fetch(`${apiOrigin}/api/admin/sections/${sectionKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedSection.title,
          copy: selectedSection.copy,
          summary: selectedSection.summary,
          status: selectedSection.status,
          images: selectedSection.images,
          items: selectedSection.items,
        }),
      });

      const payload = (await response.json()) as { summary?: AdminSectionPayload; message?: string };

      if (!response.ok) throw new Error(payload.message ?? `Save failed with status ${response.status}`);

      if (payload.summary) {
        const savedSection = mapAdminSectionsResponse([payload.summary]).find((section) => section.id === selectedSection.id);

        if (savedSection) {
          updateSelectedSection(savedSection);
        }
      }

      setIsEditorOpen(false);
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : "Unable to save section.");
    } finally {
      setIsSavingSection(false);
    }
  }

  async function saveTableSettings() {
    setIsSavingTableSettings(true);
    setTableSettingsError("");
    setTableSettingsStatus("");

    try {
      const response = await fetch(`${apiOrigin}/api/admin/tables/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numberOfTables: tableSettings.numberOfTables,
          chairsPerTable: tableSettings.chairsPerTable,
          openingTime: tableSettings.openingTime,
          closingTime: tableSettings.closingTime,
          slotLengthMinutes: tableSettings.slotLengthMinutes,
        }),
      });

      const payload = (await response.json()) as { settings?: TableSettings; message?: string };

      if (!response.ok || !payload.settings) throw new Error(payload.message ?? `Save failed with status ${response.status}`);

      setTableSettings(payload.settings);
      setHasLoadedTableSettings(true);
      setTableSettingsStatus("Table settings saved.");
    } catch (error) {
      setTableSettingsError(error instanceof Error ? error.message : "Unable to save table settings.");
    } finally {
      setIsSavingTableSettings(false);
    }
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
      <main className={styles.adminShell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>IKAYI CMS</p>
            <h1>{viewTitle}</h1>
          </div>
          <div className={styles.avatar} aria-label="Admin profile">IK</div>
        </header>

        {activeView === "content" ? (
          <AdminOverviewPanel
            onEditSection={openOverviewSection}
            onViewBookings={() => setActiveView("bookings")}
            onViewTables={() => setActiveView("tables")}
          />
        ) : null}

        {activeView === "tables" ? (
          <section className={styles.tablesPanel} aria-labelledby="tables-heading">
            <div className={styles.panelHeader}>
              <div>
                <h2 id="tables-heading">Tables</h2>
                <p>Control hourly reservation capacity for customer bookings.</p>
              </div>
              <button className={styles.primaryButton} type="button" onClick={saveTableSettings} disabled={isSavingTableSettings}>
                {isSavingTableSettings ? "Saving..." : "Save table settings"}
              </button>
            </div>

            {isLoadingTableSettings ? <p className={styles.emptyText}>Loading table settings...</p> : null}
            {tableSettingsError ? <p className={styles.errorText}>{tableSettingsError}</p> : null}
            {tableSettingsStatus ? <p className={styles.successText}>{tableSettingsStatus}</p> : null}

            <div className={styles.tablesGrid}>
              <div className={styles.formGrid}>
                <label>
                  <span>Number of tables</span>
                  <input min="1" type="number" value={tableSettings.numberOfTables} onChange={(event) => updateTableSetting("numberOfTables", event.currentTarget.valueAsNumber || 0)} />
                </label>
                <label>
                  <span>Number of chairs</span>
                  <input min="1" type="number" value={tableSettings.chairsPerTable} onChange={(event) => updateTableSetting("chairsPerTable", event.currentTarget.valueAsNumber || 0)} />
                </label>
                <label>
                  <span>Opening time</span>
                  <input type="time" value={tableSettings.openingTime} onChange={(event) => updateTableSetting("openingTime", event.currentTarget.value)} />
                </label>
                <label>
                  <span>Closing time</span>
                  <input type="time" value={tableSettings.closingTime} onChange={(event) => updateTableSetting("closingTime", event.currentTarget.value)} />
                </label>
                <label className={styles.fieldFull}>
                  <span>Slot length</span>
                  <input min="1" type="number" value={tableSettings.slotLengthMinutes} onChange={(event) => updateTableSetting("slotLengthMinutes", event.currentTarget.valueAsNumber || 0)} />
                </label>
              </div>

              <aside className={styles.availabilityCard} aria-label="Reservation availability">
                <span>Availability</span>
                <strong>{availability}</strong>
                <small>{tableSettings.numberOfTables} tables x {tableSettings.chairsPerTable} chairs</small>
              </aside>
            </div>
          </section>
        ) : null}

        {activeView === "media" ? (
          <section className={styles.sectionPanel} aria-labelledby="homepage-sections-heading">
            <div className={styles.panelHeader}>
              <div>
                <h2 id="homepage-sections-heading">Homepage sections</h2>
                <p>Names below match the titles customers see.</p>
              </div>
              <button className={styles.secondaryButton} type="button">
                <span aria-hidden="true">+</span>
                Add section
              </button>
            </div>

            {sectionsError ? <p className={styles.errorText}>{sectionsError}</p> : null}

            <div className={styles.sectionList}>
              {sections.map((section, index) => (
                <article className={styles.sectionRow} key={section.id}>
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <button className={styles.sectionSummary} type="button" onClick={() => openEditor(section.id)}>
                    <strong>{section.title}</strong>
                    <span>{section.copy}</span>
                  </button>
                  <div className={styles.rowActions}>
                    <span className={section.status === "published" ? styles.published : styles.draft}>
                      {section.status === "published" ? "Published" : "Draft"}
                    </span>
                    <button className={styles.iconButton} type="button" aria-label={`Edit ${section.title}`} onClick={() => openEditor(section.id)}>
                      &gt;
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeView === "media" && isEditorOpen ? (
          <AdminSectionEditorModal
            section={selectedSection}
            error={editorError}
            isSaving={isSavingSection}
            onClose={() => setIsEditorOpen(false)}
            onSave={saveSelectedSection}
            onUpdate={updateSelectedSection}
            onUploadImage={uploadAdminImage}
          />
        ) : null}

        {activeView === "bookings" ? <AdminBookingsPanel /> : null}

        {activeView === "settings" ? (
          <section className={styles.emptyPanel}>
            <h2>Settings</h2>
            <p>Admin account and site settings will be added after authentication is in place.</p>
          </section>
        ) : null}
      </main>
    </div>
  );
}
