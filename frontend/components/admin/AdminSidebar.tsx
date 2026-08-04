import Link from "next/link";
import styles from "./AdminSidebar.module.css";

export type AdminView = "content" | "bookings" | "media" | "settings";

type AdminSidebarProps = {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
};

type SidebarIconName = "grid" | "document" | "calendar" | "settings" | "pulse" | "external";

const sidebarItems: Array<{ label: string; view: AdminView; icon: SidebarIconName }> = [
  { label: "Overview", view: "content", icon: "grid" },
  { label: "Pages & content", view: "media", icon: "document" },
  { label: "Bookings", view: "bookings", icon: "calendar" },
  { label: "Settings", view: "settings", icon: "settings" },
];

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Admin navigation">
      <div className={styles.sidebarLogo} aria-label="Ikayi admin home">
        <span className={styles.logoMark}>IK</span>
        <span className={styles.logoText}>
          <strong>Ikayi</strong>
          <small>Company CMS</small>
        </span>
      </div>

      <nav className={styles.sidebarNav}>
        {sidebarItems.map((item) => (
          <button
            className={activeView === item.view ? styles.sidebarLinkActive : styles.sidebarLink}
            type="button"
            onClick={() => onViewChange(item.view)}
            key={item.view}
          >
            <SidebarIcon name={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.monitorLink} type="button">
          <SidebarIcon name="pulse" />
          System uptime monitor
        </button>
        <Link className={styles.viewSiteLink} href="/">
          <SidebarIcon name="external" />
          View website
        </Link>
      </div>
    </aside>
  );
}

function SidebarIcon({ name }: { name: SidebarIconName }) {
  return (
    <span className={styles.sidebarIcon} aria-hidden="true">
      {name === "grid" ? (
        <svg viewBox="0 0 24 24">
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
        </svg>
      ) : null}
      {name === "document" ? (
        <svg viewBox="0 0 24 24">
          <path d="M7 3h7l4 4v14H7zM14 3v5h4M10 12h5M10 16h5" />
        </svg>
      ) : null}
      {name === "calendar" ? (
        <svg viewBox="0 0 24 24">
          <path d="M5 6h14v14H5zM8 3v5M16 3v5M5 10h14" />
        </svg>
      ) : null}
      {name === "settings" ? (
        <svg viewBox="0 0 24 24">
          <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
        </svg>
      ) : null}
      {name === "pulse" ? (
        <svg viewBox="0 0 24 24">
          <path d="M3 12h4l2-6 4 12 3-8 2 2h3" />
        </svg>
      ) : null}
      {name === "external" ? (
        <svg viewBox="0 0 24 24">
          <path d="M9 5H5v14h14v-4M13 5h6v6M11 13l8-8" />
        </svg>
      ) : null}
    </span>
  );
}
