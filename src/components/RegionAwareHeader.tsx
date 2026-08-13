"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  buildRegionHeaderStyle,
  resolveRegionHeroTheme,
} from "@/lib/region-hero-theme";

export function RegionAwareHeader({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const resolvedTheme = resolveRegionHeroTheme(pathname);
  const isHome = pathname === "/";

  return (
    <header
      className={`site-header${isHome ? " site-header-home" : ""}`}
      data-home-hero={isHome ? "neon-standoff-v1" : undefined}
      data-region-color-family={
        resolvedTheme?.image.palettes.desktop.family.id || undefined
      }
      data-region-theme={resolvedTheme?.imageId || undefined}
      style={
        resolvedTheme
          ? buildRegionHeaderStyle(resolvedTheme.image)
          : undefined
      }
    >
      {children}
    </header>
  );
}
