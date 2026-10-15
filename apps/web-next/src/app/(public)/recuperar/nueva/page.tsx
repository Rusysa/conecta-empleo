import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = { title: "Nueva contraseña", robots: { index: false } }

async function ResetContent({ searchParams }: Pick<PageProps<"/recuperar/nueva">, "searchParams">) {
  const { token } = await searchParams
  // TODO(backend): verify the token (exists, not expired, not used) before showing the form.
  if (typeof token !== "string" || token.length < 16) {
    return (
      <div role="alert" className="space-y-4 text-center">
        <p>Este enlace no es válido o ya expiró.</p>
        <Button asChild>
          <Link href="/recuperar">Solicitar un enlace nuevo</Link>
        </Button>
      </div>
    )
  }
  return <ResetPasswordForm token={token} />
}

export default function ResetPasswordPage({ searchParams }: PageProps<"/recuperar/nueva">) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            <h1>Crea una nueva contraseña</h1>
          </CardTitle>
          <CardDescription>Elige una contraseña que no uses en otros sitios.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<div className="h-56 animate-pulse rounded-lg bg-muted" aria-busy="true" />}
          >
            <ResetContent searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
