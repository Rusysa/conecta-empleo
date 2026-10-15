"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Loader2, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { mutate } from "@/lib/api"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"

const ROLE_OPTIONS = [
  { value: "CANDIDATE", label: "Busco empleo", icon: UserRound },
  { value: "COMPANY", label: "Soy empresa", icon: Building2 },
] as const

export function RegisterForm({ defaultRole }: { defaultRole: RegisterInput["role"] }) {
  const router = useRouter()
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptPrivacy: false,
    },
  })

  async function onSubmit(values: RegisterInput) {
    try {
      await mutate("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role === "CANDIDATE" ? "candidate" : "employer",
        acceptPrivacy: values.acceptPrivacy,
      })
      router.push(values.role === "CANDIDATE" ? "/candidato/perfil" : "/empresa/perfil")
      router.refresh()
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "No se pudo crear la cuenta.",
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Tu nombre o nombre de la empresa</FieldLabel>
              <Input
                {...field}
                id="name"
                autoComplete="name"
                maxLength={100}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="role"
          control={form.control}
          render={({ field }) => (
            <FieldSet>
              <FieldLegend variant="label">Tipo de cuenta</FieldLegend>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 gap-3"
              >
                {ROLE_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <FieldLabel key={value} htmlFor={`role-${value}`}>
                    <Field orientation="horizontal">
                      <FieldContent className="flex-row items-center gap-2">
                        <Icon className="size-4" aria-hidden />
                        {label}
                      </FieldContent>
                      <RadioGroupItem value={value} id={`role-${value}`} aria-label={label} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            </FieldSet>
          )}
        />

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
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">Confirmar contraseña</FieldLabel>
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="acceptPrivacy"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="acceptPrivacy"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={fieldState.invalid}
              />
              <FieldContent>
                <FieldLabel htmlFor="acceptPrivacy" className="font-normal">
                  <span>
                    Acepto el{" "}
                    <Link
                      href="/privacidad"
                      target="_blank"
                      className="underline underline-offset-4"
                    >
                      aviso de privacidad
                    </Link>
                  </span>
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Crear cuenta
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
