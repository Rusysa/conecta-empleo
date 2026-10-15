import { z } from "zod"

export const applySchema = z.object({
  message: z
    .string()
    .trim()
    .max(1000, "El mensaje no puede exceder 1000 caracteres"),
})

export type ApplyInput = z.infer<typeof applySchema>
