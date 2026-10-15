import type { Metadata } from "next"
import Link from "next/link"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/jobs/job-card"
import { JobFilters } from "@/components/jobs/job-filters"
import { JobsPagination } from "@/components/jobs/jobs-pagination"
import { buildJobsHref, parseJobSearchParams } from "@/lib/job-search-params"
import { getActiveJobs } from "@/server/queries/jobs"

export const metadata: Metadata = { title: "Vacantes" }

export default async function JobsPage({ searchParams }: PageProps<"/vacantes">) {
  const params = parseJobSearchParams(await searchParams)
  const { items, total, page, pageCount } = await getActiveJobs(params)

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Vacantes</h1>
      <JobFilters q={params.q} city={params.city} modalidad={params.modalidad} />

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {total === 1 ? "1 vacante encontrada" : `${total} vacantes encontradas`}
      </p>

      {items.length > 0 ? (
        <div className="grid gap-3">
          {items.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden />
          <p className="font-medium">No encontramos vacantes con esos filtros</p>
          <Button variant="outline" asChild>
            <Link href="/vacantes">Ver todas las vacantes</Link>
          </Button>
        </div>
      )}

      <JobsPagination
        page={page}
        pageCount={pageCount}
        hrefForPage={(p) => buildJobsHref({ ...params, page: p })}
      />
    </div>
  )
}
