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
    <form onSubmit={submitAs(status ?? "ACTIVE")} noValidate>
      <FieldGroup>
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

        <div className="flex flex-wrap gap-2">
          {mode === "create" ? (
            <>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                Publicar
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={submitAs("DRAFT")}
              >
                Guardar borrador
              </Button>
            </>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Guardar cambios
            </Button>
          )}
          <Button variant="ghost" asChild>
            <Link href="/empresa/vacantes">Cancelar</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
