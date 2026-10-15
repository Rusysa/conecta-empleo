// Read-side for the candidate area. Mock-backed; keep signatures when moving to Prisma.
import { connection } from "next/server"

import { applications, candidates, companies, jobs } from "@/lib/mock-data"
import type { Application, Candidate, Company, Job } from "@/lib/types"

export type CandidateApplication = Application & {
  job: Pick<Job, "id" | "title" | "status"> & { company: Pick<Company, "name" | "slug"> }
}

export async function getCandidateProfile(
  candidateId: string,
  { profileComplete }: { profileComplete: boolean }
): Promise<Candidate | null> {
  await connection()
  const candidate = candidates.find((c) => c.id === candidateId)
  if (!candidate) return null
  // Mock: an incomplete profile looks like a fresh account (only the email is known).
  if (!profileComplete) {
    return {
      ...candidate,
      fullName: "",
      phone: "",
      city: null,
      headline: null,
      cvFileName: null,
      cvUpdatedAt: null,
    }
  }
  return candidate
}

export async function getCandidateApplications(
  candidateId: string
): Promise<CandidateApplication[]> {
  await connection()
  return applications
    .filter((a) => a.candidateId === candidateId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((a) => {
      const job = jobs.find((j) => j.id === a.jobId)!
      const company = companies.find((c) => c.id === job.companyId)!
      return {
        ...a,
        job: {
          id: job.id,
          title: job.title,
          status: job.status,
          company: { name: company.name, slug: company.slug },
        },
      }
    })
}
