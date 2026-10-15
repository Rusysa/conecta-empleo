"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { APPLICATION_STATUS_FILL } from "@/components/applications/status-badge"
import { ISLAND_FILL } from "@/components/company/island-ui"
import { APPLICATION_STATUS_LABELS } from "@/lib/constants"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

// Companies can only move an application to these; SUBMITTED → VIEWED happens automatically.
const SETTABLE: ApplicationStatus[] = ["IN_PROCESS", "REJECTED", "HIRED"]

/** Colored dot matching the status chip; decorative, the label carries the meaning. */
function StatusDot({ status }: { status: ApplicationStatus }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2.5 shrink-0 rounded-full border border-black",
        ISLAND_FILL[APPLICATION_STATUS_FILL[status]]
      )}
    />
  )
}

export function StatusSelect({
  value,
  onChange,
  label,
}: {
  value: ApplicationStatus
  onChange: (status: ApplicationStatus) => void
  label: string
}) {
  const options = SETTABLE.includes(value) ? SETTABLE : [value, ...SETTABLE]

  return (
    <Select value={value} onValueChange={(v) => onChange(v as ApplicationStatus)}>
      <SelectTrigger
        size="sm"
        className="h-9 w-40 rounded-full border-border bg-card px-3.5 text-xs font-bold tracking-[0.04em] uppercase data-[size=sm]:h-9 data-[size=sm]:rounded-full"
        aria-label={label}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((status) => (
          <SelectItem key={status} value={status} disabled={!SETTABLE.includes(status)}>
            <StatusDot status={status} />
            {APPLICATION_STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
