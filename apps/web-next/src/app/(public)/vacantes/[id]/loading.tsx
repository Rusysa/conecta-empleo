export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8" aria-busy="true" aria-label="Cargando vacante">
      <div className="h-7 w-36 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="h-9 w-2/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-1/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  )
}
