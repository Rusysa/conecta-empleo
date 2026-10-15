"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CirclePause,
  CirclePlay,
  CircleX,
  Eye,
  MoreHorizontal,
  Pencil,
  Send,
  Users,
} from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { JobStatusBadge } from "@/components/jobs/job-status-badge"
import { formatDate } from "@/lib/format"
import type { JobStatus } from "@/lib/types"
import type { CompanyJobRow } from "@/server/queries/company"

const STATUS_TOASTS: Record<JobStatus, string> = {
  DRAFT: "Vacante guardada como borrador",
  ACTIVE: "Vacante publicada",
  PAUSED: "Vacante pausada. Ya no aparece en el listado público.",
  CLOSED: "Vacante cerrada",
}

export function CompanyJobsTable({ jobs: initialJobs }: { jobs: CompanyJobRow[] }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [closing, setClosing] = useState<CompanyJobRow | null>(null)

  function setStatus(jobId: string, status: JobStatus) {
    // TODO(backend): setJobStatus(id, status) Server Action (sets publishedAt/closedAt).
    console.info("setJobStatus (mock)", { jobId, status })
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status,
              publishedAt: status === "ACTIVE" && !j.publishedAt ? new Date() : j.publishedAt,
            }
          : j
      )
    )
    toast.success(STATUS_TOASTS[status])
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vacante</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Postulantes</TableHead>
              <TableHead>Publicada</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="max-w-72 font-medium whitespace-normal">
                  <Link
                    href={`/empresa/vacantes/${job.id}/postulantes`}
                    className="hover:underline"
                  >
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <JobStatusBadge status={job.status} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {job.applicantCount}
                  {job.newApplicantCount > 0 && (
                    <span className="ml-1 text-xs text-primary">
                      ({job.newApplicantCount} {job.newApplicantCount === 1 ? "nuevo" : "nuevos"})
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {job.publishedAt ? formatDate(job.publishedAt) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Acciones para ${job.title}`}
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem asChild>
                        <Link href={`/empresa/vacantes/${job.id}/postulantes`}>
                          <Users /> Ver postulantes
                        </Link>
                      </DropdownMenuItem>
                      {job.status !== "CLOSED" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/empresa/vacantes/${job.id}/editar`}>
                            <Pencil /> Editar
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {job.status === "ACTIVE" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/vacantes/${job.id}`} target="_blank">
                            <Eye /> Ver publicación
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {job.status !== "CLOSED" && <DropdownMenuSeparator />}
                      {job.status === "DRAFT" && (
                        <DropdownMenuItem onSelect={() => setStatus(job.id, "ACTIVE")}>
                          <Send /> Publicar
                        </DropdownMenuItem>
                      )}
                      {job.status === "ACTIVE" && (
                        <DropdownMenuItem onSelect={() => setStatus(job.id, "PAUSED")}>
                          <CirclePause /> Pausar
                        </DropdownMenuItem>
                      )}
                      {job.status === "PAUSED" && (
                        <DropdownMenuItem onSelect={() => setStatus(job.id, "ACTIVE")}>
                          <CirclePlay /> Reactivar
                        </DropdownMenuItem>
                      )}
                      {(job.status === "ACTIVE" || job.status === "PAUSED") && (
                        <DropdownMenuItem variant="destructive" onSelect={() => setClosing(job)}>
                          <CircleX /> Cerrar vacante
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={closing !== null} onOpenChange={(open) => !open && setClosing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cerrar “{closing?.title}”?</DialogTitle>
            <DialogDescription>
              La vacante dejará de recibir postulaciones y no podrás reactivarla. Seguirás viendo a
              sus postulantes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (closing) setStatus(closing.id, "CLOSED")
                setClosing(null)
              }}
            >
              Cerrar vacante
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
