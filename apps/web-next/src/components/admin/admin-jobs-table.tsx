"use client"

import { useState } from "react"
import Link from "next/link"
import { EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { JobStatusBadge } from "@/components/jobs/job-status-badge"
import { JOB_STATUS_LABELS } from "@/lib/constants"
import { formatDate } from "@/lib/format"
import type { JobStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import type { AdminJobRow } from "@/server/queries/admin"

type Filter = "ALL" | JobStatus
const FILTERS: Filter[] = ["ALL", "ACTIVE", "PAUSED", "DRAFT", "CLOSED"]
const MIN_REASON = 10

export function AdminJobsTable({ jobs: initial }: { jobs: AdminJobRow[] }) {
  const [jobs, setJobs] = useState(initial)
  const [filter, setFilter] = useState<Filter>("ALL")
  const [moderating, setModerating] = useState<AdminJobRow | null>(null)
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)
  const visible = filter === "ALL" ? jobs : jobs.filter((j) => j.status === filter)

  async function unpublish() {
    if (!moderating) return
    setSaving(true)
    // TODO(backend): moderateJob(id, reason) → status PAUSED + audit log + email to the company.
    await new Promise((r) => setTimeout(r, 600))
    console.info("moderateJob (mock)", { id: moderating.id, reason })
    setJobs((prev) => prev.map((j) => (j.id === moderating.id ? { ...j, status: "PAUSED" } : j)))
    setSaving(false)
    setModerating(null)
    setReason("")
    toast.success("Vacante despublicada", { description: "La empresa recibirá el motivo." })
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
            {f === "ALL" ? "Todas" : JOB_STATUS_LABELS[f]}
            <span
              className={cn("tabular-nums", filter === f ? "opacity-80" : "text-muted-foreground")}
            >
              {f === "ALL" ? jobs.length : jobs.filter((j) => j.status === f).length}
            </span>
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vacante</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Postulantes</TableHead>
              <TableHead>Creada</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No hay vacantes con este estado.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="max-w-64 font-medium whitespace-normal">
                    {job.status === "ACTIVE" ? (
                      <Link
                        href={`/vacantes/${job.id}`}
                        target="_blank"
                        className="hover:underline"
                      >
                        {job.title}
                      </Link>
                    ) : (
                      job.title
                    )}
                  </TableCell>
                  <TableCell>{job.company.name}</TableCell>
                  <TableCell>
                    <JobStatusBadge status={job.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{job.applicantCount}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(job.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {job.status === "ACTIVE" && (
                      <Button variant="ghost" size="sm" onClick={() => setModerating(job)}>
                        <EyeOff /> Despublicar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={moderating !== null}
        onOpenChange={(open) => {
          if (!open) {
            setModerating(null)
            setReason("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Despublicar “{moderating?.title}”</DialogTitle>
            <DialogDescription>
              La vacante dejará de aparecer en el sitio y quedará pausada. La empresa recibirá el
              motivo por correo.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="moderation-reason">Motivo</FieldLabel>
            <Textarea
              id="moderation-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. La vacante solicita pagos a los candidatos."
            />
            <FieldDescription>Mínimo {MIN_REASON} caracteres.</FieldDescription>
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={reason.trim().length < MIN_REASON || saving}
              onClick={unpublish}
            >
              {saving && <Loader2 className="animate-spin" />}
              Despublicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
