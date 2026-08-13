import Link from "next/link";
import styles from "./AdminSidebar.module.css";
import {
  Activity,
  CalendarDays,
  ExternalLink,
  FileText,
  LayoutGrid,
  Settings,
  Table,
  type LucideIcon,
} from "lucide-react";

export type AdminView = "content" | "tables" | "bookings" | "reservation-types" | "media" | "settings";

type AdminSidebarProps = {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
};

type SidebarIconName = "grid" | "table" | "document" | "calendar" | "settings" | "pulse" | "external";

const sidebarItems: Array<{ label: string; view: AdminView; icon: SidebarIconName }> = [
  { label: "Overview", view: "content", icon: "grid" },
  { label: "Tables", view: "tables", icon: "table" },
  { label: "Bookings", view: "bookings", icon: "calendar" },
  { label: "Reservation types", view: "reservation-types", icon: "document" },
  { label: "Pages & content", view: "media", icon: "document" },
  { label: "Settings", view: "settings", icon: "settings" },
];

const sidebarIcons: Record<SidebarIconName, LucideIcon> = {
  grid: LayoutGrid,
  table: Table,
  document: FileText,
  calendar: CalendarDays,
  settings: Settings,
  pulse: Activity,
  external: ExternalLink,
};

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Admin navigation">
      <div className={styles.sidebarLogo} aria-label="Ikayi admin home">
        <span className={styles.logoMark}>
          <span>IKAYI</span>
          <small>Modern Indian</small>
        </span>
        <span className={styles.logoText}>
          <strong>Ikayi</strong>
          <small>Backend</small>
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
  const Icon = sidebarIcons[name];

  return (
    <span className={styles.sidebarIcon} aria-hidden="true">
      <Icon size={20} strokeWidth={1.9} />
    </span>
  );
}
