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
import { formatDate } from "@/lib/format"
import { getPublicJobById } from "@/server/queries/jobs"

export async function generateMetadata({
  params,
}: PageProps<"/vacantes/[id]">): Promise<Metadata> {
  const job = await getPublicJobById((await params).id)
  return { title: job ? `${job.title} en ${job.company.name}` : "Vacante no encontrada" }
}

export default async function JobDetailPage({ params }: PageProps<"/vacantes/[id]">) {
  const job = await getPublicJobById((await params).id)
  if (!job) notFound()

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
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
            <p className="whitespace-pre-line text-muted-foreground">{job.description}</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Requisitos</h2>
            <p className="whitespace-pre-line text-muted-foreground">{job.requirements}</p>
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
