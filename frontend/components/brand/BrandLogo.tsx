import type { CSSProperties } from "react";
import styles from "./BrandLogo.module.css";

const logoSources = {
  mark: "/api/assets/assets/IKAYI%20LOGO1.png",
  wordmark: "/api/assets/assets/IKAYI%20LOGO2.png",
};

type BrandLogoProps = {
  variant: keyof typeof logoSources;
  className?: string;
  label?: string;
  decorative?: boolean;
};

export function BrandLogo({ variant, className = "", label = "Ikayi", decorative = false }: BrandLogoProps) {
  const style = { "--brand-logo-src": `url("${logoSources[variant]}")` } as CSSProperties;

  return (
    <i
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      className={`${styles.logo} ${className}`.trim()}
      role={decorative ? undefined : "img"}
      style={style}
    />
  );
}
