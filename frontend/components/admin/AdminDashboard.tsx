"use client";

import { useMemo, useState } from "react";
import { AdminSectionEditorModal } from "./AdminSectionEditorModal";
import { AdminSidebar, type AdminView } from "./AdminSidebar";
import { bookings, initialSections } from "./adminDashboardData";
import styles from "./AdminDashboard.module.css";

export type SectionStatus = "published" | "draft";

export type HomepageSection = {
  id: string;
  title: string;
  copy: string;
  layout: string;
  status: SectionStatus;
  items: Array<{ title: string; copy: string }>;
};

export type Booking = {
  reference: string;
  service: string;
  scheduled: string;
  total: string;
  status: "confirmed" | "completed" | "cancelled";
};

export function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>("content");
  const [sections, setSections] = useState(initialSections);
  const [selectedId, setSelectedId] = useState(initialSections[0].id);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
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

  function updateSelectedSection(updates: Partial<HomepageSection>) {
    setSections((currentSections) =>
      currentSections.map((section) =>
        section.id === selectedSection.id ? { ...section, ...updates } : section
      )
    );
  }

  function openEditor(sectionId: string) {
    setSelectedId(sectionId);
    setIsEditorOpen(true);
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
          <section className={styles.emptyPanel}>
            <h2>Overview</h2>
            <p>High-level CMS activity will appear here.</p>
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
                    <button
                      className={styles.iconButton}
                      type="button"
                      aria-label={`Edit ${section.title}`}
                      onClick={() => openEditor(section.id)}
                    >
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
            onClose={() => setIsEditorOpen(false)}
            onSave={() => setIsEditorOpen(false)}
            onUpdate={updateSelectedSection}
          />
        ) : null}

        {activeView === "bookings" ? (
          <section className={styles.bookingsPanel} id="bookings" aria-labelledby="bookings-heading">
            <div className={styles.panelHeader}>
              <div>
                <h2 id="bookings-heading">Bookings</h2>
                <p>Mark a delivered booking completed to unlock its customer review.</p>
              </div>
            </div>

            {bookings.length > 0 ? (
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Services</th>
                      <th>Scheduled</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.reference}>
                        <td>{booking.reference}</td>
                        <td>{booking.service}</td>
                        <td>{booking.scheduled}</td>
                        <td>{booking.total}</td>
                        <td>
                          <select defaultValue={booking.status} aria-label={`${booking.reference} status`}>
                            <option value="confirmed">confirmed</option>
                            <option value="completed">completed</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.emptyText}>No bookings to show.</p>
            )}
          </section>
        ) : null}

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
