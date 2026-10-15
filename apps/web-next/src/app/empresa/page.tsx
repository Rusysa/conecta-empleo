import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/applications/status-badge"
import { requireCompany } from "@/lib/authz"
import { formatRelativeDate } from "@/lib/format"
import { getCompanyDashboard } from "@/server/queries/company"

export const metadata: Metadata = { title: "Panel de empresa" }

function StatTile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <Card className="gap-1 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold">{value.toLocaleString("es-MX")}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Card>
  )
}

async function Dashboard() {
  const session = await requireCompany("/empresa")
  const data = await getCompanyDashboard(session.companyId)

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile label="Vacantes activas" value={data.activeJobs} hint={`de ${data.totalJobs} en total`} />
        <StatTile label="Postulantes" value={data.totalApplicants} hint="en todas tus vacantes" />
        <StatTile label="Postulaciones sin revisar" value={data.newApplicants} hint="con estado Enviada" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Postulantes recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentApplicants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no recibes postulaciones. Publica una vacante para empezar.
            </p>
          ) : (
            <ul className="divide-y">
              {data.recentApplicants.map((app) => (
                <li key={app.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{app.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      <Link href={`/empresa/vacantes/${app.jobId}/postulantes`} className="hover:underline">
                        {app.jobTitle}
                      </Link>{" "}
                      · {formatRelativeDate(app.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default function CompanyDashboardPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Panel</h1>
        <Button asChild>
          <Link href="/empresa/vacantes/nueva">
            <Plus /> Nueva vacante
          </Link>
        </Button>
      </div>
      <Suspense
        fallback={
          <div className="space-y-6" aria-busy="true" aria-label="Cargando panel">
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
            <div className="h-64 animate-pulse rounded-xl bg-muted" />
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </>
  )
}
