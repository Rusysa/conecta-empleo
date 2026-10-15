import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/applications/status-badge"
import {
  ISLAND_FILL,
  IslandPanel,
  PanelHeader,
  PanelSkeleton,
  SectionTitle,
  TABLE_BODY,
  TABLE_HEAD,
  type IslandFill,
} from "@/components/company/island-ui"
import { JobStatusChip } from "@/components/company/job-status-chip"
import { requireCompany } from "@/lib/authz"
import { formatRelativeDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { getCompanyDashboard } from "@/server/queries/company"

export const metadata: Metadata = { title: "Panel de empresa" }

type Stat = { label: string; value: number; hint: string; fill: IslandFill }

/** The page's one big idea: the metrics as an island stats band with giant Anton numbers. */
function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid overflow-hidden rounded-[32px] border border-border text-black sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col gap-3 border-b border-border p-6 last:border-b-0 sm:border-r sm:border-b-0 sm:p-8 sm:last:border-r-0",
            ISLAND_FILL[stat.fill]
          )}
        >
          <dt className="text-xs font-bold tracking-[0.08em] uppercase">{stat.label}</dt>
          <dd className="order-first font-display text-[clamp(64px,9vw,128px)] leading-[0.82] tabular-nums">
            {stat.value.toLocaleString("es-MX")}
          </dd>
          <dd className="-mt-2 text-sm">{stat.hint}</dd>
        </div>
      ))}
    </dl>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}

async function Dashboard() {
  const session = await requireCompany("/empresa")
  const data = await getCompanyDashboard(session.companyId)

  return (
    <>
      <StatsBand
        stats={[
          {
            label: "Vacantes activas",
            value: data.activeJobs,
            hint: `de ${data.totalJobs} en total`,
            fill: "sand",
          },
          {
            label: "Postulantes",
            value: data.totalApplicants,
            hint: "en todas tus vacantes",
            fill: "lavender",
          },
          {
            label: "Sin revisar",
            value: data.newApplicants,
            hint: "postulaciones con estado Enviada",
            fill: "lagoon",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <section aria-labelledby="por-vacante" className="space-y-4 lg:col-span-3">
          <SectionTitle id="por-vacante">Postulantes por vacante</SectionTitle>
          {data.jobs.length === 0 ? (
            <IslandPanel className="p-6 text-muted-foreground">
              No tienes vacantes abiertas.
            </IslandPanel>
          ) : (
            <IslandPanel>
              <Table>
                <TableHeader className={TABLE_HEAD}>
                  <TableRow>
                    <TableHead>Vacante</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Postulantes</TableHead>
                    <TableHead className="text-right">Sin revisar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className={TABLE_BODY}>
                  {data.jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="min-w-48 font-semibold whitespace-normal">
                        <Link
                          href={`/empresa/vacantes/${job.id}/postulantes`}
                          className="rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {job.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <JobStatusChip status={job.status} />
                      </TableCell>
                      <TableCell className="text-right text-base font-bold tabular-nums">
                        {job.applicantCount}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {job.newApplicantCount > 0 ? (
                          <span
                            className={cn(
                              "inline-grid h-6 min-w-6 place-items-center rounded-full border border-black px-1.5 text-xs font-bold text-black",
                              ISLAND_FILL.sunburst
                            )}
                          >
                            {job.newApplicantCount}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </IslandPanel>
          )}
        </section>

        <section aria-labelledby="recientes" className="space-y-4 lg:col-span-2">
          <SectionTitle id="recientes">Postulantes recientes</SectionTitle>
          <IslandPanel>
            {data.recentApplicants.length === 0 ? (
              <p className="p-6 text-muted-foreground">
                Aún no recibes postulaciones. Publica una vacante para empezar.
              </p>
            ) : (
              <ul className="divide-y divide-foreground/15">
                {data.recentApplicants.map((app) => (
                  <li key={app.id} className="flex items-center gap-3 px-4 py-3.5">
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full border border-black font-display text-sm text-black",
                        ISLAND_FILL.lavender
                      )}
                    >
                      {initials(app.fullName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{app.fullName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        <Link
                          href={`/empresa/vacantes/${app.jobId}/postulantes`}
                          className="rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
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
          </IslandPanel>
          <Button variant="outline" className="h-10 px-5" asChild>
            <Link href="/empresa/vacantes">
              Ver todas mis vacantes <ArrowUpRight />
            </Link>
          </Button>
        </section>
      </div>
    </>
  )
}

export default function CompanyDashboardPage() {
  return (
    <>
      <PanelHeader
        eyebrow="Área de empresa"
        title="Panel"
        description="Cómo van tus vacantes y quién se postuló últimamente."
        actions={
          <Button className="h-11 px-6" asChild>
            <Link href="/empresa/vacantes/nueva">
              <Plus /> Nueva vacante
            </Link>
          </Button>
        }
      />
      <Suspense
        fallback={
          <div className="space-y-6" aria-busy="true" aria-label="Cargando panel">
            <PanelSkeleton className="h-56 rounded-[32px] sm:h-48" />
            <div className="grid gap-6 lg:grid-cols-5">
              <PanelSkeleton className="h-72 lg:col-span-3" />
              <PanelSkeleton className="h-72 lg:col-span-2" />
            </div>
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </>
  )
}
