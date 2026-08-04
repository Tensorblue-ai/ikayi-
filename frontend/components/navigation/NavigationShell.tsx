"use client";

import { usePathname } from "next/navigation";
import { StickyNavbar } from "./StickyNavbar";

export function NavigationShell() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <StickyNavbar />;
}