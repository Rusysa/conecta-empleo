import { Suspense } from "react"
import Link from "next/link"

import { getMockRole } from "@/lib/mock-session"
import { DevRoleSwitcher } from "@/components/layout/dev-role-switcher"

async function CurrentYear() {
  "use cache"
  return new Date().getFullYear()
}

async function RoleSwitcher() {
  const role = await getMockRole()
  return <DevRoleSwitcher role={role} />
}

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <CurrentYear /> Bolsa de Trabajo
        </p>
        <nav aria-label="Pie de página" className="flex gap-4">
          <Link href="/vacantes" className="hover:text-foreground">
            Vacantes
          </Link>
          <Link href="/planes" className="hover:text-foreground">
            Planes
          </Link>
          <Link href="/privacidad" className="hover:text-foreground">
            Aviso de privacidad
          </Link>
        </nav>
        {process.env.NODE_ENV !== "production" && (
          <Suspense fallback={<div className="h-7 w-72" />}>
            <RoleSwitcher />
          </Suspense>
        )}
      </div>
    </footer>
  )
}
