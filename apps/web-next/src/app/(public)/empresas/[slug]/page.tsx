import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BadgeCheck, Globe, MapPin } from "lucide-react"

import { CompanyLogo } from "@/components/jobs/company-logo"
import { LandingJobCard, toLandingJob } from "@/components/landing/landing-job-card"
import { RollText } from "@/components/landing/roll-text"
import type { JobWithCompany } from "@/lib/types"
import { getCompanyWithActiveJobs } from "@/server/queries/jobs"

export async function generateMetadata({
  params,
}: PageProps<"/empresas/[slug]">): Promise<Metadata> {
  const data = await getCompanyWithActiveJobs((await params).slug)
  return { title: data?.company.name ?? "Empresa no encontrada" }
}

/** Card data for the company's jobs ("Nueva" badges depend on the request time). */
function toCards(items: JobWithCompany[]) {
  const now = Date.now()
  return items.map((job, i) => toLandingJob(job, i, now))
}

// Info tags on the theme background: outlined pills in theme card colors.
const TAG =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold tracking-[0.032em] text-card-foreground uppercase [&>svg]:size-3.5"

export default async function CompanyPage({ params }: PageProps<"/empresas/[slug]">) {
  const data = await getCompanyWithActiveJobs((await params).slug)
  if (!data) notFound()
  const { company, jobs } = data
  const cards = toCards(jobs)
  const openings = jobs.length === 1 ? "1 vacante abierta" : `${jobs.length} vacantes abiertas`

  return (
    <div className="wrap">
      {/* The page's one idea: the company logo stuck on like an oversized island sticker. */}
      <header className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10">
        <CompanyLogo
          company={company}
          className="size-28 -rotate-6 rounded-[32px] shadow-[6px_6px_0_0_#000] sm:size-40 dark:shadow-[6px_6px_0_0_var(--border)]"
        />
        <div className="min-w-0">
          <p className="label">Empresa en la isla</p>
          <h1 className="mt-3 text-balance [overflow-wrap:anywhere]">{company.name}</h1>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {company.verified && (
              <li className={`${TAG} border-black bg-mint text-black`}>
                <BadgeCheck aria-hidden /> Verificada
              </li>
            )}
            {company.location && (
              <li className={TAG}>
                <MapPin aria-hidden /> {company.location}
              </li>
            )}
            <li className={TAG}>{openings}</li>
            {company.website && (
              <li>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill pill--sm"
                  style={{ height: 32, padding: "0 12px", fontSize: 12 }}
                >
                  <Globe size={14} aria-hidden /> Sitio web
                  <span className="sr-only"> (se abre en otra pestaña)</span>
                </a>
              </li>
            )}
          </ul>
          {company.description && (
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed">{company.description}</p>
          )}
        </div>
      </header>

      <section
        aria-labelledby="vacantes-titulo"
        className="mt-12 rounded-[30px] border border-border bg-card p-4 text-card-foreground sm:p-8"
      >
        <h2
          id="vacantes-titulo"
          className="mb-6 font-display text-3xl leading-none uppercase sm:text-5xl"
        >
          Vacantes abiertas <span className="sr-only">({jobs.length})</span>
        </h2>
        {cards.length > 0 ? (
          // .job cards are white: pin black ink so they stay legible in dark mode.
          <div className="jobs text-black">
            {cards.map((job) => (
              <LandingJobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>Esta empresa no tiene vacantes abiertas por ahora</h3>
            <p>Mira lo que se está moviendo en el resto de la isla.</p>
            <Link className="pill pill--dark" href="/vacantes">
              <RollText>Ver todas las vacantes</RollText>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
