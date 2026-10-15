import type { Metadata } from "next"

export const metadata: Metadata = { title: "Aviso de privacidad" }

// TODO(legal): placeholder text. Replace with the official notice reviewed under the LFPDPPP.
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Aviso de privacidad</h1>
      <p className="rounded-lg border border-dashed p-3 text-sm">
        Borrador: este texto es un marcador de posición y debe sustituirse por el aviso de
        privacidad oficial antes de publicar el sitio.
      </p>
      <section className="space-y-2">
        <h2>Datos que recabamos</h2>
        <p>
          Nombre, correo electrónico, teléfono, ciudad y CV de los candidatos; y datos de contacto
          de las empresas que publican vacantes.
        </p>
      </section>
      <section className="space-y-2">
        <h2>Finalidad</h2>
        <p>
          Compartir tus datos de contacto y tu CV únicamente con las empresas a cuyas vacantes
          decidas aplicar.
        </p>
      </section>
      <section className="space-y-2">
        <h2>Derechos ARCO</h2>
        <p>
          Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos, así como
          eliminar tu cuenta en cualquier momento.
        </p>
      </section>
    </article>
  )
}
