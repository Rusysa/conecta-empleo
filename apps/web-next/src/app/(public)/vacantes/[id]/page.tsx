import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BadgeCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ApplyButton } from "@/components/jobs/apply-button"
import { CompanyLogo } from "@/components/jobs/company-logo"
import { JobMeta } from "@/components/jobs/job-meta"
import { MarkdownContent } from "@/components/jobs/markdown-content"
import { APP_URL } from "@/lib/app-url"
import { formatDate } from "@/lib/format"
import { buildJobPostingJsonLd, serializeJsonLd } from "@/lib/seo/job-posting"
import { getPublicJobById } from "@/server/queries/jobs"

function summarize(text: string, max = 155) {
  const flat = text.replace(/\s+/g, " ").trim()
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat
}

export async function generateMetadata({ params }: PageProps<"/vacantes/[id]">): Promise<Metadata> {
  const job = await getPublicJobById((await params).id)
  if (!job) return { title: "Vacante no encontrada" }

  const title = `${job.title} en ${job.company.name}`
  const description = summarize(job.description)
  return {
    title,
    description,
    alternates: { canonical: `/vacantes/${job.id}` },
    openGraph: { type: "website", title, description, url: `/vacantes/${job.id}` },
  }
}

export default async function JobDetailPage({ params }: PageProps<"/vacantes/[id]">) {
  const job = await getPublicJobById((await params).id)
  if (!job) notFound()

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJobPostingJsonLd(job, APP_URL)) }}
      />
      <Button variant="ghost" size="sm" asChild>
        <Link href="/vacantes">
          <ArrowLeft /> Volver a vacantes
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <article className="space-y-6">
          <header className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{job.title}</h1>
            <Link
              href={`/empresas/${job.company.slug}`}
              className="inline-flex items-center gap-1.5 font-medium hover:underline"
            >
              {job.company.name}
              {job.company.verified && (
                <BadgeCheck className="size-4 text-primary" aria-label="Empresa verificada" />
              )}
            </Link>
            <JobMeta {...job} />
            {job.publishedAt && (
              <p className="text-xs text-muted-foreground">
                Publicada el {formatDate(job.publishedAt)}
              </p>
            )}
          </header>

          <Separator />

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Descripción</h2>
            <MarkdownContent>{job.description}</MarkdownContent>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Requisitos</h2>
            <MarkdownContent>{job.requirements}</MarkdownContent>
          </section>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent>
              <ApplyButton job={job} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3">
              <CompanyLogo company={job.company} className="size-10" />
              <CardTitle>{job.company.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {job.company.description && <p>{job.company.description}</p>}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/empresas/${job.company.slug}`}>Ver empresa</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
