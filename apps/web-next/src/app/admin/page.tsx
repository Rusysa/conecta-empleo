import { Suspense } from "react"
import type { Metadata } from "next"

import { AdminCompaniesTable } from "@/components/admin/admin-companies-table"
import { PanelHeader, PanelSkeleton } from "@/components/company/island-ui"
import { requireAdmin } from "@/lib/authz"
import { getAdminCompanies } from "@/server/queries/admin"

export const metadata: Metadata = { title: "Administración · Empresas", robots: { index: false } }

async function CompaniesContent() {
  await requireAdmin("/admin")
  const companies = await getAdminCompanies()
  return <AdminCompaniesTable companies={companies} />
}

export default function AdminCompaniesPage() {
  return (
    <>
      <PanelHeader
        eyebrow="Administración"
        title="Empresas"
        description="Verifica a las empresas reales para mostrar su insignia en las vacantes."
      />
      <Suspense fallback={<PanelSkeleton className="h-64" aria-busy="true" />}>
        <CompaniesContent />
      </Suspense>
    </>
  )
}
