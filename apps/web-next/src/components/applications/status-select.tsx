"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { APPLICATION_STATUS_LABELS } from "@/lib/constants"
import type { ApplicationStatus } from "@/lib/types"

// Companies can only move an application to these; SUBMITTED → VIEWED happens automatically.
const SETTABLE: ApplicationStatus[] = ["IN_PROCESS", "REJECTED", "HIRED"]

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
      <SelectTrigger size="sm" className="w-36" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((status) => (
          <SelectItem key={status} value={status} disabled={!SETTABLE.includes(status)}>
            {APPLICATION_STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
