import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Ingresa un correo válido").max(254),
  password: z.string().min(1, "Ingresa tu contraseña").max(128),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    role: z.enum(["CANDIDATE", "COMPANY"]),
    name: z.string().trim().min(2, "Ingresa tu nombre o el de tu empresa").max(100),
    email: z.email("Ingresa un correo válido").max(254),
    password: z.string().min(12, "La contraseña debe tener al menos 12 caracteres").max(128, "Máximo 128 caracteres"),
    confirmPassword: z.string(),
    acceptPrivacy: z
      .boolean()
      .refine((v) => v, "Debes aceptar el aviso de privacidad"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.email("Ingresa un correo válido"),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
