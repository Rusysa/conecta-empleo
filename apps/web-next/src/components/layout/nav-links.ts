import type { MockSession } from "@/lib/mock-session"

export type NavLink = { href: string; label: string }

export function getNavLinks(session: MockSession): NavLink[] {
  const links: NavLink[] = [{ href: "/vacantes", label: "Vacantes" }]
  if (session?.role === "CANDIDATE") {
    links.push(
      { href: "/candidato/postulaciones", label: "Mis postulaciones" },
      { href: "/candidato/perfil", label: "Mi perfil" }
    )
  }
  if (session?.role === "COMPANY") {
    links.push(
      { href: "/empresa", label: "Panel" },
      { href: "/empresa/vacantes", label: "Mis vacantes" }
    )
  }
  return links
}
