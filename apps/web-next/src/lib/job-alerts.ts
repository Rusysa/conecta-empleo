import { WORK_MODE_LABELS } from "@/lib/constants"
import type { AlertFrequency, JobAlert } from "@/lib/types"

export const ALERT_FREQUENCY_LABELS: Record<AlertFrequency, string> = {
  DAILY: "Diario",
  WEEKLY: "Semanal",
}

/** Human-readable summary of a saved search, e.g. “frontend” en Monterrey · Remoto. */
export function describeAlert(alert: Pick<JobAlert, "q" | "city" | "workMode">) {
  const parts = [alert.q ? `“${alert.q}”` : null, alert.city ? `en ${alert.city}` : null].filter(
    Boolean
  )
  const base = parts.length > 0 ? parts.join(" ") : "Todas las vacantes"
  return alert.workMode ? `${base} · ${WORK_MODE_LABELS[alert.workMode]}` : base
}
