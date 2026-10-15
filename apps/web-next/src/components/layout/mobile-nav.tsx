"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import type { NavLink } from "@/components/layout/nav-links"
import { useLogout } from "@/components/layout/use-logout"

const THEMES = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
  { value: "system", label: "Sistema" },
]

export function MobileNav({ links, email }: { links: NavLink[]; email: string | null }) {
  const [open, setOpen] = useState(false)
  const logout = useLogout()
  const close = () => setOpen(false)
  const { theme, setTheme } = useTheme()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className="pill nav__icon nav__menu" aria-label="Abrir menú">
          <Menu />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Menú</SheetTitle>
        </SheetHeader>
        <nav aria-label="Principal" className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <Button key={link.href} variant="ghost" className="justify-start" asChild>
              <Link href={link.href} onClick={close}>
                {link.label}
              </Link>
            </Button>
          ))}
          <Separator className="my-2" />
          {email ? (
            <>
              <p className="px-2.5 text-sm text-muted-foreground">{email}</p>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  close()
                  logout()
                }}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login" onClick={close}>
                  Iniciar sesión
                </Link>
              </Button>
              <Button asChild>
                <Link href="/registro" onClick={close}>
                  Crear cuenta
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/registro?tipo=empresa" onClick={close}>
                  Publicar una vacante
                </Link>
              </Button>
            </>
          )}
          {/* The nav's theme menu is hidden on phones, so the choice lives here. */}
          <Separator className="my-2" />
          <div role="group" aria-label="Tema" className="flex gap-1">
            {THEMES.map(({ value, label }) => (
              <Button
                key={value}
                size="sm"
                variant={theme === value ? "default" : "outline"}
                aria-pressed={theme === value}
                onClick={() => setTheme(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
