import { Suspense } from "react"
import type { Metadata } from "next"

import { JobForm } from "@/components/jobs/job-form"
import { PanelHeader, PanelSkeleton } from "@/components/company/island-ui"
import { requireCompany } from "@/lib/authz"

export const metadata: Metadata = { title: "Nueva vacante" }

async function NewJobForm() {
  await requireCompany("/empresa/vacantes/nueva")
  return <JobForm mode="create" />
}

export default function NewJobPage() {
  return (
    <>
      <PanelHeader
        eyebrow="Vacantes"
        title="Nueva vacante"
        description="Tres pasos y queda lista. Puedes guardarla como borrador y publicarla después."
      />
      <div className="max-w-3xl">
        <Suspense fallback={<PanelSkeleton className="h-[36rem]" aria-busy="true" />}>
          <NewJobForm />
        </Suspense>
      </div>
    </>
  )
}
