import { Suspense } from "react"
import type { Metadata } from "next"

import { AuthFormSkeleton, AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Crear cuenta" }

async function RegisterFormWithParams({
  searchParams,
}: Pick<PageProps<"/registro">, "searchParams">) {
  const { tipo } = await searchParams
  return <RegisterForm defaultRole={tipo === "empresa" ? "COMPANY" : "CANDIDATE"} />
}

export default function RegisterPage({ searchParams }: PageProps<"/registro">) {
  return (
    <AuthShell
      kicker="Nueva cuenta"
      title="Crear cuenta"
      description="Es gratis y toma menos de un minuto."
      panel={{
        tone: "sand",
        kicker: "Llega a la isla",
        line: "Haz tu lugar en la isla en menos de un minuto.",
        points: [
          "Guarda tu CV una vez y aplica cuando quieras",
          "Sigue el estado de cada postulación",
          "Empresas: publica vacantes y revisa postulantes",
        ],
        stickers: [
          { name: "rocket", className: "-top-2 right-4 w-20 sm:w-24", rotate: 14 },
          { name: "star", className: "right-8 bottom-8 hidden w-16 sm:block", rotate: -10 },
        ],
      }}
    >
      <Suspense fallback={<AuthFormSkeleton className="h-[34rem]" />}>
        <RegisterFormWithParams searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  )
}
