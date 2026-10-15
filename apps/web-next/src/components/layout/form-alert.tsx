import { CircleAlert } from "lucide-react"

import { actionErrorMessage, type ActionError } from "@/lib/action-result"

/** Form-level error (as opposed to per-field errors), announced to screen readers. */
export function FormAlert({ error }: { error: ActionError | null }) {
  if (!error) return null
  return (
    <div
      role="alert"
      className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-foreground"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
      {actionErrorMessage(error)}
    </div>
  )
}
