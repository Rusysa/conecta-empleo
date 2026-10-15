import { cn } from "@/lib/utils"

/*
 * Island building blocks shared by the company area and the admin area.
 * Theme-aware surfaces use the tokens (card, border, secondary); fixed island
 * colors (sand, lavender, lagoon…) always carry black ink so they read in both themes.
 */

/** Fixed island fills (black ink on all of them passes AA). */
export const ISLAND_FILL = {
  sand: "bg-sand",
  lavender: "bg-lavender",
  lagoon: "bg-lagoon",
  sunburst: "bg-sunburst",
  mint: "bg-mint",
  ember: "bg-ember",
  // Soft mist has no theme token; it matches the candidate area's "Descartada" chip.
  mist: "bg-mist",
} as const

export type IslandFill = keyof typeof ISLAND_FILL

/** Base class for the small uppercase status chips (applications and jobs). */
export const CHIP_BASE =
  "inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full border px-2.5 text-[11px] leading-none font-bold tracking-[0.05em] whitespace-nowrap uppercase [&>svg]:size-3"

/** A chip on a fixed island fill: black ink and outline. */
export function fillChip(fill: IslandFill) {
  return cn(CHIP_BASE, ISLAND_FILL[fill], "border-black text-black")
}

/** A chip with no fill: inherits the theme ink. */
export const OUTLINE_CHIP = cn(CHIP_BASE, "border-foreground bg-transparent text-foreground")

/**
 * Page heading: small uppercase eyebrow, the island display h1 (styled by `.isle-frame h1`),
 * an optional lead, a slot next to the title (e.g. a status chip) and actions on the right.
 */
export function PanelHeader({
  eyebrow,
  title,
  description,
  aside,
  actions,
  compact = false,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  aside?: React.ReactNode
  actions?: React.ReactNode
  /** Smaller title for long, data-driven headings such as a job title. */
  compact?: boolean
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0 space-y-3">
        {eyebrow && (
          <p className="text-xs font-bold tracking-[0.08em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1
            className="break-words"
            style={compact ? { fontSize: "clamp(32px, 4.6vw, 60px)" } : undefined}
          >
            {title}
          </h1>
          {aside}
        </div>
        {description && (
          <p className="max-w-prose text-base text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

/** Section title inside a page: Anton, uppercase, smaller than the h1. */
export function SectionTitle({
  id,
  children,
  className,
}: {
  id?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      id={id}
      className={cn(
        "font-display text-2xl leading-none tracking-normal uppercase sm:text-3xl",
        className
      )}
    >
      {children}
    </h2>
  )
}

/** Outlined rounded surface. Tables inside scroll horizontally within it on small screens. */
export function IslandPanel({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** Classes for <TableHeader>: sand band with small uppercase labels. */
export const TABLE_HEAD =
  "bg-secondary text-secondary-foreground [&_th]:h-11 [&_th]:px-4 [&_th]:text-[11px] [&_th]:font-bold [&_th]:tracking-[0.06em] [&_th]:text-secondary-foreground [&_th]:uppercase"

/** Classes for <TableBody>: roomier cells and soft row dividers. */
export const TABLE_BODY =
  "[&_td]:px-4 [&_td]:py-3 [&_tr]:border-foreground/15 [&_tr:hover]:bg-muted/40"

/** Loading placeholder with the island outline. */
export function PanelSkeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-[20px] border border-border/40 bg-card/60", className)}
      {...props}
    />
  )
}

/** Empty state: sand card with black ink (fixed colors, readable in both themes). */
export function IslandEmpty({
  title,
  description,
  icon,
  action,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid justify-items-start gap-4 rounded-[32px] border border-border p-8 text-black sm:p-12",
        ISLAND_FILL.sand
      )}
    >
      {icon && (
        <span
          className={cn(
            "grid size-14 place-items-center rounded-full border border-black [&>svg]:size-6",
            ISLAND_FILL.lavender
          )}
          aria-hidden
        >
          {icon}
        </span>
      )}
      <p className="font-display text-3xl leading-none uppercase sm:text-4xl">{title}</p>
      {description && <p className="max-w-prose text-base">{description}</p>}
      {action}
    </div>
  )
}

/** Toggle pills used to filter a table by status. */
export function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string; count: number }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-xs font-bold tracking-[0.05em] uppercase transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground hover:bg-muted"
            )}
          >
            {option.label}
            <span
              className={cn(
                "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] tabular-nums",
                active
                  ? "bg-primary-foreground text-primary"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
