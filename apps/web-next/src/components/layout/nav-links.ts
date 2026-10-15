import type { Session } from "@/lib/auth-types"

export type NavLink = { href: string; label: string }

export function getNavLinks(session: Session): NavLink[] {
  const links: NavLink[] = [{ href: "/vacantes", label: "Vacantes" }]
  if (session?.role === "CANDIDATE") {
    links.push(
      { href: "/candidato/postulaciones", label: "Mis postulaciones" },
      { href: "/candidato/alertas", label: "Alertas" },
      { href: "/candidato/perfil", label: "Mi perfil" }
    )
  }
  if (session?.role === "COMPANY") {
    links.push(
      { href: "/empresa", label: "Panel" },
      { href: "/empresa/vacantes", label: "Mis vacantes" },
      { href: "/empresa/perfil", label: "Mi empresa" }
    )
  }
  // TODO(backend): add the /admin link once the API has an admin role.
  return links
}
