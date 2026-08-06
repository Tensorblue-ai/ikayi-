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
  const sectionImages = section.images ?? [];
  const itemImages = section.items
    .map((item, index) => ({ ...item, id: `${item.title}-${index}`, index }))
    .filter((item): item is typeof item & { image: string; index: number } => Boolean(item.image));
  function updateSectionImage(imageId: string, updates: Partial<NonNullable<HomepageSection["images"]>[number]>) {
    onUpdate({
      images: sectionImages.map((image) => (image.id === imageId ? { ...image, ...updates } : image)),
    });
  }

  function updateItemImage(itemIndex: number, updates: Partial<HomepageSection["items"][number]>) {
    onUpdate({
      items: section.items.map((item, index) => (index === itemIndex ? { ...item, ...updates } : item)),
    });
  }

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

          {sectionImages.length > 0 ? (
            <div className={styles.imageEditorList} aria-label="Section images">
              {sectionImages.map((image) => (
                <article className={styles.imageEditor} key={image.id}>
                  <div className={styles.imagePreviewWrap} role="img" aria-label={image.alt || image.label} style={{ backgroundImage: `url(${image.src})` }} />
                  <div className={styles.imageDetails}>
                    <strong>{image.label}</strong>
                    <label>
                      <span>Image description (alt text)</span>
                      <input value={image.alt ?? ""} onChange={(event) => updateSectionImage(image.id, { alt: event.target.value })} />
                    </label>
                    <label>
                      <span>Image URL</span>
                      <input value={image.src} onChange={(event) => updateSectionImage(image.id, { src: event.target.value })} />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
          <div className={styles.itemsHeader}>{section.layout}</div>
          {itemImages.length > 0 ? (
            <div className={styles.imageEditorList} aria-label="Item images">
              {itemImages.map((item) => (
                <article className={styles.imageEditor} key={item.id}>
                  <div className={styles.imagePreviewWrap} role="img" aria-label={item.alt || item.title} style={{ backgroundImage: `url(${item.image})` }} />
                  <div className={styles.imageDetails}>
                    <strong>{item.title}</strong>
                    <label>
                      <span>Image description (alt text)</span>
                      <input value={item.alt ?? ""} onChange={(event) => updateItemImage(item.index, { alt: event.target.value })} />
                    </label>
                    <label>
                      <span>Image URL</span>
                      <input value={item.image} onChange={(event) => updateItemImage(item.index, { image: event.target.value })} />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
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

