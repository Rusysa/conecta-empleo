"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import type { NavLink } from "@/components/layout/nav-links"
import { useLogout } from "@/components/layout/use-logout"

export function MobileNav({
  links,
  email,
}: {
  links: NavLink[]
  email: string | null
}) {
  const [open, setOpen] = useState(false)
  const logout = useLogout()
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-auto md:hidden" aria-label="Abrir menú">
          <Menu />
        </Button>
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
                <Link href="/login" onClick={close}>Iniciar sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/registro" onClick={close}>Crear cuenta</Link>
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
