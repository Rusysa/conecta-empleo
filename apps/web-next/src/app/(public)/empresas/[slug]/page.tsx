import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BadgeCheck, Globe, MapPin } from "lucide-react"

import { CompanyLogo } from "@/components/jobs/company-logo"
import { JobCard } from "@/components/jobs/job-card"
import { getCompanyWithActiveJobs } from "@/server/queries/jobs"

export async function generateMetadata({
  params,
}: PageProps<"/empresas/[slug]">): Promise<Metadata> {
  const data = await getCompanyWithActiveJobs((await params).slug)
  return { title: data?.company.name ?? "Empresa no encontrada" }
}

export default async function CompanyPage({ params }: PageProps<"/empresas/[slug]">) {
  const data = await getCompanyWithActiveJobs((await params).slug)
  if (!data) notFound()
  const { company, jobs } = data

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <CompanyLogo company={company} className="size-16" />
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            {company.name}
            {company.verified && (
              <BadgeCheck className="size-5 text-primary" aria-label="Empresa verificada" />
            )}
          </h1>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {company.location && (
              <li className="flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden /> {company.location}
              </li>
            )}
            {company.website && (
              <li>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Globe className="size-4" aria-hidden /> Sitio web
                </a>
              </li>
            )}
          </ul>
        </div>
      </header>

      {company.description && <p className="max-w-3xl text-muted-foreground">{company.description}</p>}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Vacantes abiertas ({jobs.length})</h2>
        {jobs.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Esta empresa no tiene vacantes abiertas por ahora.</p>
        )}
      </section>
    </div>
  )
}
