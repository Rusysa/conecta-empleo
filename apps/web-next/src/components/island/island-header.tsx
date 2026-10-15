import { Suspense } from "react"
import Link from "next/link"
import { unstable_rethrow } from "next/navigation"

import { IslandNavPills, NavPillList } from "@/components/island/island-nav-pills"
import { RollText } from "@/components/landing/roll-text"
import { getNavLinks, type NavLink } from "@/components/layout/nav-links"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { getSession } from "@/lib/session"

const GUEST_LINKS: NavLink[] = [
  { href: "/vacantes", label: "Vacantes" },
  { href: "/planes", label: "Planes" },
]

/** Site-wide pill nav (fixed over the page frames), shared by every route. */
export function IslandHeader() {
  return (
    <header className="nav" role="banner">
      <Link href="/" className="logo" aria-label="Bolsa de Trabajo, inicio">
        B
      </Link>
      <div className="nav__right">
        {/* Stable wrapper: landing animations target it, never the streamed links inside. */}
        <div className="nav__session">
          <Suspense fallback={<GuestNav />}>
            <SessionNav />
          </Suspense>
        </div>
        <Link className="pill pill--dark" href="/vacantes">
          <RollText>
            Buscar <span className="cta-txt">empleo</span>
          </RollText>
        </Link>
      </div>
    </header>
  )
}

/** Session-dependent part (reads cookies, so it streams). */
async function SessionNav() {
  // If the API is unreachable, show the guest nav instead of failing every page.
  const session = await getSession().catch((error: unknown) => {
    unstable_rethrow(error)
    return null
  })
  if (!session) return <GuestNav />

  const links = getNavLinks(session)
  return (
    <>
      <PathAwarePills links={links} />
      <ThemeToggle />
      <UserMenu email={session.email} />
      <MobileNav links={links} email={session.email} />
    </>
  )
}

function GuestNav() {
  return (
    <>
      <PathAwarePills links={GUEST_LINKS} />
      <ThemeToggle />
      <Link
        className="pill plus hide-sm"
        href="/registro?tipo=empresa"
        aria-label="Publicar vacante"
        title="Publicar vacante"
      >
        +
      </Link>
      <Link className="pill" href="/login">
        <RollText>Entrar</RollText>
      </Link>
      <MobileNav links={GUEST_LINKS} email={null} />
    </>
  )
}

/** usePathname is request data on dynamic routes, so the static shell shows plain pills. */
function PathAwarePills({ links }: { links: NavLink[] }) {
  return (
    <Suspense fallback={<NavPillList links={links} pathname={null} />}>
      <IslandNavPills links={links} />
    </Suspense>
  )
}
