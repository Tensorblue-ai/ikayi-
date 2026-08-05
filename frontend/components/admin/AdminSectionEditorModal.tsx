import { type HomepageSection, type SectionStatus } from "./AdminDashboard";
import styles from "./AdminSectionEditorModal.module.css";

type AdminSectionEditorModalProps = {
  section: HomepageSection;
  error?: string;
  isSaving?: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  onUpdate: (updates: Partial<HomepageSection>) => void;
};

export function AdminSectionEditorModal({
  section,
  error = "",
  isSaving = false,
  onClose,
  onSave,
  onUpdate,
}: AdminSectionEditorModalProps) {
  return (
    <div className={styles.overlay} role="presentation">
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-section-heading">
        <div className={styles.modalHeader}>
          <div>
            <h2 id="edit-section-heading">Edit {section.title}</h2>
            <p>Change the title, layout, visible content and publishing state.</p>
          </div>
          <button className={styles.closeButton} type="button" aria-label="Close editor" onClick={onClose}>
            X
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGrid}>
            <label className={styles.fieldFull}>
              <span>Section title</span>
              <input value={section.title} onChange={(event) => onUpdate({ title: event.target.value })} />
            </label>

            <label className={styles.fieldFull}>
              <span>Supporting copy</span>
              <input value={section.copy} onChange={(event) => onUpdate({ copy: event.target.value })} />
            </label>

            <label className={styles.fieldFull}>
              <span>Section summary</span>
              <textarea value={section.summary ?? ""} onChange={(event) => onUpdate({ summary: event.target.value })} />
            </label>

            <label>
              <span>Section layout</span>
              <select value={section.layout} onChange={(event) => onUpdate({ layout: event.target.value })}>
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
              <select value={section.status} onChange={(event) => onUpdate({ status: event.target.value as SectionStatus })}>
                <option value="published">Published - visible</option>
                <option value="draft">Draft - hidden</option>
              </select>
            </label>

            <label className={styles.fieldFull}>
              <span>See all link (optional)</span>
              <input placeholder="/gallery" />
            </label>
          </div>

          <div className={styles.itemsHeader}>{section.layout}</div>
          <div className={styles.itemGrid}>
            {section.items.map((item) => (
              <label className={styles.itemChoice} key={item.title}>
                <input type="checkbox" defaultChecked />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.copy}</small>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.editorActions}>
          <button className={styles.deleteButton} type="button">Delete section</button>
          <div className={styles.actionGroup}>
            {error ? <p className={styles.saveError}>{error}</p> : null}
            <button className={styles.cancelButton} type="button" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button className={styles.primaryButton} type="button" onClick={() => void onSave()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save section"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
