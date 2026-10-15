import { Suspense } from "react"
import Link from "next/link"
import { BriefcaseBusiness } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import { getNavLinks } from "@/components/layout/nav-links"
import { MobileNav } from "@/components/layout/mobile-nav"
import { UserMenu } from "@/components/layout/user-menu"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BriefcaseBusiness className="size-5 text-primary" aria-hidden />
          Bolsa de Trabajo
        </Link>
        <Suspense fallback={<div className="ml-auto h-8 w-40 animate-pulse rounded-lg bg-muted" />}>
          <SessionNav />
        </Suspense>
      </div>
    </header>
  )
}

/** Session-dependent part of the navbar (reads cookies, so it streams). */
async function SessionNav() {
  const session = await getSession()
  const links = getNavLinks(session)

  return (
    <>
      <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
        {links.map((link) => (
          <Button key={link.href} variant="ghost" size="sm" asChild>
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </nav>

      <div className="ml-auto hidden items-center gap-2 md:flex">
        {session ? (
          <UserMenu email={session.email} />
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/registro">Crear cuenta</Link>
            </Button>
          </>
        )}
      </div>

      <MobileNav links={links} email={session?.email ?? null} />
    </>
  )
}
