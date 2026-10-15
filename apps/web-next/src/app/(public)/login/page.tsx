import { Suspense } from "react"
import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Iniciar sesión" }

async function LoginFormWithParams({
  searchParams,
}: Pick<PageProps<"/login">, "searchParams">) {
  const { callbackUrl } = await searchParams
  return <LoginForm callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Iniciar sesión</CardTitle>
          <CardDescription>Accede para aplicar o gestionar tus vacantes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-56 animate-pulse rounded-lg bg-muted" />}>
            <LoginFormWithParams searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
