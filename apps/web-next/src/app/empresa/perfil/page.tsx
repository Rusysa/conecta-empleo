import { Suspense } from "react"
import type { Metadata } from "next"

import { ProfileForm } from "@/components/auth/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireCompany } from "@/lib/authz"

export const metadata: Metadata = { title: "Perfil de empresa" }

async function ProfileContent() {
  const session = await requireCompany("/empresa/perfil")
  return <ProfileForm user={session.user} />
}

export default function CompanyProfilePage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Perfil de empresa</h1>
      <Card>
        <CardHeader>
          <CardTitle>Datos públicos</CardTitle>
          <CardDescription>Los candidatos verán esta información en tus vacantes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" aria-busy="true" />}
          >
            <ProfileContent />
          </Suspense>
        </CardContent>
      </Card>
    </>
  )
}
