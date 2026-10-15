import { z } from "zod"

export const candidateProfileSchema = z.object({
  fullName: z.string().trim().min(3, "Ingresa tu nombre completo").max(100),
  phone: z
    .string()
    .trim()
    .refine((v) => /^[\d\s()+-]+$/.test(v), "Usa solo números, espacios o guiones")
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length
      return digits >= 10 && digits <= 13
    }, "Ingresa un teléfono de 10 dígitos"),
  city: z.string().trim().max(80),
  headline: z.string().trim().max(80, "Máximo 80 caracteres"),
})

export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>

// CV rules (CLAUDE.md §2 and §9). The server must re-check MIME and extension.
export const CV_MAX_BYTES = 5 * 1024 * 1024
export const CV_ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const CV_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

/** Returns an error message, or null if the file is a valid CV. */
export function validateCvFile(file: { name: string; type: string; size: number }) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  // Some browsers report an empty type for .docx; the server re-checks the real MIME.
  if (!(ext in CV_TYPES) || (file.type !== "" && CV_TYPES[ext] !== file.type)) {
    return "Solo se aceptan archivos PDF o DOCX"
  }
  if (file.size > CV_MAX_BYTES) return "El archivo no puede pesar más de 5 MB"
  if (file.size === 0) return "El archivo está vacío"
  return null
}
