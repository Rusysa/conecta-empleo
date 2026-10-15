import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { BriefcaseBusiness, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CompanyJobsTable } from "@/components/company/company-jobs-table"
import { requireCompany } from "@/lib/authz"
import { getCompanyJobs } from "@/server/queries/company"

export const metadata: Metadata = { title: "Mis vacantes" }

async function JobsContent() {
  const session = await requireCompany("/empresa/vacantes")
  const jobs = await getCompanyJobs(session.companyId)

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <BriefcaseBusiness className="size-8 text-muted-foreground" aria-hidden />
        <p className="font-medium">Aún no has creado vacantes</p>
        <Button asChild>
          <Link href="/empresa/vacantes/nueva">Crear mi primera vacante</Link>
        </Button>
      </div>
    )
  }
  return <CompanyJobsTable jobs={jobs} />
}

export default function CompanyJobsPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Vacantes</h1>
        <Button asChild>
          <Link href="/empresa/vacantes/nueva">
            <Plus /> Nueva vacante
          </Link>
        </Button>
      </div>
      <Suspense
        fallback={<div className="h-80 animate-pulse rounded-xl bg-muted" aria-busy="true" />}
      >
        <JobsContent />
      </Suspense>
    </>
  )
}
