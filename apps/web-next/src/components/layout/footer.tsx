import Link from "next/link"


async function CurrentYear() {
  "use cache"
  return new Date().getFullYear()
}


export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <CurrentYear /> Bolsa de Trabajo
        </p>
        <nav aria-label="Pie de página" className="flex gap-4">
          <Link href="/vacantes" className="hover:text-foreground">
            Vacantes
          </Link>
          <Link href="/privacidad" className="hover:text-foreground">
            Aviso de privacidad
          </Link>
        </nav>
      </div>
    </footer>
  )
}
