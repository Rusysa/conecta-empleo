"use client"
import { Button } from "@/components/ui/button"

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="mx-auto max-w-xl space-y-4 px-4 py-12"><h1 className="text-2xl font-bold">No pudimos cargar esta página</h1><p>Revisa tu conexión e inténtalo de nuevo.</p><Button onClick={reset}>Reintentar</Button></section>
}
