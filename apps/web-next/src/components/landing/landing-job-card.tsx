import Link from "next/link"

import { RollText } from "@/components/landing/roll-text"
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "@/lib/constants"
import { formatSalary } from "@/lib/format"
import { WORK_MODE_SLUGS } from "@/lib/job-search-params"
import type { JobWithCompany } from "@/lib/types"

export type LandingJob = {
  id: string
  title: string
  company: string
  location: string
  /** Filter keys this job matches: work mode slug and, for internships, "practicas". */
  filters: string[]
  tags: string[]
  pay: string | null
  initial: string
  color: string
  badge: "Destacada" | "Nueva" | null
}

const JOB_COLORS = ["#4da2ff", "#e9ccff", "#ffd731", "#55db9c", "#fb4903", "#12b5a5"]
const DARK_BACKGROUNDS = ["#fb4903"]
const NEW_JOB_DAYS = 7

const WORK_MODE_SLUG_BY_MODE = Object.fromEntries(
  Object.entries(WORK_MODE_SLUGS).map(([slug, mode]) => [mode, slug])
)

/** Serializable card data (also passed to the client-side filters on the home page). */
export function toLandingJob(job: JobWithCompany, index: number, now: number): LandingJob {
  const isNew =
    job.publishedAt != null && now - job.publishedAt.getTime() < NEW_JOB_DAYS * 86_400_000
  return {
    id: job.id,
    title: job.title,
    company: job.company.name,
    location:
      job.workMode === "REMOTE" ? "Remoto" : (job.location ?? job.company.location ?? "La isla"),
    filters: [
      WORK_MODE_SLUG_BY_MODE[job.workMode],
      ...(job.employmentType === "INTERNSHIP" ? ["practicas"] : []),
    ],
    tags: [WORK_MODE_LABELS[job.workMode], EMPLOYMENT_TYPE_LABELS[job.employmentType]],
    pay: formatSalary(job.salaryMin, job.salaryMax, job.currency),
    initial: job.company.name.charAt(0).toUpperCase(),
    color: JOB_COLORS[index % JOB_COLORS.length],
    badge: job.featured ? "Destacada" : isNew ? "Nueva" : null,
  }
}

export function LandingJobCard({ job }: { job: LandingJob }) {
  return (
    <article className="job">
      <div className="job__top">
        <span
          className="job__logo"
          style={{
            background: job.color,
            color: DARK_BACKGROUNDS.includes(job.color) ? "#fff" : "#000",
          }}
          aria-hidden
        >
          {job.initial}
        </span>
        {job.badge && <span className="job__new label">{job.badge}</span>}
      </div>
      <div>
        <h3>{job.title}</h3>
        <div className="job__co">
          {job.company} · {job.location}
        </div>
      </div>
      <div className="job__tags">
        {job.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="job__foot">
        <span className="job__pay">
          {job.pay ?? "Salario a convenir"}
          {job.pay && <small> al mes</small>}
        </span>
        <Link
          className="pill pill--dark"
          href={`/vacantes/${job.id}`}
          aria-label={`Ver ${job.title}`}
        >
          <RollText>Postularme</RollText>
        </Link>
      </div>
    </article>
  )
}
