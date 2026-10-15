import { Suspense } from "react"
import { requireSession } from "@/lib/session"
import { ProfileForm } from "@/components/auth/profile-form"

async function Profile() {
  const session = await requireSession("employer")
  return <ProfileForm user={session.user} />
}

export default function CompanyProfilePage() {
  return <section className="mx-auto max-w-xl space-y-6 px-4 py-12"><h1 className="text-2xl font-bold">Mi empresa</h1><Suspense fallback={<p>Cargando perfil…</p>}><Profile /></Suspense></section>
}
