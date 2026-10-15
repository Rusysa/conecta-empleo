export default function Loading() {
  return (
    <div
      className="mx-auto max-w-6xl space-y-8 px-4 py-8"
      aria-busy="true"
      aria-label="Cargando empresa"
    >
      <div className="flex items-center gap-4">
        <div className="size-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-16 max-w-3xl animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
