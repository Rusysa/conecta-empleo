// Read-side for jobs. Backed by mock data for now; keep these signatures when
// switching to Prisma so pages don't need to change.
import { connection } from "next/server"

import { JOBS_PAGE_SIZE } from "@/lib/constants"
import { companies, jobs } from "@/lib/mock-data"
import type { Company, JobWithCompany, WorkMode } from "@/lib/types"

function withCompany(job: (typeof jobs)[number]): JobWithCompany {
  const company = companies.find((c) => c.id === job.companyId)!
  return { ...job, company }
}

function byPublishedDesc(a: JobWithCompany, b: JobWithCompany) {
  return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0)
}

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
}

export type JobSearchParams = {
  q?: string
  city?: string
  workMode?: WorkMode
  page?: number
}

export async function getActiveJobs({
  q,
  city,
  workMode,
  page = 1,
}: JobSearchParams) {
  await connection()
  let items = jobs
    .filter((j) => j.status === "ACTIVE")
    .map(withCompany)
    .sort(byPublishedDesc)

  if (q) {
    const term = normalize(q)
    items = items.filter((j) =>
      normalize(`${j.title} ${j.company.name} ${j.description}`).includes(term)
    )
  }
  if (city) {
    const term = normalize(city)
    items = items.filter((j) => j.location && normalize(j.location).includes(term))
  }
  if (workMode) {
    items = items.filter((j) => j.workMode === workMode)
  }

  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / JOBS_PAGE_SIZE))
  const current = Math.min(Math.max(1, page), pageCount)
  const start = (current - 1) * JOBS_PAGE_SIZE

  return {
    items: items.slice(start, start + JOBS_PAGE_SIZE),
    total,
    page: current,
    pageCount,
  }
}

export async function getRecentJobs(limit = 6) {
  await connection()
  return jobs
    .filter((j) => j.status === "ACTIVE")
    .map(withCompany)
    .sort(byPublishedDesc)
    .slice(0, limit)
}

/** Public detail: only ACTIVE jobs are visible (CLAUDE.md §14.6). */
export async function getPublicJobById(id: string) {
  await connection()
  const job = jobs.find((j) => j.id === id && j.status === "ACTIVE")
  return job ? withCompany(job) : null
}

export async function getCompanyWithActiveJobs(
  slug: string
): Promise<{ company: Company; jobs: JobWithCompany[] } | null> {
  await connection()
  const company = companies.find((c) => c.slug === slug)
  if (!company) return null
  const companyJobs = jobs
    .filter((j) => j.companyId === company.id && j.status === "ACTIVE")
    .map(withCompany)
    .sort(byPublishedDesc)
  return { company, jobs: companyJobs }
}
