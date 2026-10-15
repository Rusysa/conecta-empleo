"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export type SectionLink = {
  href: string
  label: string
  /** Match only the exact path (for index routes like /empresa). */
  exact?: boolean
}

type Props = { label: string; links: SectionLink[] }

/** Underlined tab-style navigation for the candidate and company areas. */
export function SectionNav(props: Props) {
  // usePathname() is request data on dynamic routes (Cache Components), so it needs
  // a Suspense boundary; the fallback renders the same tabs without the active state.
  return (
    <Suspense fallback={<NavTabs {...props} pathname={null} />}>
      <ActiveNavTabs {...props} />
    </Suspense>
  )
}

function ActiveNavTabs(props: Props) {
  return <NavTabs {...props} pathname={usePathname()} />
}

function NavTabs({ label, links, pathname }: Props & { pathname: string | null }) {
  return (
    <nav aria-label={label} className="flex gap-1 overflow-x-auto overflow-y-hidden border-b">
      {links.map((link) => {
        const active =
          pathname !== null &&
          (link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`))
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
