import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Inbox } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/applications/status-badge"
import { requireCandidate } from "@/lib/authz"
import { JOB_STATUS_LABELS } from "@/lib/constants"
import { formatDate } from "@/lib/format"
import { getCandidateApplications } from "@/server/queries/candidate"

export const metadata: Metadata = { title: "Mis postulaciones" }

async function ApplicationsList() {
  const session = await requireCandidate("/candidato/postulaciones")
  const applications = await getCandidateApplications(session.candidateId)

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <Inbox className="size-8 text-muted-foreground" aria-hidden />
        <p className="font-medium">Aún no has aplicado a ninguna vacante</p>
        <Button asChild>
          <Link href="/vacantes">Explorar vacantes</Link>
        </Button>
      </div>
    )
  }

  return (
    <ul className="grid gap-3">
      {applications.map((app) => {
        // Only ACTIVE jobs have a public detail page (CLAUDE.md §14.6).
        const jobIsPublic = app.job.status === "ACTIVE"
        return (
          <li key={app.id}>
            <Card className="flex-row flex-wrap items-center gap-x-4 gap-y-2 p-4">
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="font-semibold leading-tight">
                  {jobIsPublic ? (
                    <Link href={`/vacantes/${app.job.id}`} className="hover:underline">
                      {app.job.title}
                    </Link>
                  ) : (
                    app.job.title
                  )}
                </h2>
                <p className="text-sm">
                  <Link href={`/empresas/${app.job.company.slug}`} className="hover:underline">
                    {app.job.company.name}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  Aplicaste el{" "}
                  <time dateTime={app.createdAt.toISOString()}>{formatDate(app.createdAt)}</time>
                  {!jobIsPublic && ` · Vacante ${JOB_STATUS_LABELS[app.job.status].toLowerCase()}`}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

export default function CandidateApplicationsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Mis postulaciones</h1>
      <Suspense
        fallback={
          <div className="grid gap-3" aria-busy="true" aria-label="Cargando postulaciones">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        }
      >
        <ApplicationsList />
      </Suspense>
    </>
  )
}
