import Form from "next/form"
import Link from "next/link"
import { MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WORK_MODE_LABELS } from "@/lib/constants"
import { WORK_MODE_SLUGS } from "@/lib/job-search-params"

type Props = { q?: string; city?: string; modalidad?: string }

/** GET form: works without JS and next/form makes it a client-side navigation. */
export function JobFilters({ q, city, modalidad }: Props) {
  const hasFilters = Boolean(q || city || modalidad)

  return (
    <Form
      action="/vacantes"
      className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
    >
      <div className="grid gap-1.5">
        <Label htmlFor="q">Puesto o palabra clave</Label>
        <div className="relative">
          <Search
            className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Ej. Frontend, barista…"
            className="pl-8"
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="ciudad">Ciudad</Label>
        <div className="relative">
          <MapPin
            className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="ciudad"
            name="ciudad"
            defaultValue={city}
            placeholder="Ej. Monterrey"
            className="pl-8"
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="modalidad">Modalidad</Label>
        <select
          id="modalidad"
          name="modalidad"
          defaultValue={modalidad ?? ""}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="">Todas</option>
          {Object.entries(WORK_MODE_SLUGS).map(([slug, mode]) => (
            <option key={slug} value={slug}>
              {WORK_MODE_LABELS[mode]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Buscar</Button>
        {hasFilters && (
          <Button variant="ghost" asChild>
            <Link href="/vacantes">Limpiar</Link>
          </Button>
        )}
      </div>
    </Form>
  )
}
