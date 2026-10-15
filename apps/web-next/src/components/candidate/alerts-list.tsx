"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { RollText } from "@/components/landing/roll-text"
import { formatDate } from "@/lib/format"
import { ALERT_FREQUENCY_LABELS, describeAlert } from "@/lib/job-alerts"
import { buildJobsHref, WORK_MODE_SLUGS } from "@/lib/job-search-params"
import type { AlertFrequency, JobAlert, WorkMode } from "@/lib/types"
import { cn } from "@/lib/utils"

const SLUG_BY_MODE = Object.fromEntries(
  Object.entries(WORK_MODE_SLUGS).map(([slug, mode]) => [mode, slug])
) as Record<WorkMode, string>

const FREQUENCIES = Object.entries(ALERT_FREQUENCY_LABELS) as [AlertFrequency, string][]

export function AlertsList({ alerts: initial }: { alerts: JobAlert[] }) {
  const [alerts, setAlerts] = useState(initial)

  function setFrequency(id: string, frequency: AlertFrequency) {
    // TODO(backend): updateJobAlert(id, { frequency }) Server Action.
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, frequency } : a)))
    toast.success(`Frecuencia cambiada a ${ALERT_FREQUENCY_LABELS[frequency].toLowerCase()}`)
  }

  function remove(id: string) {
    // TODO(backend): deleteJobAlert(id) Server Action.
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    toast.success("Alerta eliminada")
  }

  if (alerts.length === 0) {
    return (
      // Sand card keeps black ink in both themes (its fill does not change at night).
      <div className="empty text-black">
        <span className="label">Sin alertas</span>
        <h2 className="text-[clamp(28px,3.4vw,44px)] leading-[1.05] font-bold tracking-[-0.02em]">
          Aún no tienes alertas
        </h2>
        <p>Busca vacantes y usa “Crear alerta” para recibir por correo las nuevas que coincidan.</p>
        <Link className="pill pill--dark" href="/vacantes">
          <RollText>Buscar vacantes</RollText>
        </Link>
      </div>
    )
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {alerts.map((alert) => {
        const summary = describeAlert(alert)
        const href = buildJobsHref({
          q: alert.q ?? undefined,
          city: alert.city ?? undefined,
          modalidad: alert.workMode ? SLUG_BY_MODE[alert.workMode] : undefined,
        })
        return (
          <li
            key={alert.id}
            className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-5 text-card-foreground"
          >
            <div className="flex items-start gap-3">
              {/* Lagoon bell: the one accent on each card. */}
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full border border-black bg-[#12b5a5] text-black"
                aria-hidden
              >
                <Bell className="size-5" strokeWidth={2.25} />
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="text-lg leading-tight font-bold tracking-[-0.01em] break-words">
                  <Link
                    href={href}
                    className="rounded-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
                  >
                    {summary}
                  </Link>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Creada el {formatDate(alert.createdAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(alert.id)}
                aria-label={`Eliminar alerta ${summary}`}
              >
                <Trash2 />
              </Button>
            </div>

            <div
              role="group"
              aria-label={`Frecuencia de ${summary}`}
              className="mt-auto flex flex-wrap items-center gap-2"
            >
              <span className="label text-muted-foreground" aria-hidden>
                Correo
              </span>
              {FREQUENCIES.map(([value, label]) => {
                const selected = alert.frequency === value
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => !selected && setFrequency(alert.id, value)}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full border px-4 text-xs leading-none font-bold tracking-[0.032em] uppercase outline-none transition-colors",
                      "focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
