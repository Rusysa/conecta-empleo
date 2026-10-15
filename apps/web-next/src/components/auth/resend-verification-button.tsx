"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

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
    <Button size="sm" variant="outline" onClick={resend} disabled={sending}>
      {sending && <Loader2 className="animate-spin" />}
      Reenviar correo
    </Button>
  )
}
