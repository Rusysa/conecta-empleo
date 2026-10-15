import { Suspense } from "react"
import type { Metadata } from "next"

import { ProfileEditor } from "@/components/candidate/profile-editor"
import { requireCandidate } from "@/lib/authz"
import { safeRedirectPath } from "@/lib/safe-redirect"
import { getCandidateProfile } from "@/server/queries/candidate"

export const metadata: Metadata = { title: "Mi perfil" }

async function ProfileContent({ searchParams }: Pick<PageProps<"/candidato/perfil">, "searchParams">) {
  const session = await requireCandidate("/candidato/perfil")
  const { next } = await searchParams
  const candidate = await getCandidateProfile(session.candidateId, {
    profileComplete: session.profileComplete,
  })
  if (!candidate) throw new Error("Candidate profile not found")

  return (
    <ProfileEditor
      email={candidate.email}
      profile={{
        fullName: candidate.fullName,
        phone: candidate.phone,
        city: candidate.city ?? "",
        headline: candidate.headline ?? "",
      }}
      cv={
        candidate.cvFileName && candidate.cvUpdatedAt
          ? { fileName: candidate.cvFileName, updatedAt: candidate.cvUpdatedAt }
          : null
      }
      next={safeRedirectPath(next)}
    />
  )
}

export default function CandidateProfilePage({ searchParams }: PageProps<"/candidato/perfil">) {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Mi perfil</h1>
      <Suspense
        fallback={
          <div className="space-y-6" aria-busy="true" aria-label="Cargando perfil">
            <div className="h-72 animate-pulse rounded-xl bg-muted" />
            <div className="h-56 animate-pulse rounded-xl bg-muted" />
          </div>
        }
      >
        <ProfileContent searchParams={searchParams} />
      </Suspense>
    </>
  )
}
