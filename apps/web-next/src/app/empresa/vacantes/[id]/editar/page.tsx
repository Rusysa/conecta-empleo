import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JobForm } from "@/components/jobs/job-form"
import { PanelHeader, PanelSkeleton } from "@/components/company/island-ui"
import { JobStatusChip } from "@/components/company/job-status-chip"
import { requireCompany } from "@/lib/authz"
import { getCompanyJob } from "@/server/queries/company"

export const metadata: Metadata = { title: "Editar vacante" }

async function EditJobContent({
  params,
}: Pick<PageProps<"/empresa/vacantes/[id]/editar">, "params">) {
  const { id } = await params
  const session = await requireCompany(`/empresa/vacantes/${id}/editar`)
  // Ownership check: another company's job (or a closed one) is a 404 (CLAUDE.md §14.5).
  const job = await getCompanyJob(session.companyId, id)
  if (!job || job.status === "CLOSED") notFound()

  return (
    <>
      <PanelHeader
        eyebrow="Vacantes"
        title="Editar vacante"
        aside={<JobStatusChip status={job.status} />}
        description={job.title}
      />
      <div className="max-w-3xl">
        <JobForm
          mode="edit"
          jobId={job.id}
          status={job.status}
          defaultValues={{
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            location: job.location ?? "",
            workMode: job.workMode,
            employmentType: job.employmentType,
            salaryMin: job.salaryMin?.toString() ?? "",
            salaryMax: job.salaryMax?.toString() ?? "",
          }}
        />
      </div>
    </>
  )
}

export default function EditJobPage({ params }: PageProps<"/empresa/vacantes/[id]/editar">) {
  return (
    <Suspense fallback={<PanelSkeleton className="h-[40rem] max-w-3xl" aria-busy="true" />}>
      <EditJobContent params={params} />
    </Suspense>
  )
}
