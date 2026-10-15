import { z } from "zod"

// Salaries are kept as strings in the form (empty = not specified);
// the server action will convert them to Int.
const salary = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d+$/.test(v), "Usa solo números, sin puntos ni comas")

export const jobSchema = z
  .object({
    title: z.string().trim().min(3, "Ingresa el título de la vacante").max(120),
    description: z.string().trim().min(20, "Describe la vacante (mínimo 20 caracteres)").max(5000),
    requirements: z.string().trim().min(10, "Indica los requisitos (mínimo 10 caracteres)").max(5000),
    location: z.string().trim().max(100),
    workMode: z.enum(["ONSITE", "REMOTE", "HYBRID"], "Elige una modalidad"),
    employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"], "Elige un tipo de contrato"),
    salaryMin: salary,
    salaryMax: salary,
  })
  .refine((d) => d.workMode === "REMOTE" || d.location !== "", {
    message: "Indica la ubicación (o elige modalidad remota)",
    path: ["location"],
  })
  .refine(
    (d) => d.salaryMin === "" || d.salaryMax === "" || Number(d.salaryMax) >= Number(d.salaryMin),
    { message: "El salario máximo debe ser mayor o igual al mínimo", path: ["salaryMax"] }
  )

export type JobInput = z.infer<typeof jobSchema>
