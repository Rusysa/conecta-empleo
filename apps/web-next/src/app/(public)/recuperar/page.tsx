import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = { title: "Recuperar contraseña" }

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      kicker="Acceso"
      title="Recuperar contraseña"
      description="Te enviaremos un enlace para crear una nueva."
      panel={{
        tone: "lavender",
        kicker: "Sin drama",
        line: "Le pasa hasta al mejor náufrago.",
        points: [
          "Escribe el correo con el que te registraste",
          "Revisa también tu carpeta de spam",
        ],
        stickers: [
          { name: "sparkle", className: "top-6 right-6 w-14" },
          { name: "cv", className: "right-6 bottom-6 hidden w-20 sm:block", rotate: 10 },
        ],
      }}
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
