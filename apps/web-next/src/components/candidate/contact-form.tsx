"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { candidateProfileSchema, type CandidateProfileInput } from "@/lib/validations/candidate"

const FIELDS: {
  name: keyof CandidateProfileInput
  label: string
  autoComplete: string
  type?: string
  placeholder?: string
  description?: string
}[] = [
  { name: "fullName", label: "Nombre completo", autoComplete: "name" },
  {
    name: "phone",
    label: "Teléfono",
    autoComplete: "tel",
    type: "tel",
    placeholder: "81 1234 5678",
    description: "Solo lo verán las empresas a las que apliques.",
  },
  {
    name: "city",
    label: "Ciudad (opcional)",
    autoComplete: "address-level2",
    placeholder: "Monterrey",
  },
  {
    name: "headline",
    label: "Puesto que buscas (opcional)",
    autoComplete: "organization-title",
    placeholder: "Ej. Desarrolladora Frontend",
  },
]

export function ContactForm({
  email,
  defaultValues,
  onSaved,
}: {
  email: string
  defaultValues: CandidateProfileInput
  onSaved: () => void
}) {
  const form = useForm<CandidateProfileInput>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues,
  })

  async function onSubmit(values: CandidateProfileInput) {
    // TODO(backend): updateCandidateProfile(values) Server Action.
    await new Promise((r) => setTimeout(r, 600))
    console.info("updateCandidateProfile (mock)", values)
    form.reset(values)
    toast.success("Datos guardados")
    onSaved()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input id="email" value={email} disabled readOnly />
          <FieldDescription>Es el correo con el que inicias sesión.</FieldDescription>
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <Controller
              key={f.name}
              name={f.name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={f.name}>{f.label}</FieldLabel>
                  <Input
                    {...field}
                    id={f.name}
                    type={f.type ?? "text"}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    aria-invalid={fieldState.invalid}
                  />
                  {f.description && <FieldDescription>{f.description}</FieldDescription>}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}
        </div>
        <div>
          <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
            Guardar datos
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
