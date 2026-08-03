import Link from "next/link";
import styles from "./StickyNavbar.module.css";

const navItems = ["Experience", "Menu", "Kitchen Experience", "Stories", "Gallery", "About"];

export function StickyNavbar() {
  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/" aria-label="Ikayi home">
        <span>IKAYI</span>
        <small>Modern Indian</small>
      </Link>

      <nav className={styles.nav} aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link href={`/#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
            {item}
          </Link>
        ))}
      </nav>

      <Link className={styles.reservationLink} href="/#reservations">
        Reservations
      </Link>
    </header>
  );
}