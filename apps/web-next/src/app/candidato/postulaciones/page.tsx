import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { ApplicationStatusChip } from "@/components/candidate/application-status-chip"
import { RollText } from "@/components/landing/roll-text"
import { requireCandidate } from "@/lib/authz"
import { JOB_STATUS_LABELS } from "@/lib/constants"
import { getCandidateApplications } from "@/server/queries/candidate"

export const metadata: Metadata = { title: "Mis postulaciones" }

// Pieces of the ticket-stub date (same locale as formatDate in lib/format).
const dayFormatter = new Intl.DateTimeFormat("es-MX", { day: "numeric" })
const monthFormatter = new Intl.DateTimeFormat("es-MX", { month: "short" })
const yearFormatter = new Intl.DateTimeFormat("es-MX", { year: "numeric" })

const linkFocus =
  "rounded-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"

async function ApplicationsList() {
  const session = await requireCandidate("/candidato/postulaciones")
  const applications = await getCandidateApplications(session.candidateId)

  if (applications.length === 0) {
    return (
      // Sand card keeps black ink in both themes (its fill does not change at night).
      <div className="empty text-black">
        <span className="label">Bitácora vacía</span>
        <h2 className="text-[clamp(28px,3.4vw,44px)] leading-[1.05] font-bold tracking-[-0.02em]">
          Aún no has aplicado a ninguna vacante
        </h2>
        <p>Explora las vacantes de la isla; cada postulación aparecerá aquí con su estado.</p>
        <Link className="pill pill--dark" href="/vacantes">
          <RollText>Explorar vacantes</RollText>
        </Link>
      </div>
    )
  }

  const count = applications.length === 1 ? "1 postulación" : `${applications.length} postulaciones`

  return (
    <div className="space-y-4">
      <p className="label text-muted-foreground">{count}</p>
      <ul className="grid gap-3">
        {applications.map((app) => {
          // Only ACTIVE jobs have a public detail page (CLAUDE.md §14.6).
          const jobIsPublic = app.job.status === "ACTIVE"
          return (
            <li
              key={app.id}
              className="flex overflow-hidden rounded-[20px] border border-border bg-card text-card-foreground"
            >
              {/* Ticket stub: the day you applied, torn off along a dashed line. */}
              <div className="flex w-20 shrink-0 flex-col items-center justify-center border-r border-dashed border-black bg-[#ffe7b8] px-2 py-4 text-center text-black sm:w-24">
                <span className="sr-only">Aplicaste el </span>
                <time dateTime={app.createdAt.toISOString()} className="grid gap-1">
                  <span className="font-display text-4xl leading-none sm:text-5xl">
                    {dayFormatter.format(app.createdAt)}
                  </span>
                  <span className="label leading-none">
                    {monthFormatter.format(app.createdAt).replace(".", "")}{" "}
                    <span className="font-medium">{yearFormatter.format(app.createdAt)}</span>
                  </span>
                </time>
              </div>

              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:p-5">
                <div className="min-w-0 flex-1 basis-56 space-y-1">
                  <h2 className="text-lg leading-tight font-bold tracking-[-0.01em] sm:text-xl">
                    {jobIsPublic ? (
                      <Link
                        href={`/vacantes/${app.job.id}`}
                        className={`group inline-flex items-baseline gap-1 ${linkFocus}`}
                      >
                        {app.job.title}
                        <ArrowUpRight
                          className="size-4 shrink-0 self-center opacity-60 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      </Link>
                    ) : (
                      app.job.title
                    )}
                  </h2>
                  <p className="text-sm">
                    <Link
                      href={`/empresas/${app.job.company.slug}`}
                      className={`font-medium ${linkFocus}`}
                    >
                      {app.job.company.name}
                    </Link>
                  </p>
                  {!jobIsPublic && (
                    <p className="text-xs text-muted-foreground">
                      Vacante {JOB_STATUS_LABELS[app.job.status].toLowerCase()}
                    </p>
                  )}
                </div>
                <ApplicationStatusChip status={app.status} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function CandidateApplicationsPage() {
  return (
    <>
      <div className="space-y-3">
        <h1>Mis postulaciones</h1>
        <p className="max-w-prose text-muted-foreground">
          Sigue cada vacante a la que aplicaste y en qué estado va con la empresa.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="grid gap-3" aria-busy="true" aria-label="Cargando postulaciones">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-[20px] border bg-muted" />
            ))}
          </div>
        }
      >
        <ApplicationsList />
      </Suspense>
    </>
  )
}
