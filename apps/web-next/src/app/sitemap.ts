import type { MetadataRoute } from "next"

import { APP_URL } from "@/lib/app-url"
import { companies, jobs } from "@/lib/mock-data"

// Only public, indexable pages: active jobs and companies with at least one active job.
// TODO(backend): read from the database (and add revalidation) instead of mock data.
export default function sitemap(): MetadataRoute.Sitemap {
  const activeJobs = jobs.filter((j) => j.status === "ACTIVE")
  const companyIds = new Set(activeJobs.map((j) => j.companyId))

  return [
    { url: APP_URL, changeFrequency: "daily", priority: 1 },
    { url: `${APP_URL}/vacantes`, changeFrequency: "hourly", priority: 0.9 },
    ...activeJobs.map((job) => ({
      url: `${APP_URL}/vacantes/${job.id}`,
      lastModified: job.publishedAt ?? job.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...companies
      .filter((c) => companyIds.has(c.id))
      .map((c) => ({
        url: `${APP_URL}/empresas/${c.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
  ]
}
