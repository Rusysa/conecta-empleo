const BLOCK = "rounded-full bg-foreground/10 motion-safe:animate-pulse"

/** Mirrors the company page: logo sticker and title, then a panel of job cards. */
export default function Loading() {
  return (
    <div className="wrap" aria-busy="true" aria-label="Cargando empresa">
      <p className="sr-only" role="status">
        Cargando empresa…
      </p>
      <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10">
        <div className="size-28 -rotate-6 rounded-[32px] border border-border bg-lavender sm:size-40" />
        <div className="space-y-3">
          <div className={`${BLOCK} h-3 w-36`} />
          <div className="h-[clamp(40px,6vw,84px)] w-3/4 max-w-xl rounded-2xl bg-foreground/10 motion-safe:animate-pulse" />
          <div className="flex flex-wrap gap-1.5 pt-2">
            {[110, 150, 140].map((w) => (
              <div key={w} className={`${BLOCK} h-8`} style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 rounded-[30px] border border-border bg-card p-4 sm:p-8">
        <div className="mb-6 h-10 w-64 rounded-xl bg-foreground/10 motion-safe:animate-pulse" />
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="min-h-[290px] rounded-[20px] border border-black bg-white p-6 motion-safe:animate-pulse"
            >
              <div className="size-14 rounded-2xl border border-black bg-black/10" />
              <div className="mt-6 h-6 w-3/4 rounded-full bg-black/10" />
              <div className="mt-3 h-4 w-1/2 rounded-full bg-black/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
