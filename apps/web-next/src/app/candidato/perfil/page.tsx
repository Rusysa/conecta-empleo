import { Suspense } from "react"
import type { Metadata } from "next"

import { ProfileForm } from "@/components/auth/profile-form"
import { Card, CardContent } from "@/components/ui/card"
import { requireCandidate } from "@/lib/authz"

export const metadata: Metadata = { title: "Mi perfil" }

async function ProfileContent() {
  const session = await requireCandidate("/candidato/perfil")
  return <ProfileForm user={session.user} />
}

export default function CandidateProfilePage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Mi perfil</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<div className="h-72 animate-pulse rounded-lg bg-muted" aria-busy="true" aria-label="Cargando perfil" />}>
            <ProfileContent />
          </Suspense>
        </CardContent>
      </Card>
    </>
  )
}
