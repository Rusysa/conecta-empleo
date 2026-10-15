"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CircleCheck, Circle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/components/candidate/contact-form"
import { CvUpload, type CurrentCv } from "@/components/candidate/cv-upload"
import { setMockRoleCookie } from "@/components/layout/mock-role-cookie"
import type { CandidateProfileInput } from "@/lib/validations/candidate"

type Props = {
  email: string
  profile: CandidateProfileInput
  cv: CurrentCv
  /** Where to send the candidate once the profile is complete (e.g. the job they wanted). */
  next: string | null
}

/** Coordinates contact data + CV so we know when the profile becomes complete (CLAUDE.md §5.1). */
export function ProfileEditor({ email, profile, cv: initialCv, next }: Props) {
  const router = useRouter()
  const [hasContact, setHasContact] = useState(Boolean(profile.fullName && profile.phone))
  const [cv, setCv] = useState<CurrentCv>(initialCv)
  const complete = hasContact && cv !== null

  function maybeComplete(nowHasContact: boolean, nowHasCv: boolean) {
    if (complete || !nowHasContact || !nowHasCv) return
    // TODO(backend): drop this; completeness will come from the DB.
    setMockRoleCookie("CANDIDATE")
    toast.success("¡Tu perfil está completo!", {
      description: next ? "Ya puedes aplicar a la vacante." : "Ya puedes aplicar a vacantes.",
    })
    if (next) router.push(next)
    // Refresh shared layouts too (navbar/footer read the session).
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {!complete && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Completa tu perfil para poder aplicar</CardTitle>
            <CardDescription>Las empresas recibirán estos datos cuando apliques.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-2 text-sm sm:grid-cols-2">
              <Step done={hasContact}>Nombre y teléfono</Step>
              <Step done={cv !== null}>CV en PDF o DOCX</Step>
            </ol>
          </CardContent>
        </Card>
      )}

      {complete && next && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
          <p className="text-sm">Tu perfil está completo.</p>
          <Button asChild>
            <Link href={next}>
              Volver a la vacante <ArrowRight />
            </Link>
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Datos de contacto</CardTitle>
          <CardDescription>Nunca se muestran en páginas públicas.</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm
            email={email}
            defaultValues={profile}
            onSaved={() => {
              setHasContact(true)
              maybeComplete(true, cv !== null)
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currículum (CV)</CardTitle>
          <CardDescription>
            Al aplicar, la empresa recibe una copia del CV que tengas en ese momento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CvUpload
            current={cv}
            onUploaded={(uploaded) => {
              setCv(uploaded)
              maybeComplete(hasContact, true)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function Step({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      {done ? (
        <CircleCheck className="size-4 text-primary" aria-hidden />
      ) : (
        <Circle className="size-4 text-muted-foreground" aria-hidden />
      )}
      <span className={done ? "text-muted-foreground line-through" : undefined}>{children}</span>
      <span className="sr-only">{done ? "(listo)" : "(pendiente)"}</span>
    </li>
  )
}
