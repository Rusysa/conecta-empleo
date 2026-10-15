import { LandingArtDefs } from "@/components/landing/landing-art"
import { LandingMotion } from "@/components/landing/landing-motion"

const MARQUEE = [
  "Vacantes en toda la isla",
  "Nuevas vacantes cada semana",
  "Empresas verificadas",
  "Postúlate en un clic",
  "Gratis para candidatos",
]

/**
 * Full-bleed island pages ("/" and "/vacantes"): sticker art, scroll motion and, on the
 * home page, the marquee. The site-wide nav and footer come from the root layout.
 */
export function LandingShell({
  id,
  home = false,
  children,
}: {
  id: string
  home?: boolean
  children: React.ReactNode
}) {
  return (
    <div id={id} className="landing">
      <LandingArtDefs />
      <LandingMotion rootId={id} />

      {home && (
        <div className="marquee" aria-label="Novedades">
          <div className="marquee__track" aria-hidden>
            {Array.from({ length: 4 }, (_, k) =>
              MARQUEE.map((t) => <span key={`${k}-${t}`}>{t}</span>)
            )}
          </div>
          <span className="sr-only">{MARQUEE.join(". ")}</span>
        </div>
      )}

      <div id="top">{children}</div>
    </div>
  )
}
