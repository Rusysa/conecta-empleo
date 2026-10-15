import Link from "next/link"
import { CircleCheck, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ApplyDialog } from "@/components/jobs/apply-dialog"
import { candidates } from "@/lib/mock-data"
import { getMockSession, hasCandidateApplied } from "@/lib/mock-session"
import type { JobWithCompany } from "@/lib/types"

/** Resolves every branch of the "Aplicar" flow (CLAUDE.md §5.2). */
export async function ApplyButton({ job }: { job: JobWithCompany }) {
  const session = await getMockSession()
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

  if (session.role === "COMPANY") {
    return (
      <p className="flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        Solo candidatos pueden aplicar a vacantes.
      </p>
    )
  }

  if (!session.profileComplete) {
    return (
      <div className="space-y-2">
        <Button size="lg" className="w-full" asChild>
          <Link href={`/candidato/perfil?next=${encodeURIComponent(jobPath)}`}>
            Completa tu perfil para aplicar
          </Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Necesitas nombre, teléfono y CV.
        </p>
      </div>
    )
  }

  if (await hasCandidateApplied(session.candidateId, job.id)) {
    return (
      <div className="space-y-2">
        <Button size="lg" className="w-full" disabled>
          <CircleCheck /> Ya aplicaste
        </Button>
        <Button variant="link" className="w-full" asChild>
          <Link href="/candidato/postulaciones">Ver mis postulaciones</Link>
        </Button>
      </div>
    )
  }

  // TODO(backend): load the candidate from the session instead of mock data.
  const candidate = candidates.find((c) => c.id === session.candidateId)!

  return (
    <ApplyDialog
      jobTitle={job.title}
      companyName={job.company.name}
      candidate={{
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        cvFileName: candidate.cvFileName ?? "",
      }}
    />
  )
}
