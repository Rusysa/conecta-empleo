import { z } from "zod"

export const companyProfileSchema = z.object({
  name: z.string().trim().min(2, "Ingresa el nombre de la empresa").max(100),
  description: z.string().trim().max(1000, "Máximo 1000 caracteres"),
  location: z.string().trim().max(100),
  website: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^https?:\/\/\S+\.\S+$/.test(v),
      "Ingresa una URL válida (https://…)"
    ),
})

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>

/** URL-friendly slug used for /empresas/[slug]. The server must ensure uniqueness. */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
