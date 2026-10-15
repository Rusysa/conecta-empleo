"use client"

import { useState } from "react"
import { Bell, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ALERT_FREQUENCY_LABELS, describeAlert } from "@/lib/job-alerts"
import type { AlertFrequency, WorkMode } from "@/lib/types"

/** Saves the current /vacantes search as an email alert (CLAUDE.md fase 3). */
export function CreateAlertDialog({
  q,
  city,
  workMode,
}: {
  q?: string
  city?: string
  workMode?: WorkMode
}) {
  const [open, setOpen] = useState(false)
  const [frequency, setFrequency] = useState<AlertFrequency>("DAILY")
  const [saving, setSaving] = useState(false)
  const summary = describeAlert({ q: q ?? null, city: city ?? null, workMode: workMode ?? null })

  async function save() {
    setSaving(true)
    // TODO(backend): createJobAlert({ q, city, workMode, frequency }) Server Action.
    await new Promise((r) => setTimeout(r, 600))
    console.info("createJobAlert (mock)", { q, city, workMode, frequency })
    setSaving(false)
    setOpen(false)
    toast.success("Alerta creada", {
      description: `Te avisaremos ${frequency === "DAILY" ? "cada día" : "cada semana"}.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell /> Crear alerta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear alerta de vacantes</DialogTitle>
          <DialogDescription>
            Te enviaremos por correo las nuevas vacantes que coincidan con:{" "}
            <span className="font-medium text-foreground">{summary}</span>
          </DialogDescription>
        </DialogHeader>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">¿Cada cuánto?</legend>
          <RadioGroup
            value={frequency}
            onValueChange={(v) => setFrequency(v as AlertFrequency)}
            className="flex gap-6"
          >
            {Object.entries(ALERT_FREQUENCY_LABELS).map(([value, label]) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={`freq-${value}`} />
                <Label htmlFor={`freq-${value}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="animate-spin" />}
            Crear alerta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
