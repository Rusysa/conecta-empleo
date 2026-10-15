import type { EmploymentType, JobWithCompany } from "@/lib/types"

// schema.org employmentType values (Google for Jobs).
const EMPLOYMENT_TYPE: Record<EmploymentType, string> = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACTOR",
  INTERNSHIP: "INTERN",
}

/** Builds the JSON-LD JobPosting object for a public job (CLAUDE.md fase 3, SEO). */
export function buildJobPostingJsonLd(job: JobWithCompany, appUrl: string) {
  const company = job.company
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.description}\n\nRequisitos:\n${job.requirements}`,
    datePosted: (job.publishedAt ?? job.createdAt).toISOString(),
    employmentType: EMPLOYMENT_TYPE[job.employmentType],
    directApply: true,
    url: `${appUrl}/vacantes/${job.id}`,
    hiringOrganization: {
      "@type": "Organization",
      name: company.name,
      ...(company.website && { sameAs: company.website }),
      ...(company.logoUrl && { logo: company.logoUrl }),
    },
    ...(job.workMode === "REMOTE"
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: { "@type": "Country", name: "MX" },
        }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: job.location ?? company.location ?? undefined,
              addressCountry: "MX",
            },
          },
        }),
    ...((job.salaryMin != null || job.salaryMax != null) && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: job.currency,
        value: {
          "@type": "QuantitativeValue",
          ...(job.salaryMin != null && { minValue: job.salaryMin }),
          ...(job.salaryMax != null && { maxValue: job.salaryMax }),
          unitText: "MONTH",
        },
      },
    }),
  }
}

/** Serializes JSON-LD safely for a <script> tag (prevents `</script>` breakouts). */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
