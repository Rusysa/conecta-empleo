"use client"

import { useState } from "react"
import Link from "next/link"
import { BadgeCheck, ShieldOff } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  fillChip,
  IslandPanel,
  OUTLINE_CHIP,
  TABLE_BODY,
  TABLE_HEAD,
} from "@/components/company/island-ui"
import type { AdminCompanyRow } from "@/server/queries/admin"

export function AdminCompaniesTable({ companies: initial }: { companies: AdminCompanyRow[] }) {
  const [companies, setCompanies] = useState(initial)

  function setVerified(id: string, verified: boolean) {
    // TODO(backend): setCompanyVerified(id, verified) Server Action (ADMIN only, audit-logged).
    console.info("setCompanyVerified (mock)", { id, verified })
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, verified } : c)))
    toast.success(verified ? "Empresa verificada" : "Verificación retirada")
  }

  return (
    <IslandPanel>
      <Table>
        <TableHeader className={TABLE_HEAD}>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="text-right">Vacantes activas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={TABLE_BODY}>
          {companies.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="min-w-48">
                <Link
                  href={`/empresas/${c.slug}`}
                  className="rounded-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  target="_blank"
                >
                  {c.name}
                </Link>
                {c.website && (
                  <p className="text-xs font-normal text-muted-foreground">{c.website}</p>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{c.location ?? "—"}</TableCell>
              <TableCell className="text-right tabular-nums">
                <span className="text-base font-bold">{c.activeJobs}</span>{" "}
                <span className="text-muted-foreground">de {c.totalJobs}</span>
              </TableCell>
              <TableCell>
                {c.verified ? (
                  <span className={fillChip("mint")}>
                    <BadgeCheck aria-hidden /> Verificada
                  </span>
                ) : (
                  <span className={OUTLINE_CHIP}>Sin verificar</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                {c.verified ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4"
                    onClick={() => setVerified(c.id, false)}
                  >
                    <ShieldOff /> Retirar
                  </Button>
                ) : (
                  <Button size="sm" className="h-9 px-4" onClick={() => setVerified(c.id, true)}>
                    <BadgeCheck /> Verificar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </IslandPanel>
  )
}
