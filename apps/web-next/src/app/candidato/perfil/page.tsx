import { Suspense } from "react"
import type { Metadata } from "next"
import { IdCard } from "lucide-react"

import { ProfileForm } from "@/components/auth/profile-form"
import { requireCandidate } from "@/lib/authz"

export const metadata: Metadata = { title: "Mi perfil" }

async function ProfileContent() {
  const session = await requireCandidate("/candidato/perfil")
  return <ProfileForm user={session.user} />
}

export default function CandidateProfilePage() {
  return (
    <>
      <div className="space-y-3">
        <h1>Mi perfil</h1>
        <p className="max-w-prose text-muted-foreground">
          Tu ficha en la isla: así te presentas cuando aplicas a una vacante.
        </p>
      </div>
      <section
        aria-labelledby="profile-card-title"
        className="overflow-hidden rounded-[20px] border border-border bg-card text-card-foreground"
      >
        {/* Sand luggage-tag header: the page's single accent. Fixed fill, so black ink. */}
        <div className="flex items-center gap-3 border-b border-dashed border-black bg-[#ffe7b8] px-5 py-4 text-black sm:px-8">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-full border border-black bg-white"
            aria-hidden
          >
            <IdCard className="size-5" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <h2 id="profile-card-title" className="label">
              Ficha de candidato
            </h2>
            <p className="text-sm">Las empresas reciben estos datos cuando aplicas.</p>
          </div>
        </div>
        <div className="p-5 sm:p-8">
          <Suspense
            fallback={
              <div
                className="h-72 animate-pulse rounded-[20px] bg-muted"
                aria-busy="true"
                aria-label="Cargando perfil"
              />
            }
          >
            <ProfileContent />
          </Suspense>
        </div>
      </section>
    </>
  )
}
