import { Badge } from "@/components/ui/badge"
import { JOB_STATUS_LABELS } from "@/lib/constants"
import type { JobStatus } from "@/lib/types"

const VARIANTS = {
  DRAFT: "outline",
  ACTIVE: "default",
  PAUSED: "secondary",
  // Outline, not muted text on gray: that combination fails WCAG AA contrast.
  CLOSED: "outline",
} as const

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return <Badge variant={VARIANTS[status]}>{JOB_STATUS_LABELS[status]}</Badge>
}
