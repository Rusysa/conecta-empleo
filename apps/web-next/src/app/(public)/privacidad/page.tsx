import type { Metadata } from "next"

export const metadata: Metadata = { title: "Aviso de privacidad" }

const SECTIONS = [
  {
    title: "Datos que recabamos",
    body: "Nombre, correo electrónico, teléfono, ciudad y CV de los candidatos; y datos de contacto de las empresas que publican vacantes.",
  },
  {
    title: "Finalidad",
    body: "Compartir tus datos de contacto y tu CV únicamente con las empresas a cuyas vacantes decidas aplicar.",
  },
  {
    title: "Derechos ARCO",
    body: "Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos, así como eliminar tu cuenta en cualquier momento.",
  },
]

// TODO(legal): placeholder text. Replace with the official notice reviewed under the LFPDPPP.
export default function PrivacyPage() {
  return (
    <div className="wrap">
      <article className="mx-auto max-w-4xl rounded-[40px] border border-border bg-card px-6 py-10 text-card-foreground sm:px-12 sm:py-14">
        <header className="max-w-[64ch]">
          <p className="label">Legal</p>
          <h1 className="mt-3">Aviso de privacidad</h1>
          {/* Fixed sunburst + black ink: AA in both themes. */}
          <p className="mt-6 rounded-[20px] border border-black bg-sunburst p-4 text-sm font-semibold text-black">
            Borrador: este texto es un marcador de posición y debe sustituirse por el aviso de
            privacidad oficial antes de publicar el sitio.
          </p>
        </header>

        {/* The page's one idea: a numbered island rulebook, each clause tagged in Anton. */}
        <ol className="mt-10 max-w-[64ch] space-y-10">
          {SECTIONS.map((section, i) => (
            <li key={section.title} className="grid gap-x-6 gap-y-2 sm:grid-cols-[4rem_1fr]">
              <span
                className="font-display text-5xl leading-none text-muted-foreground"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <section aria-labelledby={`privacidad-${i}`}>
                <h2 id={`privacidad-${i}`} className="text-xl leading-tight font-bold">
                  {section.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed">{section.body}</p>
              </section>
            </li>
          ))}
        </ol>
      </article>
    </div>
  )
}
