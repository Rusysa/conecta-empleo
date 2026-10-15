import { describe, expect, it } from "vitest"

import { registerSchema, resetPasswordSchema } from "@/lib/validations/auth"
import { candidateProfileSchema, CV_MAX_BYTES, validateCvFile } from "@/lib/validations/candidate"
import { companyProfileSchema, slugify } from "@/lib/validations/company"
import { jobSchema } from "@/lib/validations/job"

const PDF = "application/pdf"
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

describe("registerSchema", () => {
  const valid = {
    role: "CANDIDATE" as const,
    email: "ana@example.com",
    password: "12345678",
    confirmPassword: "12345678",
    acceptPrivacy: true,
  }

  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it("requires at least 8 characters", () => {
    const r = registerSchema.safeParse({ ...valid, password: "1234567", confirmPassword: "1234567" })
    expect(r.success).toBe(false)
  })

  it("requires matching passwords, reported on confirmPassword", () => {
    const r = registerSchema.safeParse({ ...valid, confirmPassword: "different1" })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].path).toEqual(["confirmPassword"])
  })

  it("requires accepting the privacy notice", () => {
    expect(registerSchema.safeParse({ ...valid, acceptPrivacy: false }).success).toBe(false)
  })
})

describe("resetPasswordSchema", () => {
  it("rejects mismatched passwords", () => {
    expect(resetPasswordSchema.safeParse({ password: "abcdefgh", confirmPassword: "abcdefgx" }).success).toBe(false)
  })
})

describe("candidateProfileSchema", () => {
  const valid = { fullName: "Ana López", phone: "81 1234 5678", city: "", headline: "" }

  it("accepts a 10-digit phone with spaces", () => {
    expect(candidateProfileSchema.safeParse(valid).success).toBe(true)
  })

  it.each(["12345", "81-1234-56ab", ""])("rejects phone %j", (phone) => {
    expect(candidateProfileSchema.safeParse({ ...valid, phone }).success).toBe(false)
  })
})

describe("validateCvFile", () => {
  it("accepts PDF and DOCX under 5 MB", () => {
    expect(validateCvFile({ name: "cv.pdf", type: PDF, size: 1000 })).toBeNull()
    expect(validateCvFile({ name: "CV.DOCX", type: DOCX, size: 1000 })).toBeNull()
  })

  it("accepts .docx with an empty browser MIME (re-checked on the server)", () => {
    expect(validateCvFile({ name: "cv.docx", type: "", size: 1000 })).toBeNull()
  })

  it("rejects other types and mismatched MIME/extension", () => {
    expect(validateCvFile({ name: "cv.txt", type: "text/plain", size: 10 })).toMatch(/PDF o DOCX/)
    expect(validateCvFile({ name: "cv.pdf", type: "image/png", size: 10 })).toMatch(/PDF o DOCX/)
    expect(validateCvFile({ name: "cv.doc", type: "application/msword", size: 10 })).toMatch(/PDF o DOCX/)
  })

  it("rejects files over 5 MB and empty files", () => {
    expect(validateCvFile({ name: "cv.pdf", type: PDF, size: CV_MAX_BYTES + 1 })).toMatch(/5 MB/)
    expect(validateCvFile({ name: "cv.pdf", type: PDF, size: CV_MAX_BYTES })).toBeNull()
    expect(validateCvFile({ name: "cv.pdf", type: PDF, size: 0 })).toMatch(/vacío/)
  })
})

describe("companyProfileSchema", () => {
  const valid = { name: "Café La Esquina", description: "", location: "", website: "" }

  it("allows an empty website but validates non-empty ones", () => {
    expect(companyProfileSchema.safeParse(valid).success).toBe(true)
    expect(companyProfileSchema.safeParse({ ...valid, website: "https://cafe.mx" }).success).toBe(true)
    expect(companyProfileSchema.safeParse({ ...valid, website: "javascript:alert(1)" }).success).toBe(false)
  })
})

describe("slugify", () => {
  it("removes accents and symbols", () => {
    expect(slugify("Café La Esquina, S.A. de C.V.")).toBe("cafe-la-esquina-s-a-de-c-v")
    expect(slugify("  Tecnologías   Norte  ")).toBe("tecnologias-norte")
  })
})

describe("jobSchema", () => {
  const valid = {
    title: "Barista",
    description: "Prepara bebidas de especialidad para nuestros clientes.",
    requirements: "- Gusto por el café",
    location: "Guadalajara",
    workMode: "ONSITE" as const,
    employmentType: "PART_TIME" as const,
    salaryMin: "9000",
    salaryMax: "11000",
  }

  it("accepts a valid job", () => {
    expect(jobSchema.safeParse(valid).success).toBe(true)
  })

  it("requires a location unless the job is remote", () => {
    expect(jobSchema.safeParse({ ...valid, location: "" }).success).toBe(false)
    expect(jobSchema.safeParse({ ...valid, location: "", workMode: "REMOTE" }).success).toBe(true)
  })

  it("rejects max salary below min salary, and non-numeric salaries", () => {
    const r = jobSchema.safeParse({ ...valid, salaryMax: "5000" })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].path).toEqual(["salaryMax"])
    expect(jobSchema.safeParse({ ...valid, salaryMin: "9,000" }).success).toBe(false)
  })

  it("allows empty salaries", () => {
    expect(jobSchema.safeParse({ ...valid, salaryMin: "", salaryMax: "" }).success).toBe(true)
  })
})
