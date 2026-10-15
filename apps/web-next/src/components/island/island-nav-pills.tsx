"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavLink } from "@/components/layout/nav-links"
import { RollText } from "@/components/landing/roll-text"

/** On the home page the pills jump to its sections; elsewhere they are the app links. */
const HOME_SECTIONS: NavLink[] = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#categorias", label: "Categorías" },
  { href: "#vacantes", label: "Vacantes" },
  { href: "#empresas", label: "Empresas" },
  { href: "#faq", label: "FAQ" },
]

export function IslandNavPills({ links }: { links: NavLink[] }) {
  const pathname = usePathname()
  return <NavPillList links={links} pathname={pathname} />
}

/** Same pills without the active state, for the static shell (pathname not known yet). */
export function NavPillList({ links, pathname }: { links: NavLink[]; pathname: string | null }) {
  const home = pathname === "/"
  return (
    <nav className="nav__pills" aria-label={home ? "Secciones" : "Principal"}>
      {home
        ? HOME_SECTIONS.map((link) => (
            <a key={link.href} className="pill" href={link.href}>
              <RollText>{link.label}</RollText>
            </a>
          ))
        : links.map((link) => {
            const active =
              pathname !== null &&
              (pathname === link.href ||
                (link.href !== "/empresa" && pathname.startsWith(`${link.href}/`)))
            return (
              <Link
                key={link.href}
                className="pill"
                href={link.href}
                aria-current={active ? "page" : undefined}
              >
                <RollText>{link.label}</RollText>
              </Link>
            )
          })}
    </nav>
  )
}
