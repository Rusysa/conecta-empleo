import type { Session } from "@/lib/auth-types"

export type NavLink = { href: string; label: string }

export function getNavLinks(session: Session): NavLink[] {
  const links: NavLink[] = [{ href: "/vacantes", label: "Vacantes" }]
  if (session?.role === "CANDIDATE") {
    links.push(
      { href: "/candidato/perfil", label: "Mi perfil" }
    )
  }
  if (session?.role === "COMPANY") {
    links.push(
      { href: "/empresa/perfil", label: "Mi empresa" }
    )
  }
  return links
}
