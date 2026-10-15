import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { X } from "lucide-react"

import { AuthFormSkeleton, StickerArt } from "@/components/auth/auth-shell"
import { RollText } from "@/components/landing/roll-text"

export const metadata: Metadata = { title: "Verificar correo", robots: { index: false } }

const TITLE_STYLE = { fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }

async function VerifyResult({ searchParams }: Pick<PageProps<"/verificar">, "searchParams">) {
  const { token } = await searchParams
  // TODO(backend): verifyEmail(token) → checks the one-time token and sets User.emailVerified.
  const ok = typeof token === "string" && token.length >= 16

  // A "postcard" from the island: a colored band with one big sticker, then the message.
  return ok ? (
    <div role="status">
      <div className="relative grid h-44 place-items-center border-b border-black bg-lagoon">
        <StickerArt name="check" className="w-28" rotate={-8} />
        <StickerArt name="sparkle" className="absolute top-6 left-8 w-10" />
        <StickerArt name="sparkle" className="absolute right-10 bottom-6 w-7" rotate={20} />
      </div>
      <div className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
        <h1 style={TITLE_STYLE}>¡Correo verificado!</h1>
        <p className="text-muted-foreground">Tu cuenta está lista.</p>
        <Link href="/vacantes" className="pill pill--dark mt-2">
          <RollText>Ver vacantes</RollText>
        </Link>
      </div>
    </div>
  ) : (
    <div role="alert">
      <div className="grid h-44 place-items-center border-b border-black bg-lavender">
        <span className="grid size-24 rotate-6 place-items-center rounded-full border border-black bg-white text-black shadow-[5px_5px_0_0_#000]">
          <X className="size-12" strokeWidth={2.5} aria-hidden />
        </span>
      </div>
      <div className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
        <h1 style={TITLE_STYLE}>Enlace no válido</h1>
        <p className="max-w-[40ch] text-muted-foreground">
          El enlace expiró o ya se usó. Inicia sesión para pedir uno nuevo.
        </p>
        <Link href="/login" className="pill mt-2">
          <RollText>Iniciar sesión</RollText>
        </Link>
      </div>
    </div>
  )
}

export default function VerifyEmailPage({ searchParams }: PageProps<"/verificar">) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-6">
      <section className="overflow-hidden rounded-[28px] border border-border bg-card text-card-foreground">
        <Suspense fallback={<AuthFormSkeleton className="m-6 h-72" />}>
          <VerifyResult searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  )
}
