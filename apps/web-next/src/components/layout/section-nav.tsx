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

/** Island pill tabs for the candidate, company and admin areas. */
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
    // Bleeds to the frame edge on mobile so the row scrolls sideways instead of wrapping;
    // the vertical padding keeps the focus ring from being clipped by the scroll container.
    <nav
      aria-label={label}
      className="-mx-4 overflow-x-auto overflow-y-hidden px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-2">
        {links.map((link) => {
          const active =
            pathname !== null &&
            (link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`))
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center rounded-full border px-5 text-[13px] leading-none font-bold tracking-[0.032em] whitespace-nowrap uppercase outline-none transition-colors",
                  "focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
