import { Suspense } from "react"

import { VerifyEmailBanner } from "@/components/auth/verify-email-banner"
import { SectionNav } from "@/components/layout/section-nav"

// Access: src/proxy.ts redirects by role first; each page re-checks with requireCandidate().
export default function CandidateLayout({ children }: LayoutProps<"/candidato">) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <SectionNav
        label="Área de candidato"
        links={[
          { href: "/candidato/postulaciones", label: "Mis postulaciones" },
          { href: "/candidato/alertas", label: "Alertas" },
          { href: "/candidato/perfil", label: "Mi perfil" },
        ]}
      />
      <Suspense fallback={null}>
        <VerifyEmailBanner />
      </Suspense>
      {children}
    </div>
  )
}
