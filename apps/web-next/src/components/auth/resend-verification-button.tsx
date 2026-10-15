"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function ResendVerificationButton() {
  const [sending, setSending] = useState(false)

  async function resend() {
    setSending(true)
    // TODO(backend): resendVerificationEmail() Server Action (rate-limited).
    await new Promise((r) => setTimeout(r, 700))
    setSending(false)
    toast.success("Te enviamos un nuevo enlace de verificación")
  }

  return (
    // Island pill (black on the sand banner, same in both themes).
    <button
      type="button"
      className="pill pill--sm pill--dark disabled:opacity-60"
      onClick={resend}
      disabled={sending}
      aria-busy={sending}
    >
      {sending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      Reenviar correo
    </button>
  )
}
