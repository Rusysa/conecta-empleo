import { Suspense } from "react"
import type { Metadata } from "next"

import { AdminCompaniesTable } from "@/components/admin/admin-companies-table"
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
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
        <p className="text-muted-foreground">
          Verifica a las empresas reales para mostrar su insignia en las vacantes.
        </p>
      </div>
      <Suspense
        fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" aria-busy="true" />}
      >
        <CompaniesContent />
      </Suspense>
    </>
  )
}
