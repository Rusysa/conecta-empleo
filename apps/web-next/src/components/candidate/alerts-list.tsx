"use client"

import { useState } from "react"
import Link from "next/link"
import { BellOff, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate } from "@/lib/format"
import { ALERT_FREQUENCY_LABELS, describeAlert } from "@/lib/job-alerts"
import { buildJobsHref, WORK_MODE_SLUGS } from "@/lib/job-search-params"
import type { AlertFrequency, JobAlert, WorkMode } from "@/lib/types"

const SLUG_BY_MODE = Object.fromEntries(
  Object.entries(WORK_MODE_SLUGS).map(([slug, mode]) => [mode, slug])
) as Record<WorkMode, string>

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
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <BellOff className="size-8 text-muted-foreground" aria-hidden />
        <p className="font-medium">No tienes alertas</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Busca vacantes y usa “Crear alerta” para recibir por correo las nuevas que coincidan.
        </p>
        <Button asChild>
          <Link href="/vacantes">Buscar vacantes</Link>
        </Button>
      </div>
    )
  }

  return (
    <ul className="grid gap-3">
      {alerts.map((alert) => {
        const summary = describeAlert(alert)
        const href = buildJobsHref({
          q: alert.q ?? undefined,
          city: alert.city ?? undefined,
          modalidad: alert.workMode ? SLUG_BY_MODE[alert.workMode] : undefined,
        })
        return (
          <li key={alert.id}>
            <Card className="flex-row flex-wrap items-center gap-x-4 gap-y-3 p-4">
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="font-semibold">
                  <Link href={href} className="hover:underline">
                    {summary}
                  </Link>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Creada el {formatDate(alert.createdAt)}
                </p>
              </div>
              <Select
                value={alert.frequency}
                onValueChange={(v) => setFrequency(alert.id, v as AlertFrequency)}
              >
                <SelectTrigger size="sm" className="w-32" aria-label={`Frecuencia de ${summary}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ALERT_FREQUENCY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(alert.id)}
                aria-label={`Eliminar alerta ${summary}`}
              >
                <Trash2 />
              </Button>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
