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

// Logo rules. The server must re-check the real MIME type and re-encode/resize the image.
export const LOGO_MAX_BYTES = 2 * 1024 * 1024
export const LOGO_ACCEPT = "image/png,image/jpeg,image/webp"
const LOGO_TYPES = LOGO_ACCEPT.split(",")

/** Returns an error message, or null if the file is a valid logo. */
export function validateLogoFile(file: { type: string; size: number }) {
  if (!LOGO_TYPES.includes(file.type)) return "Usa una imagen PNG, JPG o WebP"
  if (file.size > LOGO_MAX_BYTES) return "La imagen no puede pesar más de 2 MB"
  if (file.size === 0) return "El archivo está vacío"
  return null
}
