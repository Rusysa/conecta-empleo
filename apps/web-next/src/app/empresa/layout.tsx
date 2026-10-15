import { Suspense } from "react"

import { VerifyEmailBanner } from "@/components/auth/verify-email-banner"
import { SectionNav } from "@/components/layout/section-nav"

// Access: src/proxy.ts redirects by role first; each page re-checks with requireCompany().
export default function CompanyLayout({ children }: LayoutProps<"/empresa">) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <SectionNav
        label="Área de empresa"
        links={[
          { href: "/empresa", label: "Panel", exact: true },
          { href: "/empresa/vacantes", label: "Vacantes" },
          { href: "/empresa/perfil", label: "Perfil de empresa" },
        ]}
      />
      <Suspense fallback={null}>
        <VerifyEmailBanner />
      </Suspense>
      {children}
    </div>
  )
}
