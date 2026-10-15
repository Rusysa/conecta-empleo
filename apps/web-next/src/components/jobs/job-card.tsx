import Link from "next/link"

import { Card } from "@/components/ui/card"
import { CompanyLogo } from "@/components/jobs/company-logo"
import { JobMeta } from "@/components/jobs/job-meta"
import { formatRelativeDate } from "@/lib/format"
import type { JobWithCompany } from "@/lib/types"

export function JobCard({ job }: { job: JobWithCompany }) {
  return (
    <Card className="relative flex-row gap-4 p-4 transition-colors hover:bg-muted/50 has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
      <CompanyLogo company={job.company} />
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="font-semibold leading-tight">
          <Link href={`/vacantes/${job.id}`} className="outline-none after:absolute after:inset-0">
            {job.title}
          </Link>
        </h3>
        <p className="text-sm">{job.company.name}</p>
        <JobMeta {...job} className="pt-1" />
      </div>
      {job.publishedAt && (
        <time
          dateTime={job.publishedAt.toISOString()}
          className="hidden shrink-0 text-xs text-muted-foreground sm:block"
        >
          {formatRelativeDate(job.publishedAt)}
        </time>
      )}
    </Card>
  )
}
