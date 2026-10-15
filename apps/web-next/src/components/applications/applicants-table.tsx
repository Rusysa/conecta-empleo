"use client"

import { useState } from "react"
import { Download, FileText, Inbox } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/applications/status-badge"
import { StatusSelect } from "@/components/applications/status-select"
import {
  fillChip,
  FilterPills,
  IslandEmpty,
  IslandPanel,
  TABLE_BODY,
  TABLE_HEAD,
} from "@/components/company/island-ui"
import { APPLICATION_STATUS_LABELS } from "@/lib/constants"
import { downloadCsv, toCsv } from "@/lib/csv"
import { formatDate } from "@/lib/format"
import type { Application, ApplicationStatus } from "@/lib/types"

type Filter = "ALL" | ApplicationStatus
const FILTERS: Filter[] = ["ALL", "SUBMITTED", "VIEWED", "IN_PROCESS", "REJECTED", "HIRED"]

function openCv(app: Application) {
  // TODO(backend): GET /api/applications/[id]/cv → checks ownership → redirects to a signed URL.
  console.info("open CV (mock)", app.id)
  toast.info("La descarga del CV estará disponible al conectar el almacenamiento.")
}

function exportCsv(rows: Application[], fileBaseName: string) {
  const csv = toCsv(
    ["Nombre", "Correo", "Teléfono", "Fecha de postulación", "Estado", "Mensaje"],
    rows.map((a) => [
      a.fullName,
      a.email,
      a.phone,
      a.createdAt.toISOString().slice(0, 10),
      APPLICATION_STATUS_LABELS[a.status],
      a.message,
    ])
  )
  downloadCsv(`${fileBaseName}-${new Date().toISOString().slice(0, 10)}.csv`, csv)
}

export function ApplicantsTable({
  applicants: initial,
  fileBaseName,
}: {
  applicants: Application[]
  /** Used for the exported CSV file name, e.g. "postulantes-qa-tester". */
  fileBaseName: string
}) {
  const [applicants, setApplicants] = useState(initial)
  const [filter, setFilter] = useState<Filter>("ALL")
  const [detailId, setDetailId] = useState<string | null>(null)
  const detail = applicants.find((a) => a.id === detailId) ?? null

  function setStatus(id: string, status: ApplicationStatus, notify = true) {
    // TODO(backend): setApplicationStatus(id, status) Server Action.
    console.info("setApplicationStatus (mock)", { id, status })
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    if (notify) toast.success(`Estado cambiado a “${APPLICATION_STATUS_LABELS[status]}”`)
  }

  function openDetail(app: Application) {
    setDetailId(app.id)
    // Opening a new application marks it as viewed (CLAUDE.md §5.4).
    if (app.status === "SUBMITTED") setStatus(app.id, "VIEWED", false)
  }

  const counts = Object.fromEntries(
    FILTERS.map((f) => [
      f,
      f === "ALL" ? applicants.length : applicants.filter((a) => a.status === f).length,
    ])
  ) as Record<Filter, number>
  const visible = filter === "ALL" ? applicants : applicants.filter((a) => a.status === filter)

  if (applicants.length === 0) {
    return (
      <IslandEmpty
        icon={<Inbox />}
        title="Esta vacante aún no tiene postulantes"
        description="Cuando alguien se postule, verás aquí sus datos de contacto y su CV."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterPills
          label="Filtrar por estado"
          value={filter}
          onChange={setFilter}
          options={FILTERS.map((f) => ({
            value: f,
            label: f === "ALL" ? "Todas" : APPLICATION_STATUS_LABELS[f],
            count: counts[f],
          }))}
        />
        <Button
          className="h-10 px-5"
          disabled={visible.length === 0}
          onClick={() => exportCsv(visible, fileBaseName)}
        >
          <Download /> Exportar CSV
        </Button>
      </div>

      <IslandPanel>
        <Table>
          <TableHeader className={TABLE_HEAD}>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={TABLE_BODY}>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No hay postulantes con este estado.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-sm text-left font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                        onClick={() => openDetail(app)}
                      >
                        {app.fullName}
                      </button>
                      {app.status === "SUBMITTED" && (
                        <span className={fillChip("sunburst")}>Nuevo</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${app.email}`}
                      className="rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {app.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`tel:${app.phone.replace(/\s/g, "")}`}
                      className="rounded-sm tabular-nums underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {app.phone}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(app.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusSelect
                      value={app.status}
                      onChange={(s) => setStatus(app.id, s)}
                      label={`Estado de ${app.fullName}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4"
                        onClick={() => openDetail(app)}
                      >
                        Detalle
                      </Button>
                      <Button size="sm" className="h-9 px-4" onClick={() => openCv(app)}>
                        <FileText /> Ver CV
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </IslandPanel>

      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetailId(null)}>
        {detail && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{detail.fullName}</DialogTitle>
              <DialogDescription>Aplicó el {formatDate(detail.createdAt)}</DialogDescription>
            </DialogHeader>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Correo</dt>
              <dd className="break-all">
                <a href={`mailto:${detail.email}`} className="hover:underline">
                  {detail.email}
                </a>
              </dd>
              <dt className="text-muted-foreground">Teléfono</dt>
              <dd>
                <a href={`tel:${detail.phone.replace(/\s/g, "")}`} className="hover:underline">
                  {detail.phone}
                </a>
              </dd>
              <dt className="text-muted-foreground">Estado</dt>
              <dd>
                <StatusBadge status={detail.status} />
              </dd>
            </dl>
            <div className="space-y-1">
              <p className="text-sm font-medium">Mensaje</p>
              <p className="rounded-2xl border border-border bg-secondary p-4 text-sm whitespace-pre-line text-secondary-foreground">
                {detail.message ?? "El candidato no dejó mensaje."}
              </p>
            </div>
            <DialogFooter className="items-center sm:justify-between">
              <StatusSelect
                value={detail.status}
                onChange={(s) => setStatus(detail.id, s)}
                label={`Estado de ${detail.fullName}`}
              />
              <Button className="h-10 px-5" onClick={() => openCv(detail)}>
                <FileText /> Ver CV
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
