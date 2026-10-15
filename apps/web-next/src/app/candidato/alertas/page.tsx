import { Suspense } from "react"
import type { Metadata } from "next"

import { AlertsList } from "@/components/candidate/alerts-list"
import { requireCandidate } from "@/lib/authz"
import { getCandidateAlerts } from "@/server/queries/candidate"

export const metadata: Metadata = { title: "Alertas de vacantes" }

async function AlertsContent() {
  const session = await requireCandidate("/candidato/alertas")
  const alerts = await getCandidateAlerts(session.candidateId)
  return <AlertsList alerts={alerts} />
}

export default function CandidateAlertsPage() {
  return (
    <>
      <div className="space-y-3">
        <h1>Alertas de vacantes</h1>
        <p className="max-w-prose text-muted-foreground">
          Recibe por correo las vacantes nuevas de tus búsquedas guardadas.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="grid gap-3 sm:grid-cols-2" aria-busy="true" aria-label="Cargando alertas">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-[20px] border bg-muted" />
            ))}
          </div>
        }
      >
        <AlertsContent />
      </Suspense>
    </>
  )
}
