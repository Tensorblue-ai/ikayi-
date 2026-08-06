import Image from "next/image";
import Link from "next/link";
import styles from "./StickyNavbar.module.css";

const navItems = [
  { label: "Experience", href: "/#experience" },
  { label: "Kitchen", href: "/#kitchen-experience" },
  { label: "Stories", href: "/#stories" },
  { label: "Signature", href: "/#signature-experiences" },
  { label: "Guest Journey", href: "/#private-dining" },
  { label: "Gallery", href: "/#gallery" },
];

export function StickyNavbar() {
  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/" aria-label="Ikayi home">
        <Image className={styles.logoImage} src="/api/assets/assets/IKAYI%20LOGO2.png" alt="" width={156} height={58} priority unoptimized />
        <span className={styles.logoFallback}>IKAYI</span>
      </Link>

      <nav className={styles.nav} aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className={styles.reservationLink} href="/reservations">
        Reservations
      </Link>
    </header>
  );
}
