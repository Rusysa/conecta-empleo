import { Banknote, BriefcaseBusiness, Laptop, MapPin } from "lucide-react"

import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "@/lib/constants"
import { formatSalary } from "@/lib/format"
import type { Job } from "@/lib/types"
import { cn } from "@/lib/utils"

type Props = Pick<
  Job,
  "location" | "workMode" | "employmentType" | "salaryMin" | "salaryMax" | "currency"
> & { className?: string }

/** Inline list of job facts: location, work mode, type and salary. */
export function JobMeta({ className, ...job }: Props) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency)

  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground", className)}>
      {job.location && (
        <li className="flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden />
          {job.location}
        </li>
      )}
      <li className="flex items-center gap-1.5">
        <Laptop className="size-4" aria-hidden />
        {WORK_MODE_LABELS[job.workMode]}
      </li>
      <li className="flex items-center gap-1.5">
        <BriefcaseBusiness className="size-4" aria-hidden />
        {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
      </li>
      {salary && (
        <li className="flex items-center gap-1.5">
          <Banknote className="size-4" aria-hidden />
          {salary} <span className="sr-only">mensuales</span>
        </li>
      )}
    </ul>
  )
}
