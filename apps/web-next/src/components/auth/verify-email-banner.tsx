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
      className="flex flex-wrap items-center gap-3 rounded-[20px] border border-black bg-sand p-4 text-sm font-semibold text-black"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black text-white">
        <MailWarning className="size-4.5" aria-hidden />
      </span>
      <p className="min-w-0 flex-1">
        Verifica tu correo <span className="font-bold break-all">{session.email}</span> con el
        enlace que te enviamos.
      </p>
      <ResendVerificationButton />
    </div>
  )
}
