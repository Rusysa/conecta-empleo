import { SectionNav } from "@/components/layout/section-nav"

// Role guard runs in each page via requireCompany() (it needs the page path for callbackUrl).
// TODO(auth): also protect /empresa/* in proxy.ts (Next 16 replacement for middleware.ts).
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
      {children}
    </div>
  )
}
