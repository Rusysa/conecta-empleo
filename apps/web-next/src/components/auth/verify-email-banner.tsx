import { MailWarning } from "lucide-react"

import { ResendVerificationButton } from "@/components/auth/resend-verification-button"
import { getSession } from "@/lib/session"

/** Shown in private areas until the account's email is verified (CLAUDE.md fase 2). */
export async function VerifyEmailBanner() {
  const session = await getSession()
  // TODO(backend): the API does not expose email verification yet; treat accounts as verified.
  const emailVerified = true
  if (!session || emailVerified) return null

  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <MailWarning className="size-5 shrink-0" aria-hidden />
      <p className="min-w-0 flex-1">
        Verifica tu correo <span className="font-medium break-all">{session.email}</span> con el
        enlace que te enviamos.
      </p>
      <ResendVerificationButton />
    </div>
  )
}
