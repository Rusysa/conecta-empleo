"use client"

import { usePathname } from "next/navigation"

/** Routes that render their own header and footer (the island landing shell). */
const FULL_BLEED_ROUTES = ["/", "/vacantes"]

/** Renders the app navbar/footer everywhere except on full-bleed routes. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return FULL_BLEED_ROUTES.includes(pathname) ? null : children
}
