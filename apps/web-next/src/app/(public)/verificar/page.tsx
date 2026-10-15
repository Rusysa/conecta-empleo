import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { CircleCheck, CircleX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = { title: "Verificar correo", robots: { index: false } }

async function VerifyResult({ searchParams }: Pick<PageProps<"/verificar">, "searchParams">) {
  const { token } = await searchParams
  // TODO(backend): verifyEmail(token) → checks the one-time token and sets User.emailVerified.
  const ok = typeof token === "string" && token.length >= 16

  return ok ? (
    <div role="status" className="flex flex-col items-center gap-3 text-center">
      <CircleCheck className="size-10 text-primary" aria-hidden />
      <h1 className="text-xl font-semibold">¡Correo verificado!</h1>
      <p className="text-muted-foreground">Tu cuenta está lista.</p>
      <Button asChild>
        <Link href="/vacantes">Ver vacantes</Link>
      </Button>
    </div>
  ) : (
    <div role="alert" className="flex flex-col items-center gap-3 text-center">
      <CircleX className="size-10 text-destructive" aria-hidden />
      <h1 className="text-xl font-semibold">Enlace no válido</h1>
      <p className="text-muted-foreground">
        El enlace expiró o ya se usó. Inicia sesión para pedir uno nuevo.
      </p>
      <Button variant="outline" asChild>
        <Link href="/login">Iniciar sesión</Link>
      </Button>
    </div>
  )
}

export default function VerifyEmailPage({ searchParams }: PageProps<"/verificar">) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardContent>
          <Suspense
            fallback={<div className="h-40 animate-pulse rounded-lg bg-muted" aria-busy="true" />}
          >
            <VerifyResult searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
