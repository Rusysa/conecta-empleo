import { SectionNav } from "@/components/layout/section-nav"

// Role guard runs in each page via requireCandidate() (it needs the page path for callbackUrl).
// TODO(auth): also protect /candidato/* in proxy.ts (Next 16 replacement for middleware.ts).
export default function CandidateLayout({ children }: LayoutProps<"/candidato">) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <SectionNav
        label="Área de candidato"
        links={[
          { href: "/candidato/postulaciones", label: "Mis postulaciones" },
          { href: "/candidato/perfil", label: "Mi perfil" },
        ]}
      />
      {children}
    </div>
  )
}
