"use client"

import { useState } from "react"
import { FileText, Inbox } from "lucide-react"
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
import { APPLICATION_STATUS_LABELS } from "@/lib/constants"
import { formatDate } from "@/lib/format"
import type { Application, ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

type Filter = "ALL" | ApplicationStatus
const FILTERS: Filter[] = ["ALL", "SUBMITTED", "VIEWED", "IN_PROCESS", "REJECTED", "HIRED"]

function openCv(app: Application) {
  // TODO(backend): GET /api/applications/[id]/cv → checks ownership → redirects to a signed URL.
  console.info("open CV (mock)", app.id)
  toast.info("La descarga del CV estará disponible al conectar el almacenamiento.")
}

export function ApplicantsTable({ applicants: initial }: { applicants: Application[] }) {
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
    FILTERS.map((f) => [f, f === "ALL" ? applicants.length : applicants.filter((a) => a.status === f).length])
  ) as Record<Filter, number>
  const visible = filter === "ALL" ? applicants : applicants.filter((a) => a.status === filter)

  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
        <Inbox className="size-8 text-muted-foreground" aria-hidden />
        <p className="font-medium">Esta vacante aún no tiene postulantes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === "ALL" ? "Todas" : APPLICATION_STATUS_LABELS[f]}
            <span className={cn("tabular-nums", filter === f ? "opacity-80" : "text-muted-foreground")}>
              {counts[f]}
            </span>
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No hay postulantes con este estado.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    <button
                      type="button"
                      className="rounded-sm text-left outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                      onClick={() => openDetail(app)}
                    >
                      {app.fullName}
                    </button>
                    {app.status === "SUBMITTED" && (
                      <span className="ml-2 text-xs font-normal text-primary">Nuevo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${app.email}`} className="hover:underline">
                      {app.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${app.phone.replace(/\s/g, "")}`} className="hover:underline">
                      {app.phone}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(app.createdAt)}</TableCell>
                  <TableCell>
                    <StatusSelect
                      value={app.status}
                      onChange={(s) => setStatus(app.id, s)}
                      label={`Estado de ${app.fullName}`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openDetail(app)}>
                        Detalle
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openCv(app)}>
                        <FileText /> Ver CV
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
                <a href={`mailto:${detail.email}`} className="hover:underline">{detail.email}</a>
              </dd>
              <dt className="text-muted-foreground">Teléfono</dt>
              <dd>
                <a href={`tel:${detail.phone.replace(/\s/g, "")}`} className="hover:underline">{detail.phone}</a>
              </dd>
              <dt className="text-muted-foreground">Estado</dt>
              <dd>
                <StatusBadge status={detail.status} />
              </dd>
            </dl>
            <div className="space-y-1">
              <p className="text-sm font-medium">Mensaje</p>
              <p className="rounded-lg bg-muted p-3 text-sm whitespace-pre-line text-muted-foreground">
                {detail.message ?? "El candidato no dejó mensaje."}
              </p>
            </div>
            <DialogFooter className="items-center sm:justify-between">
              <StatusSelect
                value={detail.status}
                onChange={(s) => setStatus(detail.id, s)}
                label={`Estado de ${detail.fullName}`}
              />
              <Button onClick={() => openCv(detail)}>
                <FileText /> Ver CV
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
