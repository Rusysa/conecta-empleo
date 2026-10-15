import { Suspense } from "react"
import type { Metadata } from "next"

import { AuthFormSkeleton, AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Iniciar sesión" }

async function LoginFormWithParams({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { callbackUrl } = await searchParams
  return <LoginForm callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthShell
      kicker="Bienvenido de vuelta"
      title="Iniciar sesión"
      description="Accede para aplicar o gestionar tus vacantes."
      panel={{
        tone: "lagoon",
        kicker: "Bolsa de trabajo de la isla",
        line: "Tu próximo empleo ya llegó a la orilla.",
        points: [
          "Aplica con el CV que ya guardaste",
          "Sigue en qué va cada postulación",
          "Empresas: vacantes y postulantes en un lugar",
        ],
        stickers: [
          { name: "case", className: "-top-3 -right-4 w-28 sm:w-36", rotate: 12 },
          { name: "coin", className: "right-6 bottom-6 hidden w-20 sm:block", rotate: -8 },
        ],
      }}
    >
      <Suspense fallback={<AuthFormSkeleton className="h-72" />}>
        <LoginFormWithParams searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  )
}
