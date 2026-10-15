"use client"

import { useState } from "react"
import Link from "next/link"
import { BadgeCheck, ShieldOff } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="text-right">Vacantes activas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">
                <Link href={`/empresas/${c.slug}`} className="hover:underline" target="_blank">
                  {c.name}
                </Link>
                {c.website && (
                  <p className="text-xs font-normal text-muted-foreground">{c.website}</p>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{c.location ?? "—"}</TableCell>
              <TableCell className="text-right tabular-nums">
                {c.activeJobs} <span className="text-muted-foreground">de {c.totalJobs}</span>
              </TableCell>
              <TableCell>
                {c.verified ? (
                  <Badge className="gap-1">
                    <BadgeCheck className="size-3" aria-hidden /> Verificada
                  </Badge>
                ) : (
                  <Badge variant="outline">Sin verificar</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {c.verified ? (
                  <Button variant="ghost" size="sm" onClick={() => setVerified(c.id, false)}>
                    <ShieldOff /> Retirar
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setVerified(c.id, true)}>
                    <BadgeCheck /> Verificar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
