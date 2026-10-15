"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import {
  AuthAlert,
  AuthSwitch,
  StickerArt,
  authInputClass,
  authLinkClass,
  authSubmitClass,
} from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
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
  {
    value: "CANDIDATE",
    label: "Busco empleo",
    hint: "Aplica a vacantes con tu CV.",
    sticker: "cv",
  },
  {
    value: "COMPANY",
    label: "Soy empresa",
    hint: "Publica vacantes y recibe postulantes.",
    sticker: "case",
  },
] as const

/*
 * Big island tiles for the role chooser. The checked tile turns sand with black ink
 * (fixed in both themes) and gets the landing's offset sticker shadow.
 */
const TILE_CLASS =
  "relative flex h-full cursor-pointer flex-col gap-3 rounded-[22px] border border-border bg-card p-4 pr-10 text-card-foreground transition-[background-color,box-shadow,translate] hover:bg-muted/40 has-[[data-state=checked]]:-translate-y-0.5 has-[[data-state=checked]]:border-black has-[[data-state=checked]]:bg-sand has-[[data-state=checked]]:text-black has-[[data-state=checked]]:shadow-[4px_4px_0_0_#000] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring motion-reduce:transition-none sm:p-5 sm:pr-12"

const TILE_RADIO_CLASS =
  "absolute top-4 right-4 size-5 border-current data-[state=checked]:border-black data-[state=checked]:bg-black dark:data-[state=checked]:bg-black [&_[data-slot=radio-group-indicator]>span]:bg-white"

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
  const role = useWatch({ control: form.control, name: "role" })

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
        {form.formState.errors.root && <AuthAlert>{form.formState.errors.root.message}</AuthAlert>}
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
                {ROLE_OPTIONS.map(({ value, label, hint, sticker }) => (
                  <label key={value} htmlFor={`role-${value}`} className={TILE_CLASS}>
                    <RadioGroupItem
                      value={value}
                      id={`role-${value}`}
                      aria-label={label}
                      aria-describedby={`role-${value}-hint`}
                      className={TILE_RADIO_CLASS}
                    />
                    <StickerArt name={sticker} className="h-14 w-14 sm:h-16 sm:w-16" />
                    <span className="font-display text-2xl leading-none uppercase sm:text-3xl">
                      {label}
                    </span>
                    <span id={`role-${value}-hint`} className="text-sm leading-snug">
                      {hint}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </FieldSet>
          )}
        />
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">
                {role === "COMPANY" ? "Nombre de la empresa" : "Tu nombre"}
              </FieldLabel>
              <Input
                {...field}
                id="name"
                autoComplete={role === "COMPANY" ? "organization" : "name"}
                maxLength={100}
                aria-invalid={fieldState.invalid}
                className={authInputClass}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
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
                className={authInputClass}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">
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
                  aria-describedby="password-hint"
                  className={authInputClass}
                />
                <FieldDescription id="password-hint">Mínimo 12 caracteres.</FieldDescription>
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
                  className={authInputClass}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
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
                    <Link href="/privacidad" target="_blank" className={authLinkClass}>
                      aviso de privacidad
                    </Link>
                  </span>
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
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
          Crear cuenta
        </Button>
        <AuthSwitch question="¿Ya tienes cuenta?" href="/login" cta="Inicia sesión" />
      </FieldGroup>
    </form>
  )
}
