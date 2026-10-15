import { describe, expect, it } from "vitest"

import { buildJobPostingJsonLd, serializeJsonLd } from "@/lib/seo/job-posting"
import type { JobWithCompany } from "@/lib/types"

const job: JobWithCompany = {
  id: "job_1",
  companyId: "cmp_1",
  title: "Desarrollador Frontend",
  slug: "desarrollador-frontend",
  description: "Construye interfaces.",
  requirements: "- React",
  location: "Monterrey, N.L.",
  workMode: "HYBRID",
  employmentType: "INTERNSHIP",
  salaryMin: 8000,
  salaryMax: null,
  currency: "MXN",
  status: "ACTIVE",
  publishedAt: new Date("2026-10-01T00:00:00Z"),
  closedAt: null,
  featured: false,
  createdAt: new Date("2026-09-30T00:00:00Z"),
  company: {
    id: "cmp_1",
    name: "Tecnologías Norte",
    slug: "tecnologias-norte",
    description: null,
    logoUrl: null,
    website: "https://example.com",
    location: "Monterrey",
    verified: true,
  },
}

describe("buildJobPostingJsonLd", () => {
  it("maps the job to schema.org JobPosting", () => {
    const ld = buildJobPostingJsonLd(job, "https://bolsa.mx")
    expect(ld).toMatchObject({
      "@type": "JobPosting",
      title: "Desarrollador Frontend",
      datePosted: "2026-10-01T00:00:00.000Z",
      employmentType: "INTERN",
      url: "https://bolsa.mx/vacantes/job_1",
      hiringOrganization: { name: "Tecnologías Norte", sameAs: "https://example.com" },
      jobLocation: { address: { addressLocality: "Monterrey, N.L.", addressCountry: "MX" } },
      baseSalary: { currency: "MXN", value: { minValue: 8000, unitText: "MONTH" } },
    })
    expect(ld.baseSalary?.value).not.toHaveProperty("maxValue")
  })

  it("uses TELECOMMUTE for remote jobs and omits salary when unknown", () => {
    const ld = buildJobPostingJsonLd(
      { ...job, workMode: "REMOTE", salaryMin: null, salaryMax: null },
      "https://bolsa.mx"
    )
    expect(ld).toMatchObject({ jobLocationType: "TELECOMMUTE" })
    expect(ld).not.toHaveProperty("jobLocation")
    expect(ld).not.toHaveProperty("baseSalary")
  })
})

describe("serializeJsonLd", () => {
  it("escapes < so the JSON cannot close the script tag", () => {
    const out = serializeJsonLd({ description: "</script><script>alert(1)</script>" })
    expect(out).not.toContain("</script>")
    expect(JSON.parse(out).description).toBe("</script><script>alert(1)</script>")
  })
})
