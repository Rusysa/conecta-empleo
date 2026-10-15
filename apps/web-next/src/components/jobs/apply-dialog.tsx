"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Loader2 } from "lucide-react"
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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { applySchema, type ApplyInput } from "@/lib/validations/application"

type Props = {
  jobTitle: string
  companyName: string
  candidate: { fullName: string; email: string; phone: string; cvFileName: string }
}

export function ApplyDialog({ jobTitle, companyName, candidate }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const form = useForm<ApplyInput>({
    resolver: zodResolver(applySchema),
    defaultValues: { message: "" },
  })

  async function onSubmit(values: ApplyInput) {
    // TODO(backend): call the applyToJob(jobId, message) Server Action.
    await new Promise((r) => setTimeout(r, 800))
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
        <Button size="lg" className="w-full">
          Aplicar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Aplicar a {jobTitle}</DialogTitle>
            <DialogDescription>
              {companyName} recibirá los siguientes datos:
            </DialogDescription>
          </DialogHeader>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg bg-muted p-3 text-sm">
            <dt className="text-muted-foreground">Nombre</dt>
            <dd>{candidate.fullName}</dd>
            <dt className="text-muted-foreground">Correo</dt>
            <dd className="break-all">{candidate.email}</dd>
            <dt className="text-muted-foreground">Teléfono</dt>
            <dd>{candidate.phone}</dd>
            <dt className="text-muted-foreground">CV</dt>
            <dd className="flex items-center gap-1.5">
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
