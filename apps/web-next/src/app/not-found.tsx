import Link from "next/link"

import { IslandFrame } from "@/components/island/island-frame"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <IslandFrame>
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-5xl font-bold text-primary">404</p>
        <h1 className="text-xl font-semibold">No encontramos esta página</h1>
        <p className="text-muted-foreground">
          Puede que la vacante ya no esté disponible o que el enlace sea incorrecto.
        </p>
        <Button asChild>
          <Link href="/vacantes">Ver vacantes</Link>
        </Button>
      </div>
    </IslandFrame>
  )
}
