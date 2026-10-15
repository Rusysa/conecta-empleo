import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { BriefcaseBusiness, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CompanyJobsTable } from "@/components/company/company-jobs-table"
import { IslandEmpty, PanelHeader, PanelSkeleton } from "@/components/company/island-ui"
import { requireCompany } from "@/lib/authz"
import { getCompanyJobs } from "@/server/queries/company"

export const metadata: Metadata = { title: "Mis vacantes" }

async function JobsContent() {
  const session = await requireCompany("/empresa/vacantes")
  const jobs = await getCompanyJobs(session.companyId)

  if (jobs.length === 0) {
    return (
      <IslandEmpty
        icon={<BriefcaseBusiness />}
        title="Aún no has creado vacantes"
        description="Publica tu primera vacante y empieza a recibir postulantes de toda la isla."
        action={
          <Link className="pill pill--dark" href="/empresa/vacantes/nueva">
            Crear mi primera vacante
          </Link>
        }
      />
    )
  }
  return <CompanyJobsTable jobs={jobs} />
}

export default function CompanyJobsPage() {
  return (
    <>
      <PanelHeader
        eyebrow="Área de empresa"
        title="Vacantes"
        description="Publica, pausa o cierra tus vacantes y revisa quién se postuló a cada una."
        actions={
          <Button className="h-11 px-6" asChild>
            <Link href="/empresa/vacantes/nueva">
              <Plus /> Nueva vacante
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<PanelSkeleton className="h-80" aria-busy="true" />}>
        <JobsContent />
      </Suspense>
    </>
  )
}
