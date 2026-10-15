"use client"

import { useState } from "react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth"

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordInput) {
    // TODO(backend): requestPasswordReset(email) → email with a one-time token link
    // to /recuperar/nueva?token=… (CLAUDE.md fase 2). Rate-limit this action.
    await new Promise((r) => setTimeout(r, 700))
    console.info("requestPasswordReset (mock)", values.email)
    setSentTo(values.email)
  }

  if (sentTo) {
    // Same message whether or not the account exists, to avoid revealing registered emails.
    return (
      <div role="status" className="flex flex-col items-center gap-3 text-center">
        <MailCheck className="size-10 text-primary" aria-hidden />
        <p>
          Si existe una cuenta con <span className="font-medium break-all">{sentTo}</span>, te
          enviamos un enlace para crear una nueva contraseña.
        </p>
        <p className="text-sm text-muted-foreground">Revisa también tu carpeta de spam.</p>
        <Button variant="outline" asChild>
          <Link href="/login">Volver a iniciar sesión</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <Input {...field} id="email" type="email" autoComplete="email" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Enviar enlace
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
