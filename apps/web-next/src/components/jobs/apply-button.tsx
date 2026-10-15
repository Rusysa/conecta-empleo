import Link from "next/link"
import { Info } from "lucide-react"

import { getSession } from "@/lib/session"
import type { JobWithCompany } from "@/lib/types"

// Rendered on the job page's sand "ticket": fixed black ink and pills, never theme
// colors, so every state keeps AA contrast in light and dark themes.
const CTA = "pill pill--dark w-full text-center"
// Long labels may wrap on narrow phones (inline: .pill is unlayered and fixes the height).
const CTA_STYLE = {
  height: "auto",
  minHeight: 52,
  paddingBlock: 12,
  lineHeight: 1.2,
  whiteSpace: "normal",
} as const
const NOTE = "flex gap-2 rounded-2xl border border-black bg-white p-3 text-sm text-black"

/** Authentication is live; job applications still await the jobs API integration. */
export async function ApplyButton({ job }: { job: JobWithCompany }) {
  const session = await getSession()
  const jobPath = `/vacantes/${job.id}`

  if (!session) {
    return (
      <Link
        className={CTA}
        style={CTA_STYLE}
        href={`/login?callbackUrl=${encodeURIComponent(jobPath)}`}
      >
        Inicia sesión para aplicar
      </Link>
    )
  }

  if (session.role !== "CANDIDATE") {
    return (
      <p className={NOTE}>
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        Solo candidatos pueden aplicar a vacantes.
      </p>
    )
  }

  if (!session.user.resumeUrl) {
    return (
      <div className="space-y-2">
        <Link className={CTA} style={CTA_STYLE} href="/candidato/perfil">
          Completa tu perfil para aplicar
        </Link>
        <p className="text-center text-xs text-black">
          Agrega un enlace HTTPS a tu CV o portafolio.
        </p>
      </div>
    )
  }

  return (
    <p className={NOTE} role="status">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      Las postulaciones estarán disponibles próximamente. Estas vacantes son de demostración.
    </p>
  )
}
