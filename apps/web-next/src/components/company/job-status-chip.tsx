import { fillChip, OUTLINE_CHIP } from "@/components/company/island-ui"
import { JOB_STATUS_LABELS } from "@/lib/constants"
import type { JobStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const STYLES: Record<JobStatus, string> = {
  ACTIVE: fillChip("mint"),
  PAUSED: fillChip("sunburst"),
  DRAFT: fillChip("lavender"),
  // No fill: the theme ink keeps it readable on light and dark surfaces.
  CLOSED: OUTLINE_CHIP,
}

/** Job status as an island chip, for the company and admin tables. */
export function JobStatusChip({ status, className }: { status: JobStatus; className?: string }) {
  return <span className={cn(STYLES[status], className)}>{JOB_STATUS_LABELS[status]}</span>
}
