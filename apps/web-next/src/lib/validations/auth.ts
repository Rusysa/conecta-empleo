import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Ingresa un correo válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    role: z.enum(["CANDIDATE", "COMPANY"]),
    email: z.email("Ingresa un correo válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
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
