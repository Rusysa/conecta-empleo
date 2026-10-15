import type { MetadataRoute } from "next"

import { APP_URL } from "@/lib/app-url"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private areas and one-time-token pages are never indexed.
      disallow: ["/candidato/", "/empresa/", "/api/", "/recuperar/nueva", "/verificar"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
