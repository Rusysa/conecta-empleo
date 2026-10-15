import Link from "next/link"
import { Check, CircleAlert } from "lucide-react"

import { Sticker, type StickerName } from "@/components/landing/landing-art"
import { RollText } from "@/components/landing/roll-text"
import { cn } from "@/lib/utils"

/*
 * Island layout shared by the auth screens: a white form card next to a colored
 * "island" panel (sand, lagoon or lavender) with one big line and a couple of stickers.
 * The panel fills are fixed light colors in both themes, so its ink is always black.
 */

/** Taller, rounder inputs for the auth forms. */
export const authInputClass = "h-11 rounded-xl px-3.5"

/** Inline text links ("¿Olvidaste tu contraseña?", "aviso de privacidad"). */
export const authLinkClass =
  "rounded-sm font-semibold text-foreground underline decoration-lagoon decoration-2 underline-offset-4 transition-colors hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/** Primary submit button sizing (shadcn Button is already an uppercase pill). */
export const authSubmitClass = "h-12 w-full text-[13px]"

const TONES = {
  sand: "bg-sand",
  lagoon: "bg-lagoon",
  lavender: "bg-lavender",
} as const

/** Fixed size for a sticker symbol (the symbols keep their own aspect ratio). */
export function StickerArt({
  name,
  className,
  rotate = 0,
}: {
  name: StickerName
  className?: string
  rotate?: number
}) {
  return (
    <span
      className={cn(
        "pointer-events-none block [&>svg]:size-full [&>svg]:overflow-visible",
        className
      )}
      style={{ rotate: `${rotate}deg` }}
      aria-hidden
    >
      <Sticker name={name} />
    </span>
  )
}

export type IslandPanelProps = {
  tone: keyof typeof TONES
  kicker: string
  line: string
  points?: string[]
  stickers: { name: StickerName; className: string; rotate?: number }[]
}

/** Decorative side panel: the one memorable idea of each auth screen. */
export function IslandPanel({ tone, kicker, line, points, stickers }: IslandPanelProps) {
  return (
    <aside
      className={cn(
        "relative flex flex-col justify-between gap-8 overflow-hidden rounded-[28px] border border-black p-6 text-black sm:p-10 md:min-h-[460px]",
        TONES[tone]
      )}
    >
      <div className="relative z-10 max-w-[30ch] pr-16 sm:pr-24">
        <p className="label inline-flex rounded-full border border-black bg-white px-3 py-1.5">
          {kicker}
        </p>
        <p className="display mt-5 text-[clamp(2.1rem,4vw,3.4rem)] text-balance">{line}</p>
      </div>
      {points && points.length > 0 && (
        <ul className="relative z-10 grid max-w-[34ch] gap-2.5 text-[15px] font-semibold">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-black text-white">
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </span>
              {point}
            </li>
          ))}
        </ul>
      )}
      {stickers.map((sticker) => (
        <StickerArt
          key={sticker.name + sticker.className}
          name={sticker.name}
          rotate={sticker.rotate}
          className={cn("absolute", sticker.className)}
        />
      ))}
    </aside>
  )
}

/** Two-column auth composition: form card (with the page's only h1) + island panel. */
export function AuthShell({
  kicker,
  title,
  description,
  panel,
  children,
}: {
  kicker: string
  title: string
  description: string
  panel: IslandPanelProps
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-6">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <section
          aria-labelledby="auth-title"
          className="rounded-[28px] border border-border bg-card p-6 text-card-foreground sm:p-10"
        >
          <p className="label text-muted-foreground">{kicker}</p>
          <h1 id="auth-title" className="mt-3" style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}>
            {title}
          </h1>
          <p className="mt-3 text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </section>
        <IslandPanel {...panel} />
      </div>
    </div>
  )
}

/** Form-level error (the request failed), announced to screen readers. */
export function AuthAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-destructive bg-destructive/10 p-3.5 text-sm font-semibold text-foreground"
    >
      <CircleAlert className="mt-px size-5 shrink-0 text-destructive" aria-hidden />
      <p>{children}</p>
    </div>
  )
}

/** Bottom row that switches between auth screens ("¿No tienes cuenta?" → Regístrate). */
export function AuthSwitch({
  question,
  href,
  cta,
}: {
  question: string
  href: string
  cta: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border pt-6">
      <p className="text-sm font-semibold text-muted-foreground">{question}</p>
      <Link href={href} className="pill pill--sm">
        <RollText>{cta}</RollText>
      </Link>
    </div>
  )
}

/** Loading placeholder while a Suspense boundary resolves searchParams. */
export function AuthFormSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted", className)} aria-busy="true" />
}
