import Image from "next/image";
import type { CustomSectionData } from "@/lib/homepage-sections";
import styles from "../signature-experiences/SignatureExperiencesSection.module.css";

export function CustomSection({ section }: { section: CustomSectionData }) {
  return (
    <section className={styles.signature} id={section.sectionKey} aria-labelledby={`${section.sectionKey}-heading`}>
      <div className={styles.headingBlock}>
        <div className={styles.titleRule} aria-hidden="true"><span /></div>
        <h2 id={`${section.sectionKey}-heading`}>{section.title}</h2>
        <div className={styles.titleRule} aria-hidden="true"><span /></div>
      </div>
      {section.copy ? <p className={styles.intro}>{section.copy}</p> : null}
      {section.image ? (
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.imageWrap}>
              <Image src={section.image} alt={section.imageAlt || section.title} fill sizes="(max-width: 980px) 90vw, 640px" />
            </div>
          </div>
        </div>
      ) : null}
      {section.summary ? <p className={styles.intro}>{section.summary}</p> : null}
    </section>
  );
}
