"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "@/lib/constants"
import type { JobStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { jobSchema, type JobInput } from "@/lib/validations/job"

type Props =
  | { mode: "create"; defaultValues?: undefined; jobId?: undefined; status?: undefined }
  | { mode: "edit"; defaultValues: JobInput; jobId: string; status: JobStatus }

const EMPTY: Partial<JobInput> = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
}

const STEP_FILL = ["bg-lagoon", "bg-sunburst", "bg-lavender"] as const

/** One outlined block of the form: a numbered island sticker, an Anton title and a hint. */
function FormSection({
  step,
  title,
  hint,
  children,
}: {
  step: 1 | 2 | 3
  title: string
  hint: string
  children: React.ReactNode
}) {
  const id = `job-form-step-${step}`
  return (
    <section
      aria-labelledby={id}
      className="rounded-[20px] border border-border bg-card p-5 text-card-foreground sm:p-7"
    >
      <div className="mb-6 flex items-start gap-4">
        <span
          aria-hidden
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full border border-black font-display text-xl text-black",
            STEP_FILL[step - 1]
          )}
        >
          {step}
        </span>
        <div className="space-y-1">
          <h2 id={id} className="font-display text-2xl leading-none uppercase sm:text-3xl">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>
      </div>
      <FieldGroup>{children}</FieldGroup>
    </section>
  )
}

export function JobForm({ mode, defaultValues, jobId, status }: Props) {
  const router = useRouter()
  const form = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: defaultValues ?? EMPTY,
  })
  const { isSubmitting } = form.formState

  function submitAs(nextStatus: JobStatus) {
    return form.handleSubmit(async (values) => {
      // TODO(backend): createJob(values, nextStatus) / updateJob(jobId, values) Server Actions.
      await new Promise((r) => setTimeout(r, 700))
      console.info(mode === "create" ? "createJob (mock)" : "updateJob (mock)", {
        jobId,
        nextStatus,
        values,
      })
      toast.success(
        mode === "edit"
          ? "Cambios guardados"
          : nextStatus === "ACTIVE"
            ? "¡Vacante publicada!"
            : "Borrador guardado"
      )
      router.push("/empresa/vacantes")
    })
  }

  return (
    <form onSubmit={submitAs(status ?? "ACTIVE")} noValidate className="space-y-5">
      <FormSection step={1} title="Lo básico" hint="Cómo se llama el puesto y dónde se trabaja.">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Título de la vacante</FieldLabel>
              <Input
                {...field}
                id="title"
                placeholder="Ej. Desarrollador Frontend"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            name="workMode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="workMode">Modalidad</FieldLabel>
                <Select name={field.name} value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="workMode"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder="Elige una modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(WORK_MODE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="employmentType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="employmentType">Tipo de contrato</FieldLabel>
                <Select name={field.name} value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="employmentType"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder="Elige un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="location">Ubicación</FieldLabel>
              <Input
                {...field}
                id="location"
                placeholder="Ej. Monterrey, N.L."
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>Opcional si la vacante es remota.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FormSection>

      <FormSection
        step={2}
        title="Salario"
        hint="Opcional, pero las vacantes con sueldo visible reciben más postulantes."
      >
        <FieldSet>
          <FieldLegend variant="label">Salario mensual en MXN (opcional)</FieldLegend>
          <div className="grid gap-6 sm:grid-cols-2">
            {(["salaryMin", "salaryMax"] as const).map((name) => (
              <Controller
                key={name}
                name={name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>
                      {name === "salaryMin" ? "Mínimo" : "Máximo"}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={name}
                      inputMode="numeric"
                      placeholder={name === "salaryMin" ? "15000" : "20000"}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            ))}
          </div>
        </FieldSet>
      </FormSection>

      <FormSection
        step={3}
        title="La vacante"
        hint="Lo que hará la persona y lo que necesitas de ella."
      >
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Descripción</FieldLabel>
              <Textarea
                {...field}
                id="description"
                rows={6}
                placeholder="¿Qué hará la persona? ¿Con quién trabajará? ¿Qué ofreces?"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                Puedes usar formato: **negritas**, listas con guion y una línea en blanco entre
                párrafos.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="requirements"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="requirements">Requisitos</FieldLabel>
              <Textarea
                {...field}
                id="requirements"
                rows={5}
                placeholder={"- 2 años de experiencia\n- Disponibilidad de horario"}
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>Uno por línea, empezando con un guion.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FormSection>

      <div className="flex flex-wrap items-center gap-2 rounded-[20px] border border-border bg-secondary p-4 text-secondary-foreground sm:p-5">
        {mode === "create" ? (
          <>
            <Button type="submit" className="h-11 px-6" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Publicar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 px-6"
              disabled={isSubmitting}
              onClick={submitAs("DRAFT")}
            >
              Guardar borrador
            </Button>
          </>
        ) : (
          <Button type="submit" className="h-11 px-6" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Guardar cambios
          </Button>
        )}
        <Button variant="ghost" className="h-11 px-5 sm:ml-auto" asChild>
          <Link href="/empresa/vacantes">Cancelar</Link>
        </Button>
      </div>
    </form>
  )
}
