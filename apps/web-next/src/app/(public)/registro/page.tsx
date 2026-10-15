import { Suspense } from "react"
import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Crear cuenta</CardTitle>
          <CardDescription>Es gratis y toma menos de un minuto.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
            <RegisterFormWithParams searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
