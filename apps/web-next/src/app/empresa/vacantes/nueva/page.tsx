import { Suspense } from "react"
import type { Metadata } from "next"

import { Card, CardContent } from "@/components/ui/card"
import { JobForm } from "@/components/jobs/job-form"
import { requireCompany } from "@/lib/authz"

export const metadata: Metadata = { title: "Nueva vacante" }

async function NewJobForm() {
  await requireCompany("/empresa/vacantes/nueva")
  return <JobForm mode="create" />
}

export default function NewJobPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Nueva vacante</h1>
      <Card className="max-w-3xl">
        <CardContent>
          <Suspense
            fallback={
              <div className="h-[36rem] animate-pulse rounded-lg bg-muted" aria-busy="true" />
            }
          >
            <NewJobForm />
          </Suspense>
        </CardContent>
      </Card>
    </>
  )
}
