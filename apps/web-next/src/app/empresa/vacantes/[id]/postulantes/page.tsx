import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ApplicantsTable } from "@/components/applications/applicants-table"
import { JobStatusBadge } from "@/components/jobs/job-status-badge"
import { requireCompany } from "@/lib/authz"
import { getJobApplicants } from "@/server/queries/company"

export const metadata: Metadata = { title: "Postulantes" }

async function ApplicantsContent({
  params,
}: Pick<PageProps<"/empresa/vacantes/[id]/postulantes">, "params">) {
  const { id } = await params
  const session = await requireCompany(`/empresa/vacantes/${id}/postulantes`)
  // Ownership check: another company's job is a 404 (CLAUDE.md §14.5).
  const data = await getJobApplicants(session.companyId, id)
  if (!data) notFound()

  return (
    <>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{data.job.title}</h1>
          <JobStatusBadge status={data.job.status} />
        </div>
        <p className="text-muted-foreground">Postulantes</p>
      </div>
      <ApplicantsTable applicants={data.applicants} fileBaseName={`postulantes-${data.job.slug}`} />
    </>
  )
}

export default function JobApplicantsPage({
  params,
}: PageProps<"/empresa/vacantes/[id]/postulantes">) {
  return (
    <>
      <Button variant="ghost" size="sm" className="self-start" asChild>
        <Link href="/empresa/vacantes">
          <ArrowLeft /> Volver a vacantes
        </Link>
      </Button>
      <Suspense
        fallback={
          <div className="space-y-4" aria-busy="true" aria-label="Cargando postulantes">
            <div className="h-9 w-72 animate-pulse rounded-lg bg-muted" />
            <div className="h-80 animate-pulse rounded-xl bg-muted" />
          </div>
        }
      >
        <ApplicantsContent params={params} />
      </Suspense>
    </>
  )
}
