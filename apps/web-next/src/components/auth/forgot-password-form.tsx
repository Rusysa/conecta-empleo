"use client"

import { useState } from "react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import {
  AuthSwitch,
  StickerArt,
  authInputClass,
  authSubmitClass,
} from "@/components/auth/auth-shell"
import { RollText } from "@/components/landing/roll-text"
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
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-2xl border border-black bg-sand p-5 text-black"
      >
        <StickerArt name="check" className="w-16" rotate={-6} />
        <p className="font-semibold">
          Si existe una cuenta con <span className="font-bold break-all">{sentTo}</span>, te
          enviamos un enlace para crear una nueva contraseña.
        </p>
        <p className="text-sm">Revisa también tu carpeta de spam.</p>
        <Link href="/login" className="pill pill--sm pill--dark">
          <RollText>Volver a iniciar sesión</RollText>
        </Link>
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
              <Input
                {...field}
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className={authInputClass}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className={authSubmitClass}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Enviar enlace
        </Button>
        <AuthSwitch question="¿Ya la recordaste?" href="/login" cta="Inicia sesión" />
      </FieldGroup>
    </form>
  )
}
