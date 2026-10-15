// Read-side for the company area. Every query is scoped by companyId so a company
// can never read another company's jobs or applicants (CLAUDE.md §3, §14.5).
// Mock-backed; keep signatures when moving to Prisma.
import { connection } from "next/server"

import { applications, companies, jobs } from "@/lib/mock-data"
import type { Application, Company, Job } from "@/lib/types"

export type CompanyJobRow = Job & { applicantCount: number; newApplicantCount: number }

export async function getCompanyProfile(companyId: string): Promise<Company | null> {
  await connection()
  return companies.find((c) => c.id === companyId) ?? null
}

export async function getCompanyJobs(companyId: string): Promise<CompanyJobRow[]> {
  await connection()
  return jobs
    .filter((j) => j.companyId === companyId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((job) => {
      const jobApps = applications.filter((a) => a.jobId === job.id)
      return {
        ...job,
        applicantCount: jobApps.length,
        newApplicantCount: jobApps.filter((a) => a.status === "SUBMITTED").length,
      }
    })
}

/** Returns the job only if it belongs to the company; null otherwise (render 404). */
export async function getCompanyJob(companyId: string, jobId: string): Promise<Job | null> {
  await connection()
  return jobs.find((j) => j.id === jobId && j.companyId === companyId) ?? null
}

export async function getJobApplicants(
  companyId: string,
  jobId: string
): Promise<{ job: Job; applicants: Application[] } | null> {
  const job = await getCompanyJob(companyId, jobId)
  if (!job) return null
  const applicants = applications
    .filter((a) => a.jobId === job.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  return { job, applicants }
}

export type RecentApplicant = Application & { jobTitle: string }

export async function getCompanyDashboard(companyId: string) {
  const companyJobs = await getCompanyJobs(companyId)
  const jobIds = new Set(companyJobs.map((j) => j.id))
  const companyApps = applications.filter((a) => jobIds.has(a.jobId))

  const recentApplicants: RecentApplicant[] = companyApps
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map((a) => ({ ...a, jobTitle: companyJobs.find((j) => j.id === a.jobId)!.title }))

  return {
    activeJobs: companyJobs.filter((j) => j.status === "ACTIVE").length,
    totalJobs: companyJobs.length,
    totalApplicants: companyApps.length,
    newApplicants: companyApps.filter((a) => a.status === "SUBMITTED").length,
    recentApplicants,
    // Non-closed jobs, most applicants first, for the per-job table.
    jobs: companyJobs
      .filter((j) => j.status !== "CLOSED")
      .sort((a, b) => b.applicantCount - a.applicantCount),
  }
}
