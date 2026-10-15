import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Form from "next/form"
import { Bell } from "lucide-react"

import { CreateAlertDialog } from "@/components/jobs/create-alert-dialog"
import { Palm, Sea } from "@/components/landing/landing-art"
import { LandingJobCard, toLandingJob } from "@/components/landing/landing-job-card"
import { LandingShell } from "@/components/landing/landing-shell"
import { RollText } from "@/components/landing/roll-text"
import { WORK_MODE_LABELS } from "@/lib/constants"
import { buildJobsHref, parseJobSearchParams, WORK_MODE_SLUGS } from "@/lib/job-search-params"
import { getSession } from "@/lib/session"
import type { JobWithCompany } from "@/lib/types"
import { getActiveJobs } from "@/server/queries/jobs"

export const metadata: Metadata = { title: "Vacantes" }

type Filters = { q?: string; city?: string; modalidad?: string }

export default function JobsPage({ searchParams }: PageProps<"/vacantes">) {
  return (
    <LandingShell id="vacantes-page">
      <Suspense fallback={<JobsFallback />}>
        <JobsContent searchParams={searchParams} />
      </Suspense>
    </LandingShell>
  )
}

/** Card data for the current page ("Nueva" badges depend on the request time). */
function toCards(items: JobWithCompany[]) {
  const now = Date.now()
  return items.map((job, i) => toLandingJob(job, i, now))
}

async function JobsContent({ searchParams }: Pick<PageProps<"/vacantes">, "searchParams">) {
  const params = parseJobSearchParams(await searchParams)
  const [{ items, total, page, pageCount }, session] = await Promise.all([
    getActiveJobs(params),
    getSession(),
  ])
  const cards = toCards(items)
  const filters: Filters = { q: params.q, city: params.city, modalidad: params.modalidad }
  const hasFilters = Boolean(params.q || params.city || params.modalidad)
  const found = total === 1 ? "1 vacante encontrada" : `${total} vacantes encontradas`

  return (
    <>
      <JobsHero filters={filters} />

      <section
        className="frame bg-white section"
        id="resultados"
        aria-labelledby="resultados-title"
      >
        <div className="wrap">
          <div className="results-head">
            <h2 id="resultados-title" aria-live="polite">
              {found}
            </h2>
            <div className="results-head__actions">
              {hasFilters && (
                <Link className="pill pill--sm" href="/vacantes">
                  <RollText>Quitar filtros</RollText>
                </Link>
              )}
              {session?.role === "CANDIDATE" && (
                <CreateAlertDialog
                  q={params.q}
                  city={params.city}
                  workMode={params.workMode}
                  trigger={
                    <button type="button" className="pill pill--sm">
                      <Bell size={16} aria-hidden /> Crear alerta
                    </button>
                  }
                />
              )}
            </div>
          </div>

          {items.length > 0 ? (
            <div className="jobs">
              {cards.map((job) => (
                <LandingJobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>Ninguna vacante coincide con esta búsqueda</h3>
              <p>Prueba con otra palabra, quita la ciudad o elige otra modalidad.</p>
              <Link className="pill pill--dark" href="/vacantes">
                <RollText>Ver todas las vacantes</RollText>
              </Link>
            </div>
          )}

          <Pager
            page={page}
            pageCount={pageCount}
            hrefForPage={(p) => buildJobsHref({ ...filters, page: p })}
          />
        </div>
      </section>
    </>
  )
}

/** Island hero: title, search bar and modality pills. Also the instant loading state. */
function JobsHero({ filters }: { filters: Filters }) {
  const modes: [string | undefined, string][] = [
    [undefined, "Todas"],
    ...Object.entries(WORK_MODE_SLUGS).map(
      ([slug, mode]) => [slug, WORK_MODE_LABELS[mode]] as [string, string]
    ),
  ]

  return (
    <section className="frame bg-sky jobs-hero" id="hero">
      <Palm className="palm palm--left" />
      <Palm className="palm palm--right hide-sm" />
      <div className="wrap hero__inner">
        <h1 className="display jobs-hero__title">Vacantes</h1>
        <p className="jobs-hero__count js-fade">
          Empleo en toda la isla, sin registrarte para mirar.
        </p>

        {/* key: remount the inputs when the URL changes so their defaults stay in sync. */}
        <Form
          key={`${filters.q ?? ""}|${filters.city ?? ""}|${filters.modalidad ?? ""}`}
          action="/vacantes"
          className="search search--wide js-fade"
          role="search"
        >
          <label>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={filters.q}
              placeholder="Puesto, habilidad o empresa"
              aria-label="Puesto, habilidad o empresa"
            />
          </label>
          <label>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <input
              type="text"
              name="ciudad"
              defaultValue={filters.city}
              placeholder="Ciudad"
              aria-label="Ciudad"
            />
          </label>
          {filters.modalidad && <input type="hidden" name="modalidad" value={filters.modalidad} />}
          <button className="pill pill--dark" type="submit">
            <RollText>Buscar vacantes</RollText>
          </button>
        </Form>

        <nav className="modes js-fade" aria-label="Modalidad">
          {modes.map(([slug, label]) => (
            <Link
              key={label}
              className="pill pill--sm"
              href={buildJobsHref({ q: filters.q, city: filters.city, modalidad: slug })}
              aria-current={filters.modalidad === slug ? "true" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <Sea />
    </section>
  )
}

function JobsFallback() {
  return (
    <>
      <JobsHero filters={{}} />
      <section className="frame bg-white section" aria-busy="true" aria-label="Cargando vacantes">
        <div className="wrap">
          <p className="jobs__empty">Cargando vacantes…</p>
        </div>
      </section>
    </>
  )
}

function Pager({
  page,
  pageCount,
  hrefForPage,
}: {
  page: number
  pageCount: number
  hrefForPage: (page: number) => string
}) {
  if (pageCount <= 1) return null
  return (
    <nav className="pager" aria-label="Paginación">
      {page > 1 ? (
        <Link className="pill pill--sm" href={hrefForPage(page - 1)}>
          Anterior
        </Link>
      ) : (
        <span className="pill pill--sm" aria-disabled="true">
          Anterior
        </span>
      )}
      <span className="pager__status">
        Página {page} de {pageCount}
      </span>
      {page < pageCount ? (
        <Link className="pill pill--sm" href={hrefForPage(page + 1)}>
          Siguiente
        </Link>
      ) : (
        <span className="pill pill--sm" aria-disabled="true">
          Siguiente
        </span>
      )}
    </nav>
  )
}
