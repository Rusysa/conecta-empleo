import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BadgeCheck } from "lucide-react"

import { ApplyButton } from "@/components/jobs/apply-button"
import { CompanyLogo } from "@/components/jobs/company-logo"
import { JobMeta } from "@/components/jobs/job-meta"
import { MarkdownContent } from "@/components/jobs/markdown-content"
import { Sticker, vars } from "@/components/landing/landing-art"
import { RollText } from "@/components/landing/roll-text"
import { APP_URL } from "@/lib/app-url"
import { formatDate, formatSalary } from "@/lib/format"
import { buildJobPostingJsonLd, serializeJsonLd } from "@/lib/seo/job-posting"
import { getPublicJobById } from "@/server/queries/jobs"

function summarize(text: string, max = 155) {
  const flat = text.replace(/\s+/g, " ").trim()
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat
}

export async function generateMetadata({ params }: PageProps<"/vacantes/[id]">): Promise<Metadata> {
  const job = await getPublicJobById((await params).id)
  if (!job) return { title: "Vacante no encontrada" }

  const title = `${job.title} en ${job.company.name}`
  const description = summarize(job.description)
  return {
    title,
    description,
    alternates: { canonical: `/vacantes/${job.id}` },
    openGraph: { type: "website", title, description, url: `/vacantes/${job.id}` },
  }
}

/** Big island title: wider than the frame's default h1 (inline: landing.css is unlayered). */
const JOB_TITLE_STYLE = { fontSize: "clamp(48px, 8vw, 128px)", lineHeight: 0.88 } as const

export default async function JobDetailPage({ params }: PageProps<"/vacantes/[id]">) {
  const job = await getPublicJobById((await params).id)
  if (!job) notFound()

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency)

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJobPostingJsonLd(job, APP_URL)) }}
      />

      <Link className="pill pill--sm" href="/vacantes">
        <ArrowLeft size={16} aria-hidden />
        <RollText>Volver a vacantes</RollText>
      </Link>

      <header className="mt-8 max-w-6xl">
        <p className="label">
          Vacante
          {job.publishedAt && (
            <>
              {" · "}
              <time dateTime={job.publishedAt.toISOString()}>
                Publicada el {formatDate(job.publishedAt)}
              </time>
            </>
          )}
        </p>
        <h1 className="mt-3 text-balance [overflow-wrap:anywhere]" style={JOB_TITLE_STYLE}>
          {job.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          <Link
            className="pill pill--sm max-w-full"
            style={{ background: "var(--color-lavender)", paddingLeft: 6 }}
            href={`/empresas/${job.company.slug}`}
          >
            <CompanyLogo company={job.company} className="size-8 rounded-full" />
            <span className="truncate">{job.company.name}</span>
            {job.company.verified && (
              <BadgeCheck className="size-4 shrink-0" role="img" aria-label="Empresa verificada" />
            )}
          </Link>
          <JobMeta {...job} />
        </div>
      </header>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        {/* Apply area first in the DOM so phones reach it right after the title. */}
        <aside
          className="space-y-4 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1"
          aria-label="Postulación y empresa"
        >
          <ApplyTicket salary={salary}>
            <ApplyButton job={job} />
          </ApplyTicket>

          <section
            aria-labelledby="empresa-titulo"
            className="rounded-[28px] border border-border bg-card p-6 text-card-foreground"
          >
            <div className="flex items-center gap-3">
              <CompanyLogo company={job.company} className="size-14" />
              <div className="min-w-0">
                <p className="label">Empresa</p>
                <h2 id="empresa-titulo" className="text-xl leading-tight font-bold">
                  {job.company.name}
                </h2>
              </div>
            </div>
            {job.company.description && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {job.company.description}
              </p>
            )}
            <Link className="pill pill--sm mt-5" href={`/empresas/${job.company.slug}`}>
              <RollText>Ver empresa</RollText>
            </Link>
          </section>
        </aside>

        <article className="rounded-[30px] border border-border bg-card p-6 text-card-foreground sm:p-10 lg:col-start-1 lg:row-start-1">
          <section aria-labelledby="descripcion-titulo">
            <h2
              id="descripcion-titulo"
              className="font-display text-3xl leading-none uppercase sm:text-4xl"
            >
              Descripción
            </h2>
            <MarkdownContent className="mt-5">{job.description}</MarkdownContent>
          </section>
          <hr className="my-10 border-t-2 border-dashed border-border" />
          <section aria-labelledby="requisitos-titulo">
            <h2
              id="requisitos-titulo"
              className="font-display text-3xl leading-none uppercase sm:text-4xl"
            >
              Requisitos
            </h2>
            <MarkdownContent className="mt-5">{job.requirements}</MarkdownContent>
          </section>
        </article>
      </div>
    </div>
  )
}

/**
 * The page's one big idea: applying is a sand boarding ticket to the job, salary on the
 * stub, a perforation and the apply action below. Fixed sand + black ink in both themes.
 */
function ApplyTicket({ salary, children }: { salary: string | null; children: React.ReactNode }) {
  return (
    <section
      aria-labelledby="postulate-titulo"
      className="relative rounded-[28px] border border-black bg-sand text-black"
    >
      <span
        className="stk"
        style={vars({ right: "-12px", top: "-26px", width: "64px", "--r": "14deg" })}
      >
        <Sticker name="coin" />
      </span>
      <div className="p-6 pb-5">
        <h2 id="postulate-titulo" className="label">
          Postúlate
        </h2>
        <p className="mt-3 font-display text-[clamp(32px,3.2vw,42px)] leading-none uppercase">
          {salary ?? "Salario a convenir"}
        </p>
        {salary && <p className="mt-1 text-sm font-semibold">al mes</p>}
      </div>
      <TicketPerforation />
      <div className="p-6 pt-5">{children}</div>
    </section>
  )
}

/** Dashed tear line with half-circle notches cut out of both edges (decorative). */
function TicketPerforation() {
  const notch =
    "absolute top-1/2 size-7 -translate-y-1/2 rounded-full border border-black bg-background"
  return (
    <div className="relative h-7" aria-hidden>
      <span className="absolute inset-x-6 top-1/2 border-t-2 border-dashed border-black" />
      <span className={notch} style={{ left: -15, clipPath: "inset(0 0 0 50%)" }} />
      <span className={notch} style={{ right: -15, clipPath: "inset(0 50% 0 0)" }} />
    </div>
  )
}
