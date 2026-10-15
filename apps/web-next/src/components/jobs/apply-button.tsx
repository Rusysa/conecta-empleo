import Link from "next/link"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import type { JobWithCompany } from "@/lib/types"

/** Authentication is live; job applications still await the jobs API integration. */
export async function ApplyButton({ job }: { job: JobWithCompany }) {
  const session = await getSession()
  const jobPath = `/vacantes/${job.id}`

  if (!session) {
    return (
      <Button size="lg" className="w-full" asChild>
        <Link href={`/login?callbackUrl=${encodeURIComponent(jobPath)}`}>
          Inicia sesión para aplicar
        </Link>
      </Button>
    )
  }

  if (session.role !== "CANDIDATE") {
    return (
      <p className="flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        Solo candidatos pueden aplicar a vacantes.
      </p>
    )
  }

  if (!session.user.resumeUrl) {
    return (
      <div className="space-y-2">
        <Button size="lg" className="w-full" asChild>
          <Link href="/candidato/perfil">Completa tu perfil para aplicar</Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Agrega un enlace HTTPS a tu CV o portafolio.
        </p>
      </div>
    )
  }

  return (
    <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground" role="status">
      Las postulaciones estarán disponibles próximamente. Estas vacantes son de demostración.
    </p>
  )
}
