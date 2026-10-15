import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ApplicantsTable } from "@/components/applications/applicants-table"
import { PanelHeader, PanelSkeleton } from "@/components/company/island-ui"
import { JobStatusChip } from "@/components/company/job-status-chip"
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

  const count = data.applicants.length

  return (
    <>
      <PanelHeader
        eyebrow="Postulantes"
        title={data.job.title}
        compact
        aside={<JobStatusChip status={data.job.status} />}
        description={
          count === 0
            ? "Todavía nadie se ha postulado a esta vacante."
            : `${count} ${count === 1 ? "persona se postuló" : "personas se postularon"} a esta vacante.`
        }
      />
      <ApplicantsTable applicants={data.applicants} fileBaseName={`postulantes-${data.job.slug}`} />
    </>
  )
}

export default function JobApplicantsPage({
  params,
}: PageProps<"/empresa/vacantes/[id]/postulantes">) {
  return (
    <>
      <Button variant="outline" size="sm" className="h-9 self-start px-4" asChild>
        <Link href="/empresa/vacantes">
          <ArrowLeft /> Volver a vacantes
        </Link>
      </Button>
      <Suspense
        fallback={
          <div className="space-y-6" aria-busy="true" aria-label="Cargando postulantes">
            <PanelSkeleton className="h-20 max-w-xl" />
            <PanelSkeleton className="h-80" />
          </div>
        }
      >
        <ApplicantsContent params={params} />
      </Suspense>
    </>
  )
}
