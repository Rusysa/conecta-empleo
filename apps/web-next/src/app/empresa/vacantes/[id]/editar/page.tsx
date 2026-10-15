import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { JobForm } from "@/components/jobs/job-form"
import { JobStatusBadge } from "@/components/jobs/job-status-badge"
import { requireCompany } from "@/lib/authz"
import { getCompanyJob } from "@/server/queries/company"

export const metadata: Metadata = { title: "Editar vacante" }

async function EditJobContent({ params }: Pick<PageProps<"/empresa/vacantes/[id]/editar">, "params">) {
  const { id } = await params
  const session = await requireCompany(`/empresa/vacantes/${id}/editar`)
  // Ownership check: another company's job (or a closed one) is a 404 (CLAUDE.md §14.5).
  const job = await getCompanyJob(session.companyId, id)
  if (!job || job.status === "CLOSED") notFound()

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Editar vacante</h1>
        <JobStatusBadge status={job.status} />
      </div>
      <Card className="max-w-3xl">
        <CardContent>
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
        </CardContent>
      </Card>
    </>
  )
}

export default function EditJobPage({ params }: PageProps<"/empresa/vacantes/[id]/editar">) {
  return (
    <Suspense fallback={<div className="h-[40rem] max-w-3xl animate-pulse rounded-xl bg-muted" aria-busy="true" />}>
      <EditJobContent params={params} />
    </Suspense>
  )
}
