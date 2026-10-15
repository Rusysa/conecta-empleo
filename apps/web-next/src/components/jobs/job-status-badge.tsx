import { Badge } from "@/components/ui/badge"
import { JOB_STATUS_LABELS } from "@/lib/constants"
import type { JobStatus } from "@/lib/types"

const VARIANTS = {
  DRAFT: "outline",
  ACTIVE: "default",
  PAUSED: "secondary",
  CLOSED: "secondary",
} as const

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge variant={VARIANTS[status]} className={status === "CLOSED" ? "text-muted-foreground" : undefined}>
      {JOB_STATUS_LABELS[status]}
    </Badge>
  )
}
