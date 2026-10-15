import { Suspense } from "react"
import type { Metadata } from "next"

import { ProfileForm } from "@/components/auth/profile-form"
import { Sticker } from "@/components/landing/landing-art"
import {
  IslandPanel,
  PanelHeader,
  PanelSkeleton,
  SectionTitle,
} from "@/components/company/island-ui"
import { requireCompany } from "@/lib/authz"

export const metadata: Metadata = { title: "Perfil de empresa" }

async function ProfileContent() {
  const session = await requireCompany("/empresa/perfil")
  return <ProfileForm user={session.user} />
}

export default function CompanyProfilePage() {
  return (
    <>
      <PanelHeader
        eyebrow="Área de empresa"
        title="Perfil de empresa"
        description="Los candidatos verán esta información en tus vacantes."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <IslandPanel className="p-5 sm:p-8">
          <section aria-labelledby="datos-publicos" className="space-y-6">
            <SectionTitle id="datos-publicos">Datos públicos</SectionTitle>
            <Suspense fallback={<PanelSkeleton className="h-72" aria-busy="true" />}>
              <ProfileContent />
            </Suspense>
          </section>
        </IslandPanel>

        <aside
          aria-labelledby="perfil-consejo"
          className="relative space-y-3 rounded-[20px] border border-border bg-sand p-6 text-black"
        >
          <span className="absolute -top-5 right-5 block size-12 rotate-12 [&>svg]:size-full">
            <Sticker name="star" />
          </span>
          <p id="perfil-consejo" className="font-display text-2xl leading-none uppercase">
            Un perfil que inspira confianza
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            <li>Cuenta a qué se dedica tu empresa y por qué es un buen lugar para trabajar.</li>
            <li>Usa el nombre con el que te conocen tus clientes.</li>
            <li>Mantén tus datos al día: aparecen en cada vacante que publicas.</li>
          </ul>
        </aside>
      </div>
    </>
  )
}
