// Read-side for the admin area (CLAUDE.md fase 3: verify companies, moderate jobs).
// Callers must have passed requireAdmin(). Mock-backed; keep signatures for Prisma.
import { connection } from "next/server"

import { applications, companies, jobs } from "@/lib/mock-data"
import type { Company, Job } from "@/lib/types"

export type AdminCompanyRow = Company & { activeJobs: number; totalJobs: number }
export type AdminJobRow = Job & {
  company: Pick<Company, "name" | "slug">
  applicantCount: number
}

export async function getAdminCompanies(): Promise<AdminCompanyRow[]> {
  await connection()
  return companies
    .map((c) => {
      const own = jobs.filter((j) => j.companyId === c.id)
      return {
        ...c,
        activeJobs: own.filter((j) => j.status === "ACTIVE").length,
        totalJobs: own.length,
      }
    })
    .sort((a, b) => Number(a.verified) - Number(b.verified) || a.name.localeCompare(b.name))
}

export async function getAdminJobs(): Promise<AdminJobRow[]> {
  await connection()
  return jobs
    .map((j) => {
      const company = companies.find((c) => c.id === j.companyId)!
      return {
        ...j,
        company: { name: company.name, slug: company.slug },
        applicantCount: applications.filter((a) => a.jobId === j.id).length,
      }
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
