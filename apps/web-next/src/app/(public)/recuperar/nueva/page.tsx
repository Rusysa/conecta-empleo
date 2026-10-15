import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { CircleX } from "lucide-react"

import { AuthFormSkeleton, AuthShell } from "@/components/auth/auth-shell"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { RollText } from "@/components/landing/roll-text"

export const metadata: Metadata = { title: "Nueva contraseña", robots: { index: false } }

async function ResetContent({ searchParams }: Pick<PageProps<"/recuperar/nueva">, "searchParams">) {
  const { token } = await searchParams
  // TODO(backend): verify the token (exists, not expired, not used) before showing the form.
  if (typeof token !== "string" || token.length < 16) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-4 rounded-2xl border border-destructive bg-destructive/10 p-5"
      >
        <p className="flex items-start gap-3 font-semibold">
          <CircleX className="mt-px size-5 shrink-0 text-destructive" aria-hidden />
          Este enlace no es válido o ya expiró.
        </p>
        <Link href="/recuperar" className="pill pill--sm pill--dark">
          <RollText>Solicitar un enlace nuevo</RollText>
        </Link>
      </div>
    )
  }
  return <ResetPasswordForm token={token} />
}

export default function ResetPasswordPage({ searchParams }: PageProps<"/recuperar/nueva">) {
  return (
    <AuthShell
      kicker="Acceso"
      title="Crea una nueva contraseña"
      description="Elige una contraseña que no uses en otros sitios."
      panel={{
        tone: "sand",
        kicker: "Casi listo",
        line: "Nueva llave para tu cabaña.",
        points: [
          "Mínimo 8 caracteres",
          "Mejor si mezclas letras, números y símbolos",
          "Que no sea la misma de otros sitios",
        ],
        stickers: [{ name: "check", className: "-top-3 -right-3 w-28 sm:w-32", rotate: 10 }],
      }}
    >
      <Suspense fallback={<AuthFormSkeleton className="h-64" />}>
        <ResetContent searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  )
}
