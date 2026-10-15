import { Check, Eye, Hourglass, Send, X, type LucideIcon } from "lucide-react"

import { APPLICATION_STATUS_LABELS } from "@/lib/constants"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

// Island palette fills with black ink: the chip carries its own colors, so it stays
// AA-readable on the day (sky) and night (lagoon) themes alike.
const STATUS_STYLES: Record<ApplicationStatus, { fill: string; icon: LucideIcon }> = {
  SUBMITTED: { fill: "#ffe7b8", icon: Send }, // sand
  VIEWED: { fill: "#e9ccff", icon: Eye }, // lavender
  IN_PROCESS: { fill: "#ffd731", icon: Hourglass }, // sunburst
  REJECTED: { fill: "#e9e9e9", icon: X }, // soft mist
  HIRED: { fill: "#55db9c", icon: Check }, // mint pop
}

/** Candidate-facing application status as an outlined island pill (icon + label, not color alone). */
export function ApplicationStatusChip({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  const { fill, icon: Icon } = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-black px-4 text-xs leading-none font-bold tracking-[0.032em] whitespace-nowrap text-black uppercase",
        className
      )}
      style={{ backgroundColor: fill }}
    >
      <Icon className="size-3.5" strokeWidth={2.5} aria-hidden />
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  )
}
