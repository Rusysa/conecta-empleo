// Front-only mirror of the Prisma schema (CLAUDE.md §4).
// Once Prisma is set up, replace these with the generated types from @prisma/client.

export type Role = "CANDIDATE" | "COMPANY" | "ADMIN"
export type JobStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED"
export type WorkMode = "ONSITE" | "REMOTE" | "HYBRID"
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"
export type ApplicationStatus = "SUBMITTED" | "VIEWED" | "IN_PROCESS" | "REJECTED" | "HIRED"

export type Company = {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  website: string | null
  location: string | null
  verified: boolean
}

export type Job = {
  id: string
  companyId: string
  title: string
  slug: string
  description: string
  requirements: string
  location: string | null
  workMode: WorkMode
  employmentType: EmploymentType
  salaryMin: number | null
  salaryMax: number | null
  currency: string
  status: JobStatus
  publishedAt: Date | null
  closedAt: Date | null
  createdAt: Date
}

export type JobWithCompany = Job & { company: Company }

export type Candidate = {
  id: string
  email: string
  fullName: string
  phone: string
  city: string | null
  headline: string | null
  cvFileName: string | null
  cvUpdatedAt: Date | null
}

export type Application = {
  id: string
  jobId: string
  candidateId: string
  fullName: string
  email: string
  phone: string
  message: string | null
  status: ApplicationStatus
  createdAt: Date
}
