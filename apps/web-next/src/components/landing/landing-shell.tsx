import { Suspense } from "react"
import Link from "next/link"
import { unstable_rethrow } from "next/navigation"
import { Anton, Inter } from "next/font/google"

import "@/components/landing/landing.css"
import { LandingArtDefs } from "@/components/landing/landing-art"
import { LandingMotion } from "@/components/landing/landing-motion"
import { RollText } from "@/components/landing/roll-text"
import { getSession } from "@/lib/session"

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" })
const inter = Inter({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-inter" })

const MARQUEE = [
  "Vacantes en toda la isla",
  "Nuevas vacantes cada semana",
  "Empresas verificadas",
  "Postúlate en un clic",
  "Gratis para candidatos",
]

const SECTIONS = [
  ["como-funciona", "Cómo funciona"],
  ["categorias", "Categorías"],
  ["vacantes", "Vacantes"],
  ["empresas", "Empresas"],
  ["faq", "FAQ"],
]

/**
 * Shared frame for the public "island" pages ("/" and "/vacantes"): fonts, SVG art,
 * marquee, pill nav and footer. The app navbar/footer are hidden on these routes
 * (see SiteChrome), so this provides the page's own banner and contentinfo.
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
  // On the home page section links scroll in place; elsewhere they go back to "/".
  const sectionHref = (section: string) => (home ? `#${section}` : `/#${section}`)

  return (
    <div id={id} className={`lp ${anton.variable} ${inter.variable}`}>
      <LandingArtDefs />
      <LandingMotion rootId={id} />

      <div className="marquee" aria-label="Novedades">
        <div className="marquee__track" aria-hidden>
          {Array.from({ length: 4 }, (_, k) =>
            MARQUEE.map((t) => <span key={`${k}-${t}`}>{t}</span>)
          )}
        </div>
        <span className="sr-only">{MARQUEE.join(". ")}</span>
      </div>

      {/* Rendered inside the layout's <main>, so the landmark roles are explicit. */}
      <header className="nav" role="banner">
        {home ? (
          <a href="#top" className="logo" aria-label="Inicio">
            B
          </a>
        ) : (
          <Link href="/" className="logo" aria-label="Inicio">
            B
          </Link>
        )}
        <div className="nav__right">
          <nav className="nav__pills" aria-label="Secciones">
            {SECTIONS.map(([section, label]) =>
              home ? (
                <a key={section} className="pill" href={sectionHref(section)}>
                  <RollText>{label}</RollText>
                </a>
              ) : (
                <Link key={section} className="pill" href={sectionHref(section)}>
                  <RollText>{label}</RollText>
                </Link>
              )
            )}
          </nav>
          <Link
            className="pill plus"
            href="/registro?tipo=empresa"
            aria-label="Publicar vacante"
            title="Publicar vacante"
          >
            +
          </Link>
          {/* Stable wrapper: the intro animates it, never the streamed link inside. */}
          <span className="nav__account">
            <Suspense fallback={<LoginPill />}>
              <AccountPill />
            </Suspense>
          </span>
          <Link className="pill pill--dark" href="/vacantes">
            <RollText>
              Buscar <span className="cta-txt">empleo</span>
            </RollText>
          </Link>
        </div>
      </header>

      <div id="top">
        {children}
        <LandingFooter sectionHref={sectionHref} />
      </div>
    </div>
  )
}

/** Nav pill that knows whether someone is signed in (reads cookies, so it streams). */
async function AccountPill() {
  // If the API is unreachable, fall back to "Entrar" instead of failing the whole page.
  const session = await getSession().catch((error: unknown) => {
    unstable_rethrow(error)
    return null
  })
  if (!session) return <LoginPill />
  const candidate = session.role === "CANDIDATE"
  return (
    <Link className="pill" href={candidate ? "/candidato/postulaciones" : "/empresa"}>
      <RollText>{candidate ? "Mi cuenta" : "Mi panel"}</RollText>
    </Link>
  )
}

function LoginPill() {
  return (
    <Link className="pill" href="/login">
      <RollText>Entrar</RollText>
    </Link>
  )
}

function LandingFooter({ sectionHref }: { sectionHref: (section: string) => string }) {
  return (
    <footer className="frame footer" role="contentinfo">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <span className="logo" aria-hidden>
              B
            </span>
            <p className="footer__about">
              La bolsa de trabajo que conecta talento con oportunidades reales en la isla.
            </p>
          </div>
          <FooterColumn
            title="Candidatos"
            links={[
              ["/vacantes", "Buscar vacantes"],
              ["/registro", "Crear perfil"],
              ["/vacantes?q=prácticas", "Prácticas"],
              [sectionHref("faq"), "Preguntas frecuentes"],
            ]}
          />
          <FooterColumn
            title="Empresas"
            links={[
              ["/registro?tipo=empresa", "Publicar vacante"],
              ["/planes", "Planes"],
              ["/login", "Iniciar sesión"],
            ]}
          />
          <FooterColumn title="Legal" links={[["/privacidad", "Aviso de privacidad"]]} />
        </div>
        <div className="footer__big js-foot" aria-hidden>
          <SplitChars text="Bolsa de trabajo" />
        </div>
        <div className="footer__bottom">
          <span>
            © <CurrentYear /> Bolsa de Trabajo. Todos los derechos reservados.
          </span>
          <span>Hecho con ✦ para nuestra comunidad</span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h2 className="label">{title}</h2>
      <ul>
        {links.map(([href, label]) => (
          <li key={href}>
            {href.startsWith("#") ? <a href={href}>{label}</a> : <Link href={href}>{label}</Link>}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Splits text into per-character masks; `copies` stacks repeats for the slot-machine roll. */
export function SplitChars({ text, copies = 1 }: { text: string; copies?: number }) {
  return [...text].map((c, i) => {
    const char = c === " " ? " " : c
    return (
      <span key={i} className="ch">
        <span>
          {copies === 1 ? char : Array.from({ length: copies }, (_, k) => <i key={k}>{char}</i>)}
        </span>
      </span>
    )
  })
}

async function CurrentYear() {
  "use cache"
  return new Date().getFullYear()
}
