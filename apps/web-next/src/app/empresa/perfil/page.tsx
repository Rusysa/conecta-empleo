import { Suspense } from "react"
import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyProfileForm } from "@/components/company/company-profile-form"
import { requireCompany } from "@/lib/authz"
import { getCompanyProfile } from "@/server/queries/company"

export const metadata: Metadata = { title: "Perfil de empresa" }

async function ProfileContent() {
  const session = await requireCompany("/empresa/perfil")
  const company = await getCompanyProfile(session.companyId)

  return (
    <CompanyProfileForm
      currentSlug={company?.slug ?? null}
      defaultValues={{
        name: company?.name ?? "",
        description: company?.description ?? "",
        location: company?.location ?? "",
        website: company?.website ?? "",
      }}
    />
  )
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
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" aria-busy="true" />}>
            <ProfileContent />
          </Suspense>
        </CardContent>
      </Card>
    </>
  )
}
