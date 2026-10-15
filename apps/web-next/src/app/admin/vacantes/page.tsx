import { Suspense } from "react"
import type { Metadata } from "next"

import { AdminJobsTable } from "@/components/admin/admin-jobs-table"
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
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Moderación de vacantes</h1>
        <p className="text-muted-foreground">
          Despublica vacantes que incumplan las reglas del sitio indicando el motivo.
        </p>
      </div>
      <Suspense
        fallback={<div className="h-80 animate-pulse rounded-xl bg-muted" aria-busy="true" />}
      >
        <JobsContent />
      </Suspense>
    </>
  )
}
