import { Check, Eye, Hourglass, Send, X, type LucideIcon } from "lucide-react"

import { fillChip, type IslandFill } from "@/components/company/island-ui"
import { APPLICATION_STATUS_LABELS } from "@/lib/constants"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

/**
 * Island fill and icon per application status, matching the candidate area's
 * ApplicationStatusChip (components/candidate/application-status-chip.tsx).
 * Every fill carries black ink, so the chip is AA-readable in both themes.
 */
export const APPLICATION_STATUS_FILL: Record<ApplicationStatus, IslandFill> = {
  SUBMITTED: "sand",
  VIEWED: "lavender",
  IN_PROCESS: "sunburst",
  REJECTED: "mist",
  HIRED: "mint",
}

const STATUS_ICONS: Record<ApplicationStatus, LucideIcon> = {
  SUBMITTED: Send,
  VIEWED: Eye,
  IN_PROCESS: Hourglass,
  REJECTED: X,
  HIRED: Check,
}

/** Compact outlined status pill (icon + label, not color alone) for tables and lists. */
export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  const Icon = STATUS_ICONS[status]
  return (
    <span className={cn(fillChip(APPLICATION_STATUS_FILL[status]), className)}>
      <Icon strokeWidth={2.5} aria-hidden />
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  )
}
