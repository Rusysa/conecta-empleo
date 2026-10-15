import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function JobsPagination({
  page,
  pageCount,
  hrefForPage,
}: {
  page: number
  pageCount: number
  hrefForPage: (page: number) => string
}) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={hrefForPage(page - 1)}>
            <ChevronLeft /> Anterior
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft /> Anterior
        </Button>
      )}
      <span className="px-2 text-sm text-muted-foreground">
        Página {page} de {pageCount}
      </span>
      {page < pageCount ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={hrefForPage(page + 1)}>
            Siguiente <ChevronRight />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Siguiente <ChevronRight />
        </Button>
      )}
    </nav>
  )
}
