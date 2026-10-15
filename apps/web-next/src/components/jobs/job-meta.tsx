import { Banknote, BriefcaseBusiness, Laptop, MapPin } from "lucide-react"

import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "@/lib/constants"
import { formatSalary } from "@/lib/format"
import type { Job } from "@/lib/types"
import { cn } from "@/lib/utils"

type Props = Pick<
  Job,
  "location" | "workMode" | "employmentType" | "salaryMin" | "salaryMax" | "currency"
> & { className?: string }

// Island tags: outlined pills. Theme card colors, except salary, which is a fixed
// sunburst sticker with black ink (AA in light and dark).
const TAG =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold tracking-[0.032em] text-card-foreground uppercase [&>svg]:size-3.5 [&>svg]:shrink-0"

/** Job facts as island tags: location, work mode, type and salary. */
export function JobMeta({ className, ...job }: Props) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency)

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {job.location && (
        <li className={TAG}>
          <MapPin aria-hidden />
          {job.location}
        </li>
      )}
      <li className={TAG}>
        <Laptop aria-hidden />
        {WORK_MODE_LABELS[job.workMode]}
      </li>
      <li className={TAG}>
        <BriefcaseBusiness aria-hidden />
        {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
      </li>
      {salary && (
        <li className={cn(TAG, "border-black bg-sunburst text-black")}>
          <Banknote aria-hidden />
          {salary} <span className="sr-only">mensuales</span>
        </li>
      )}
    </ul>
  )
}
