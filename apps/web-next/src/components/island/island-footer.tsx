import Link from "next/link"

import { SplitChars } from "@/components/landing/split-chars"

/** Site-wide black footer frame with the big wordmark. */
export function IslandFooter() {
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
              ["/#faq", "Preguntas frecuentes"],
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
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

async function CurrentYear() {
  "use cache"
  return new Date().getFullYear()
}
