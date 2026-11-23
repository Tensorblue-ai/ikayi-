import { CalendarDays, Camera, Clock, MapPin, Users, Utensils } from "lucide-react";
import styles from "./ReservationOverviewSection.module.css";

const overviewItems = [
  {
    icon: MapPin,
    title: "Address",
    copy: "sector-c, alkapuri, aliganj main rd, ekta vihar, sp-1, chandralok, lucknow, uttar pradesh 226020",
  },
  { icon: Camera, title: "Instagram", copy: "@ikayi_lucknow" },
  { icon: Clock, title: "Reservations", copy: "10am - 10pm" },
  { icon: Clock, title: "Operations", copy: "12pm - 11pm" },
  { icon: CalendarDays, title: "Closed", copy: "tuesdays" },
];

const detailItems = [
  { icon: Utensils, title: "Dining Style", copy: "modern indian, curated for elegant everyday dining and intimate gatherings." },
  { icon: MapPin, title: "Experiences", copy: "chef's course, high tea ritual, business lunch, and special occasion dining." },
  { icon: Clock, title: "Service Hours", copy: "lunch and dinner only." },
  { icon: Users, title: "Perfect For", copy: "celebrations, private gatherings, and thoughtfully hosted meals." },
];

export function ReservationOverviewSection() {
  return (
    <section className={styles.overviewSection} aria-labelledby="overview-heading">
      <div className={styles.headingBlock}>
        <h2 id="overview-heading">Overview</h2>
        <div className={styles.rule} aria-hidden="true">
          <span />
        </div>
        <p>explore ikayi, a refined modern indian dining destination in lucknow, designed for memorable lunch and dinner experiences.</p>
      </div>

      <div className={styles.summaryGrid}>
        {overviewItems.map((item) => {
          const Icon = item.icon;

          return (
            <article className={styles.summaryItem} key={item.title}>
              <Icon aria-hidden="true" size={23} strokeWidth={1.7} />
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </article>
          );
        })}
      </div>

      <div className={styles.detailGrid}>
        {detailItems.map((item) => {
          const Icon = item.icon;

          return (
            <article className={styles.detailCard} key={item.title}>
              <Icon aria-hidden="true" size={28} strokeWidth={1.6} />
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
