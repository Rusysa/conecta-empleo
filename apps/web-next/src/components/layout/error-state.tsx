"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RotateCw, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ErrorState({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // TODO: report to an error tracking service.
    console.error(error)
  }, [error])

  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <TriangleAlert className="size-10 text-destructive" aria-hidden />
      <h1 className="text-xl font-semibold">Algo salió mal</h1>
      <p className="text-muted-foreground">
        No pudimos cargar esta página. Intenta de nuevo en unos momentos.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground">Código: {error.digest}</p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => retry()}>
          <RotateCw /> Reintentar
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
