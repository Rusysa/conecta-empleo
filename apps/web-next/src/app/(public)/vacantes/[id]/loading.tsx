const BLOCK = "rounded-full bg-foreground/10 motion-safe:animate-pulse"

/** Mirrors the job page: back pill, big title, tags, then the ticket and the description card. */
export default function Loading() {
  return (
    <div className="wrap" aria-busy="true" aria-label="Cargando vacante">
      <p className="sr-only" role="status">
        Cargando vacante…
      </p>
      <div className={`${BLOCK} h-11 w-52`} />
      <div className="mt-8 max-w-6xl space-y-3">
        <div className={`${BLOCK} h-3 w-40`} />
        <div className="h-[clamp(42px,7vw,112px)] w-4/5 rounded-2xl bg-foreground/10 motion-safe:animate-pulse" />
        <div className="h-[clamp(42px,7vw,112px)] w-1/2 rounded-2xl bg-foreground/10 motion-safe:animate-pulse" />
        <div className="flex flex-wrap gap-1.5 pt-3">
          {[180, 120, 110, 130, 170].map((w) => (
            <div key={w} className={`${BLOCK} h-9`} style={{ width: w }} />
          ))}
        </div>
      </div>
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <div className="h-64 rounded-[28px] border border-black bg-sand lg:col-start-2 lg:row-start-1" />
        <div className="space-y-4 rounded-[30px] border border-border bg-card p-6 sm:p-10 lg:col-start-1 lg:row-start-1">
          <div className="h-9 w-48 rounded-xl bg-foreground/10 motion-safe:animate-pulse" />
          {[100, 92, 96, 70].map((w) => (
            <div key={w} className={`${BLOCK} h-4`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
