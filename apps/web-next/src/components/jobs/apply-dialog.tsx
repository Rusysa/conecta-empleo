"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FormAlert } from "@/components/layout/form-alert"
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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { applySchema, type ApplyInput } from "@/lib/validations/application"
import { mockActionResult, type ActionError } from "@/lib/action-result"

const TERM = "text-[11px] font-bold tracking-[0.032em] uppercase"

type Props = {
  jobTitle: string
  companyName: string
  candidate: { fullName: string; email: string; phone: string; cvFileName: string }
}

export function ApplyDialog({ jobTitle, companyName, candidate }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [formError, setFormError] = useState<ActionError | null>(null)
  const form = useForm<ApplyInput>({
    resolver: zodResolver(applySchema),
    defaultValues: { message: "" },
  })

  async function onSubmit(values: ApplyInput) {
    // TODO(backend): call the applyToJob(jobId, message) Server Action.
    setFormError(null)
    const result = await mockActionResult()
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    console.info("applyToJob (mock)", values)
    toast.success("¡Postulación enviada!", {
      description: `${companyName} recibió tus datos y tu CV.`,
    })
    setOpen(false)
    router.push("/candidato/postulaciones")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Island pill (fixed black on the sand ticket of the job page). */}
        <button type="button" className="pill pill--dark w-full">
          Aplicar a esta vacante
        </button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Aplicar a {jobTitle}</DialogTitle>
            <DialogDescription>{companyName} recibirá los siguientes datos:</DialogDescription>
          </DialogHeader>

          <FormAlert error={formError} />

          {/* Fixed sand card with black ink: AA in both themes. */}
          <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2.5 rounded-[20px] border border-black bg-sand p-4 text-sm text-black">
            <dt className={TERM}>Nombre</dt>
            <dd className="font-semibold">{candidate.fullName}</dd>
            <dt className={TERM}>Correo</dt>
            <dd className="font-semibold break-all">{candidate.email}</dd>
            <dt className={TERM}>Teléfono</dt>
            <dd className="font-semibold">{candidate.phone}</dd>
            <dt className={TERM}>CV</dt>
            <dd className="flex items-center gap-1.5 font-semibold">
              <FileText className="size-4" aria-hidden />
              {candidate.cvFileName}
            </dd>
          </dl>

          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="message">Mensaje para la empresa (opcional)</FieldLabel>
                <Textarea
                  {...field}
                  id="message"
                  rows={4}
                  placeholder="Cuéntales brevemente por qué te interesa la vacante."
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Máximo 1000 caracteres.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Enviar postulación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
