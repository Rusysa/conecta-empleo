import { SectionNav } from "@/components/layout/section-nav"

// Access: src/proxy.ts redirects by role first; each page re-checks with requireAdmin().
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <SectionNav
        label="Administración"
        links={[
          { href: "/admin", label: "Empresas", exact: true },
          { href: "/admin/vacantes", label: "Vacantes" },
        ]}
      />
      {children}
    </div>
  )
}
