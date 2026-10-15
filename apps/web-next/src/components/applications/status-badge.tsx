import { Badge } from "@/components/ui/badge"
import { APPLICATION_STATUS_LABELS } from "@/lib/constants"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  SUBMITTED: "bg-secondary text-secondary-foreground",
  VIEWED: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  IN_PROCESS: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  HIRED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
}

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  return (
    <Badge className={cn(STATUS_STYLES[status], className)}>
      {APPLICATION_STATUS_LABELS[status]}
    </Badge>
  )
}
