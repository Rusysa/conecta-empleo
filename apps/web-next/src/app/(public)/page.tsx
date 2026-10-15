import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Building2, FileText, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/jobs/job-card"
import { JobFilters } from "@/components/jobs/job-filters"
import { getRecentJobs } from "@/server/queries/jobs"

const STEPS = [
  { icon: Search, title: "Busca", text: "Explora vacantes sin necesidad de registrarte." },
  { icon: FileText, title: "Sube tu CV", text: "Crea tu perfil una sola vez con tus datos y tu CV." },
  { icon: Building2, title: "Aplica", text: "La empresa recibe tus datos de contacto al instante." },
]

async function RecentJobs() {
  const jobs = await getRecentJobs(6)

  if (jobs.length === 0) {
    return <p className="text-muted-foreground">Aún no hay vacantes publicadas.</p>
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

function RecentJobsSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-14 sm:py-20">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Encuentra tu próximo empleo
            </h1>
            <p className="text-lg text-muted-foreground">
              Vacantes de negocios locales. Regístrate, sube tu CV y aplica en un clic.
            </p>
          </div>
          <JobFilters />
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold">Vacantes recientes</h2>
          <Button variant="link" asChild>
            <Link href="/vacantes">
              Ver todas <ArrowRight />
            </Link>
          </Button>
        </div>
        <Suspense fallback={<RecentJobsSkeleton />}>
          <RecentJobs />
        </Suspense>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="space-y-2">
              <Icon className="size-6 text-primary" aria-hidden />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 pb-12 sm:flex-row sm:items-center">
          <p className="font-medium">¿Tienes un negocio y buscas personal?</p>
          <Button variant="outline" asChild>
            <Link href="/registro?tipo=empresa">Publica una vacante</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
