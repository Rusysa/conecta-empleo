export default function Loading() {
  return (
    <div
      className="mx-auto max-w-6xl space-y-6 px-4 py-8"
      aria-busy="true"
      aria-label="Cargando vacantes"
    >
      <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
      <div className="h-24 animate-pulse rounded-xl bg-muted" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  )
}
