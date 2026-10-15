import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Form from "next/form"
import { unstable_rethrow } from "next/navigation"
import { Anton, Inter } from "next/font/google"

import "@/components/landing/landing.css"
import {
  ApplyArt,
  CATEGORY_ICONS,
  HeroRibbon,
  JobsArt,
  LandingArtDefs,
  Sticker,
  vars,
} from "@/components/landing/landing-art"
import { LandingJobs, type LandingJob } from "@/components/landing/landing-jobs"
import { LandingMotion } from "@/components/landing/landing-motion"
import { RollText } from "@/components/landing/roll-text"
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "@/lib/constants"
import { formatSalary } from "@/lib/format"
import { WORK_MODE_SLUGS } from "@/lib/job-search-params"
import { getSession } from "@/lib/session"
import { getRecentJobs } from "@/server/queries/jobs"

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" })
const inter = Inter({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: { absolute: "Bolsa de Trabajo" },
  description:
    "Encuentra tu próximo trabajo o contrata al mejor talento. Vacantes reales, empresas verificadas y postulación en un clic.",
}

const ROOT_ID = "landing"
const MARQUEE = [
  "Nuevas vacantes cada semana",
  "Empresas verificadas",
  "Postúlate en un clic",
  "Gratis para candidatos",
  "Sigue tu proceso en línea",
]
const LOGOS = [
  ["Nexo", "#fff"],
  ["Arca", "#ffd731"],
  ["Vértice", "#fff"],
  ["Pulso", "#e9ccff"],
  ["Norte", "#fff"],
  ["Cubo", "#55db9c"],
  ["Órbita", "#fff"],
  ["Faro", "#4da2ff"],
]
const JOB_COLORS = ["#4da2ff", "#e9ccff", "#ffd731", "#55db9c", "#fb4903", "#5c4ade"]
const NEW_JOB_DAYS = 7

const CATEGORIES: {
  title: string[]
  href: string
  color: string
  dark?: boolean
  icon: keyof typeof CATEGORY_ICONS
}[] = [
  {
    title: ["Tecnología"],
    href: "/vacantes?q=desarrollador",
    color: "var(--color-electric-blue)",
    icon: "tech",
  },
  {
    title: ["Ventas y", "marketing"],
    href: "/vacantes?q=ventas",
    color: "var(--color-lavender)",
    icon: "sales",
  },
  {
    title: ["Adminis­tración"],
    href: "/vacantes?q=administrativo",
    color: "var(--color-sunburst)",
    icon: "admin",
  },
  { title: ["Salud"], href: "/vacantes?q=salud", color: "var(--color-mint-pop)", icon: "health" },
  {
    title: ["Ingeniería"],
    href: "/vacantes?q=ingeniero",
    color: "var(--color-ember)",
    dark: true,
    icon: "engineering",
  },
  {
    title: ["Diseño y", "creatividad"],
    href: "/vacantes?q=diseño",
    color: "var(--color-voltage-violet)",
    dark: true,
    icon: "design",
  },
  {
    title: ["Prácticas", "profesionales"],
    href: "/vacantes?q=prácticas",
    color: "var(--color-paper-white)",
    icon: "internship",
  },
  {
    title: ["100%", "remoto"],
    href: "/vacantes?modalidad=remoto",
    color: "var(--color-concrete-gray)",
    icon: "remote",
  },
]

const WORK_MODE_SLUG_BY_MODE = Object.fromEntries(
  Object.entries(WORK_MODE_SLUGS).map(([slug, mode]) => [mode, slug])
)

async function getLandingJobs(): Promise<LandingJob[]> {
  // The landing has no app navbar, so a failed fetch must not reach the root error page.
  const jobs = await getRecentJobs(9).catch((error: unknown) => {
    unstable_rethrow(error) // let Next.js prerender/dynamic signals through
    console.error("Landing: could not load recent jobs", error)
    return []
  })
  const now = Date.now()
  return jobs.map((job, i) => {
    const isNew =
      job.publishedAt != null && now - job.publishedAt.getTime() < NEW_JOB_DAYS * 86_400_000
    return {
      id: job.id,
      title: job.title,
      company: job.company.name,
      location:
        job.workMode === "REMOTE" ? "Remoto" : (job.location ?? job.company.location ?? "México"),
      filters: [
        WORK_MODE_SLUG_BY_MODE[job.workMode],
        ...(job.employmentType === "INTERNSHIP" ? ["practicas"] : []),
      ],
      tags: [WORK_MODE_LABELS[job.workMode], EMPLOYMENT_TYPE_LABELS[job.employmentType]],
      pay: formatSalary(job.salaryMin, job.salaryMax, job.currency),
      initial: job.company.name.charAt(0).toUpperCase(),
      color: JOB_COLORS[i % JOB_COLORS.length],
      badge: job.featured ? "Destacada" : isNew ? "Nueva" : null,
    }
  })
}

async function FeaturedJobs() {
  return <LandingJobs jobs={await getLandingJobs()} />
}

/** Nav pill that knows whether someone is signed in (reads cookies, so it streams). */
async function AccountPill() {
  // If the API is unreachable, fall back to "Entrar" instead of failing the whole landing.
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

/** Heading whose lines slide up on scroll (`<br>`-separated in the original). */
function Lines({
  lines,
  as: Tag = "h2",
  className,
}: {
  lines: string[]
  as?: "h2" | "h3"
  className?: string
}) {
  return (
    <Tag className={`${className ?? ""} js-lines`} aria-label={lines.join(" ")}>
      {lines.map((line) => (
        <span key={line} className="line" aria-hidden>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

/** Feature heading whose characters fill from gray to black while scrolling. */
function FillHeading({ lines }: { lines: string[] }) {
  return (
    <h3 className="display js-fill" aria-label={lines.join(" ")}>
      {lines.map((line, l) => (
        <span key={line} aria-hidden>
          {l > 0 && <br />}
          {[...line].map((c, i) => (
            <span key={i} className="c">
              {c === " " ? " " : c}
            </span>
          ))}
        </span>
      ))}
    </h3>
  )
}

function SplitChars({ text, copies = 1 }: { text: string; copies?: number }) {
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

export default function HomePage() {
  return (
    <div id={ROOT_ID} className={`lp ${anton.variable} ${inter.variable}`}>
      <LandingArtDefs />
      <LandingMotion rootId={ROOT_ID} />

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
        <a href="#top" className="logo" aria-label="Inicio">
          B
        </a>
        <div className="nav__right">
          <nav className="nav__pills" aria-label="Secciones">
            {[
              ["#como-funciona", "Cómo funciona"],
              ["#categorias", "Categorías"],
              ["#vacantes", "Vacantes"],
              ["#empresas", "Empresas"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a key={href} className="pill" href={href}>
                <RollText>{label}</RollText>
              </a>
            ))}
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
        {/* ================= HERO ================= */}
        <section className="frame bg-sky hero" id="hero">
          <HeroRibbon />
          <div className="wrap hero__inner">
            <h1 className="display hero__title" aria-label="Trabajo">
              <span className="js-roll" aria-hidden>
                <SplitChars text="TRABAJO" copies={4} />
              </span>
              <span
                className="stk js-pop"
                data-speed="-0.25"
                style={vars({ left: "-7%", top: "-4%", width: "15%", "--r": "-18deg" })}
              >
                <Sticker name="rocket" />
              </span>
              <span
                className="stk js-pop"
                data-speed="0.2"
                style={vars({ left: "48%", top: "12%", width: "13%", "--r": "12deg" })}
              >
                <Sticker name="coin" />
              </span>
              <span
                className="stk js-pop"
                data-speed="-0.15"
                style={vars({ right: "-8%", top: "44%", width: "16%", "--r": "-14deg" })}
              >
                <Sticker name="case" />
              </span>
              <span
                className="stk js-pop"
                data-speed="0.3"
                style={vars({ left: "-6%", top: "58%", width: "14%", "--r": "10deg" })}
              >
                <Sticker name="check" />
              </span>
            </h1>
            <p className="hero__tag js-fade">Tu talento. En movimiento.</p>

            <Form action="/vacantes" className="search js-fade" role="search">
              <label>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4" />
                </svg>
                <input
                  type="search"
                  name="q"
                  placeholder="Puesto, habilidad o empresa"
                  aria-label="Puesto"
                />
              </label>
              <label>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <input type="text" name="ciudad" placeholder="Ciudad" aria-label="Ciudad" />
              </label>
              <button className="pill pill--dark" type="submit">
                <RollText>Buscar vacantes</RollText>
              </button>
            </Form>
            <div className="hero__actions js-fade">
              <Link className="pill" href="/registro">
                <RollText>Crear mi perfil</RollText>
              </Link>
              <Link className="pill" href="/registro?tipo=empresa">
                <RollText>Publicar una vacante</RollText>
              </Link>
            </div>
          </div>

          {/* mockup stage (scales on scroll) */}
          <div className="stage" id="stage" aria-hidden>
            <div className="phone js-phone" data-rot="-14deg">
              <div className="phone__scr">
                <div className="phone__bar">
                  <span>9:41</span>
                  <span>●●● ▮</span>
                </div>
                <div className="phone__search">⌕ Buscar puesto o empresa</div>
                <div className="phone__h">Vacantes</div>
                <div className="phone__chips">
                  <span>Todas</span>
                  <span>Remoto</span>
                  <span>Prácticas</span>
                  <span>Medio tiempo</span>
                </div>
                <PhoneJob
                  initial="N"
                  color="#4da2ff"
                  title="Frontend Jr."
                  meta="Nexo Digital · Híbrido"
                />
                <PhoneJob
                  initial="P"
                  color="#e9ccff"
                  title="Practicante Marketing"
                  meta="Pulso · Remoto"
                />
                <PhoneJob
                  initial="A"
                  color="#ffd731"
                  title="Ejecutivo de Ventas"
                  meta="Arca · Presencial"
                />
                <PhoneJob
                  initial="V"
                  color="#55db9c"
                  title="Analista de Datos"
                  meta="Vértice · Remoto"
                />
                <PhoneTabs />
              </div>
            </div>
            <div className="phone js-phone" data-rot="12deg">
              <div className="phone__scr">
                <div className="phone__bar">
                  <span>9:41</span>
                  <span>●●● ▮</span>
                </div>
                <div className="pbig">
                  <small>Tus postulaciones</small>
                  <strong>12 activas</strong>
                  <small style={{ color: "#55db9c" }}>+3 esta semana</small>
                </div>
                <div className="pbtns">
                  <span>Enviadas</span>
                  <span>Vistas</span>
                  <span>Entrevista</span>
                </div>
                <PhoneJob
                  initial="✓"
                  color="#55db9c"
                  title="Entrevista agendada"
                  meta="Vértice · Jue 10:00"
                />
                <PhoneJob
                  initial="◔"
                  color="#ffd731"
                  title="CV visto"
                  meta="Órbita Studio · hace 2h"
                />
                <PhoneJob
                  initial="→"
                  color="#e9ccff"
                  title="Postulación enviada"
                  meta="Norte Corp. · ayer"
                />
                <PhoneTabs />
              </div>
            </div>
          </div>

          {/* kinetic statement */}
          <div className="kinetic">
            <p className="sr-only">Todas las vacantes, todo tu talento, en un solo lugar.</p>
            <div className="krow display" data-x="-8" aria-hidden>
              <span className="gray">Todas</span>
              <span className="kstk js-kpop">
                <Sticker name="coin" />
              </span>
              <span className="skew">las vacantes</span>
            </div>
            <div className="krow display" data-x="10">
              <span className="kstk js-kpop" aria-hidden>
                <Sticker name="check" />
              </span>
              <span aria-hidden>todo tu</span>
              <Link className="kcard js-kpop" href="/registro">
                <span className="kcard__panel" aria-hidden>
                  <Sticker name="cv" />
                </span>
                <span className="kcard__txt">Sube tu CV →</span>
              </Link>
            </div>
            <div className="krow display" data-x="-6" aria-hidden>
              <span className="skew">en un solo lugar</span>
              <span className="kstk js-kpop" style={{ width: ".9em" }}>
                <Sticker name="case" />
              </span>
            </div>
          </div>
        </section>

        {/* ================= CÓMO FUNCIONA ================= */}
        <section className="frame bg-white section" id="como-funciona">
          <div className="wrap">
            <Lines lines={["Tu atajo al empleo."]} className="lead" />

            <div className="feats">
              <article className="feat">
                <div className="feat__art" style={{ background: "var(--color-mint-pop)" }}>
                  <JobsArt />
                </div>
                <div>
                  <FillHeading lines={["Encuentra", "tu vacante"]} />
                  <p className="js-fade-up">
                    Explora oportunidades de tiempo completo, medio tiempo, prácticas y remoto. Sin
                    registrarte para mirar.
                  </p>
                  <Link className="pill pill--dark js-fade-up" href="/vacantes">
                    <RollText>Ver vacantes ↗</RollText>
                  </Link>
                </div>
              </article>

              <article className="feat feat--rev">
                <div className="feat__art" style={{ background: "var(--color-lavender)" }}>
                  <ApplyArt />
                </div>
                <div>
                  <FillHeading lines={["Postúlate", "en un clic"]} />
                  <p className="js-fade-up">
                    Tu perfil viaja contigo. Envía tu postulación en segundos, sin formularios
                    eternos ni registros repetidos.
                  </p>
                </div>
              </article>

              <article className="feat">
                <div className="feat__art" style={{ background: "var(--color-electric-blue)" }}>
                  <div
                    className="feat__inner js-par"
                    style={{ display: "grid", placeItems: "center" }}
                  >
                    <svg
                      viewBox="0 0 600 600"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                      aria-hidden
                    >
                      <path
                        d="M-40 240 C 140 120, 300 420, 640 200 L640 330 C 300 540, 140 260, -40 380 Z"
                        fill="#c4e0ff"
                      />
                    </svg>
                    <div
                      className="phone"
                      style={{ width: "46%", position: "relative", transform: "translateY(14%)" }}
                      aria-hidden
                    >
                      <div className="phone__scr">
                        <div className="phone__bar">
                          <span>9:41</span>
                          <span>●●● ▮</span>
                        </div>
                        <div className="phone__chips">
                          <span>Proceso</span>
                          <span>Mensajes</span>
                          <span>Docs</span>
                        </div>
                        <div className="pbig">
                          <small>Analista de datos</small>
                          <strong>En entrevista</strong>
                          <small style={{ color: "#55db9c" }}>Paso 3 de 4</small>
                        </div>
                        <PhoneJob
                          initial="✓"
                          color="#55db9c"
                          title="Postulación enviada"
                          meta="Lun 9:12"
                        />
                        <PhoneJob
                          initial="✓"
                          color="#55db9c"
                          title="CV revisado"
                          meta="Mar 16:40"
                        />
                        <PhoneJob initial="●" color="#ffd731" title="Entrevista" meta="Jue 10:00" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <FillHeading lines={["Sigue tu", "proceso"]} />
                  <p className="js-fade-up">
                    Consulta el estado de cada postulación: enviada, vista, en proceso o finalizada.
                  </p>
                  <Link className="pill js-fade-up" href="/candidato/postulaciones">
                    <RollText>Mis postulaciones ↗</RollText>
                  </Link>
                </div>
              </article>
            </div>

            <div className="stats">
              <Stat to={1200} suffix="+" label="Vacantes activas" />
              <Stat to={350} label="Empresas aliadas" />
              <Stat to={8500} label="Candidatos registrados" />
              <Stat to={72} suffix="h" label="Respuesta promedio" />
            </div>
          </div>
        </section>

        {/* ================= CATEGORÍAS ================= */}
        <section className="frame bg-sky section" id="categorias">
          <div className="wrap">
            <div className="sec-head">
              <Lines lines={["Explora", "por área"]} className="display h-d" />
              <p className="js-fade-up">
                Desde tu primera práctica profesional hasta tu siguiente gran paso.
              </p>
            </div>
            <div className="cats js-stagger">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  className="cat"
                  href={cat.href}
                  style={{ background: cat.color, color: cat.dark ? "#fff" : undefined }}
                >
                  <div className="cat__top">
                    <svg className="cat__icon" viewBox="0 0 56 56" aria-hidden>
                      {CATEGORY_ICONS[cat.icon]}
                    </svg>
                  </div>
                  <h3>
                    {cat.title.map((line, i) => (
                      <span key={line}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= VACANTES ================= */}
        <section className="frame bg-white section" id="vacantes">
          <div className="wrap">
            <div className="sec-head">
              <Lines lines={["Vacantes", "destacadas"]} className="display h-d" />
              <p className="js-fade-up">
                Las oportunidades más recientes de empresas que publican con nosotros.
              </p>
            </div>
            <Suspense fallback={<p className="jobs__empty">Cargando vacantes…</p>}>
              <FeaturedJobs />
            </Suspense>
            <div className="jobs__more">
              <Link className="pill pill--dark pill--lg" href="/vacantes">
                <RollText>Ver todas las vacantes ↗</RollText>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= PASOS ================= */}
        <section className="frame bg-sky section">
          <div className="wrap">
            <div className="sec-head">
              <Lines lines={["Así de", "fácil"]} className="display h-d" />
              <p className="js-fade-up">Tres pasos separan tu búsqueda de tu primera entrevista.</p>
            </div>
            <div className="steps js-stagger">
              <Step
                n="01"
                color="var(--color-lavender)"
                sticker="cv"
                tilt="10deg"
                title="Crea tu perfil"
              >
                Regístrate gratis, completa tus datos y agrega tu CV.
              </Step>
              <Step
                n="02"
                color="var(--color-mint-pop)"
                sticker="coin"
                tilt="-8deg"
                title="Postúlate en un clic"
              >
                Filtra por ciudad y modalidad. Envía tu postulación sin complicaciones.
              </Step>
              <Step
                n="03"
                color="var(--color-sunburst)"
                sticker="star"
                tilt="12deg"
                title="Consigue el empleo"
              >
                Da seguimiento a cada proceso y recibe respuesta directa de las empresas.
              </Step>
            </div>
          </div>
        </section>

        {/* ================= EMPRESAS ================= */}
        <section className="frame bg-gray section" id="empresas">
          <span
            className="stk js-pop hide-sm"
            data-speed="-0.2"
            style={vars({ right: "5%", top: "70px", width: "150px", "--r": "14deg" })}
          >
            <Sticker name="rocket" />
          </span>
          <div className="wrap">
            <div className="biz">
              <div>
                <span className="pill pill--sm biz__badge js-fade-up">Para empresas</span>
                <Lines lines={["Contrata", "talento", "real"]} className="display" />
                <div className="biz__cta js-fade-up">
                  <Link className="pill pill--dark pill--lg" href="/registro?tipo=empresa">
                    <RollText>Publicar una vacante</RollText>
                  </Link>
                  <Link className="pill pill--lg" href="/planes">
                    <RollText>Ver planes</RollText>
                  </Link>
                </div>
              </div>
              <div className="biz__list js-stagger">
                <BizItem mark="✓" color="var(--color-mint-pop)" title="Publica gratis">
                  Tu vacante en línea en menos de 10 minutos.
                </BizItem>
                <BizItem mark="⌕" color="var(--color-electric-blue)" title="Filtra candidatos">
                  Revisa postulantes por estado y exporta la lista a CSV.
                </BizItem>
                <BizItem mark="✉" color="var(--color-lavender)" title="Contacta directo">
                  Recibes nombre, correo, teléfono y CV de cada postulante.
                </BizItem>
                <BizItem mark="★" color="var(--color-ember)" light title="Empresa verificada">
                  Una insignia que genera confianza en los candidatos.
                </BizItem>
              </div>
            </div>
          </div>
          <div className="logos" aria-hidden>
            <div className="logos__track">
              {[0, 1].map((k) =>
                LOGOS.map(([name, bg]) => (
                  <span key={`${k}-${name}`} style={{ background: bg }}>
                    {name}
                  </span>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIOS ================= */}
        <section className="frame bg-white section">
          <div className="wrap">
            <div className="sec-head">
              <Lines lines={["Historias", "reales"]} className="display h-d" />
              <p className="js-fade-up">
                Personas que encontraron su lugar a través de nuestra bolsa de trabajo.
              </p>
            </div>
            <div className="quotes js-stagger">
              <Quote
                bg="var(--color-sky-wash)"
                avatarBg="var(--color-sunburst)"
                initials="AM"
                name="Andrea M."
                role="Analista de datos"
              >
                “Encontré mis prácticas en una semana. Hoy ya tengo contrato de tiempo completo en
                la misma empresa.”
              </Quote>
              <Quote
                bg="var(--color-lavender)"
                avatarBg="var(--color-mint-pop)"
                initials="RL"
                name="Ricardo L."
                role="Reclutamiento, Grupo Nexo"
              >
                “Publicamos tres vacantes y en 48 horas teníamos candidatos con el perfil exacto que
                buscábamos.”
              </Quote>
              <Quote
                bg="var(--color-mint-pop)"
                avatarBg="var(--color-lavender)"
                initials="JP"
                name="José P."
                role="Ejecutivo de ventas"
              >
                “Subí mi CV, me postulé desde el celular y me llamaron al día siguiente.”
              </Quote>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="frame bg-sky section" id="faq">
          <div className="wrap">
            <div className="sec-head" style={{ justifyContent: "center", textAlign: "center" }}>
              <Lines lines={["Preguntas", "frecuentes"]} className="display h-d" />
            </div>
            <div className="faq js-stagger">
              <Faq open question="¿Tiene algún costo para los candidatos?">
                No. Registrarte, crear tu perfil y postularte a cualquier vacante es completamente
                gratis.
              </Faq>
              <Faq question="¿Cómo sé que las vacantes son reales?">
                Las empresas pasan por un proceso de verificación y las vacantes se revisan antes de
                publicarse.
              </Faq>
              <Faq question="¿Hay vacantes para estudiantes sin experiencia?">
                Sí. Puedes filtrar prácticas profesionales y vacantes de primer empleo.
              </Faq>
              <Faq question="¿Cómo publico una vacante como empresa?">
                Crea una cuenta de empresa, completa tu perfil y publica tu vacante desde tu panel.
              </Faq>
              <Faq question="¿Puedo dar seguimiento a mis postulaciones?">
                Claro. En “Mis postulaciones” verás el estado de cada proceso: enviada, vista, en
                proceso o finalizada.
              </Faq>
            </div>
          </div>
        </section>

        {/* ================= CTA FINAL + FOOTER ================= */}
        <section className="frame bg-white">
          <div className="final wrap">
            <Lines lines={["Busca, postúlate y crece —sin complicaciones"]} className="lead" />
            <div className="final__cta js-fade-up">
              <Link className="pill pill--lg" href="/registro">
                <RollText>Crear mi perfil gratis</RollText>
              </Link>
              <Link className="pill pill--lg" href="/registro?tipo=empresa">
                <RollText>Soy empresa</RollText>
              </Link>
            </div>
          </div>
        </section>

        <footer className="frame footer" role="contentinfo">
          <div className="wrap">
            <div className="footer__grid">
              <div>
                <span className="logo" aria-hidden>
                  B
                </span>
                <p className="footer__about">
                  La bolsa de trabajo que conecta talento con oportunidades reales.
                </p>
              </div>
              <FooterColumn
                title="Candidatos"
                links={[
                  ["/vacantes", "Buscar vacantes"],
                  ["/registro", "Crear perfil"],
                  ["/vacantes?q=prácticas", "Prácticas"],
                  ["#faq", "Preguntas frecuentes"],
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
      </div>
    </div>
  )
}

async function CurrentYear() {
  "use cache"
  return new Date().getFullYear()
}

function PhoneJob({
  initial,
  color,
  title,
  meta,
}: {
  initial: string
  color: string
  title: string
  meta: string
}) {
  return (
    <div className="pjob">
      <i style={{ background: color }}>{initial}</i>
      <div>
        <b>{title}</b>
        <small>{meta}</small>
      </div>
    </div>
  )
}

function PhoneTabs() {
  return (
    <div className="ptab">
      <span>Inicio</span>
      <span>Buscar</span>
      <span>Postulaciones</span>
      <span>Perfil</span>
    </div>
  )
}

function Stat({ to, suffix, label }: { to: number; suffix?: string; label: string }) {
  return (
    <div className="stat">
      <div className="stat__n">
        <span className="js-count" data-to={to}>
          {to.toLocaleString("es-MX")}
        </span>
        {suffix}
      </div>
      <div className="stat__l label">{label}</div>
    </div>
  )
}

function Step({
  n,
  color,
  sticker,
  tilt,
  title,
  children,
}: {
  n: string
  color: string
  sticker: "cv" | "coin" | "star"
  tilt: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="step" style={{ background: color }}>
      <span className="stk js-pop" style={vars({ "--r": tilt })}>
        <Sticker name={sticker} />
      </span>
      <div className="step__n" aria-hidden>
        {n}
      </div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  )
}

function BizItem({
  mark,
  color,
  light,
  title,
  children,
}: {
  mark: string
  color: string
  light?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="biz__item">
      <span
        className="dot"
        style={{ background: color, color: light ? "#fff" : undefined }}
        aria-hidden
      >
        {mark}
      </span>
      <div>
        <strong>{title}</strong>
        {children}
      </div>
    </div>
  )
}

function Quote({
  bg,
  avatarBg,
  initials,
  name,
  role,
  children,
}: {
  bg: string
  avatarBg: string
  initials: string
  name: string
  role: string
  children: React.ReactNode
}) {
  return (
    <figure className="quote" style={{ background: bg }}>
      <p>{children}</p>
      <figcaption className="quote__who">
        <span className="avatar" style={{ background: avatarBg }} aria-hidden>
          {initials}
        </span>
        <span>
          <strong>{name}</strong>
          <br />
          {role}
        </span>
      </figcaption>
    </figure>
  )
}

function Faq({
  question,
  open,
  children,
}: {
  question: string
  open?: boolean
  children: React.ReactNode
}) {
  return (
    <details open={open}>
      <summary>
        {question}
        <span className="pill plus" aria-hidden>
          +
        </span>
      </summary>
      <p>{children}</p>
    </details>
  )
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
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
