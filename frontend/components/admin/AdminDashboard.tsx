"use client";

import { useMemo, useState } from "react";
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
          <section className={styles.editorPanel} aria-labelledby="edit-section-heading">
            <div className={styles.editorHeader}>
              <div>
                <h2 id="edit-section-heading">Edit homepage section</h2>
                <p>Change visible content and publishing state. Saved changes update the preview state.</p>
              </div>
              <button className={styles.closeButton} type="button" aria-label="Close editor" onClick={() => setIsEditorOpen(false)}>X</button>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.fieldFull}>
                <span>Section title</span>
                <input value={selectedSection.title} onChange={(event) => updateSelectedSection({ title: event.target.value })} />
              </label>

              <label className={styles.fieldFull}>
                <span>Supporting copy</span>
                <input value={selectedSection.copy} onChange={(event) => updateSelectedSection({ copy: event.target.value })} />
              </label>

              <label>
                <span>Section layout</span>
                <select value={selectedSection.layout} onChange={(event) => updateSelectedSection({ layout: event.target.value })}>
                  <option>Guest feelings</option>
                  <option>Image collage</option>
                  <option>Story cards</option>
                  <option>Experience cards</option>
                  <option>Journey highlights</option>
                  <option>Image grid</option>
                </select>
              </label>

              <label>
                <span>Publishing</span>
                <select value={selectedSection.status} onChange={(event) => updateSelectedSection({ status: event.target.value as SectionStatus })}>
                  <option value="published">Published - visible</option>
                  <option value="draft">Draft - hidden</option>
                </select>
              </label>

              <label className={styles.fieldFull}>
                <span>See all link (optional)</span>
                <input placeholder="/gallery" />
              </label>
            </div>

            <div className={styles.itemsHeader}>Content shown</div>
            <div className={styles.itemGrid}>
              {selectedSection.items.map((item) => (
                <label className={styles.itemChoice} key={item.title}>
                  <input type="checkbox" defaultChecked />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.copy}</small>
                  </span>
                </label>
              ))}
            </div>

            <div className={styles.editorActions}>
              <button className={styles.deleteButton} type="button">Delete section</button>
              <div>
                <button className={styles.cancelButton} type="button" onClick={() => setIsEditorOpen(false)}>Cancel</button>
                <button className={styles.primaryButton} type="button" onClick={() => setIsEditorOpen(false)}>Save section</button>
              </div>
            </div>
          </section>
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
