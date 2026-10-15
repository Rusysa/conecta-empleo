"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { mutate, safeCallback } from "@/lib/api"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter()
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    try {
      await mutate("/auth/login", values)
      router.push(safeCallback(callbackUrl))
      router.refresh()
    } catch (error) {
      form.setError("root", { message: error instanceof Error ? error.message : "No se pudo iniciar sesión." })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {form.formState.errors.root && <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>}
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
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Link href="/recuperar" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                {...field}
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Iniciar sesión
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-medium text-foreground underline-offset-4 hover:underline">
            Regístrate
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
