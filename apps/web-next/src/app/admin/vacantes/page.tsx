import { Suspense } from "react"
import type { Metadata } from "next"

import { AdminJobsTable } from "@/components/admin/admin-jobs-table"
import { PanelHeader, PanelSkeleton } from "@/components/company/island-ui"
import { requireAdmin } from "@/lib/authz"
import { getAdminJobs } from "@/server/queries/admin"

export const metadata: Metadata = { title: "Administración · Vacantes", robots: { index: false } }

async function JobsContent() {
  await requireAdmin("/admin/vacantes")
  const jobs = await getAdminJobs()
  return <AdminJobsTable jobs={jobs} />
}

export default function AdminJobsPage() {
  return (
    <>
      <PanelHeader
        eyebrow="Administración"
        title="Moderación de vacantes"
        description="Despublica vacantes que incumplan las reglas del sitio indicando el motivo."
      />
      <Suspense fallback={<PanelSkeleton className="h-80" aria-busy="true" />}>
        <JobsContent />
      </Suspense>
    </>
  )
}
