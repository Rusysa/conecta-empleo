const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

export function formatDate(date: Date) {
  return dateFormatter.format(date)
}

export function formatRelativeDate(date: Date, now = new Date()) {
  const days = Math.floor((now.getTime() - date.getTime()) / 86_400_000)
  if (days <= 0) return "Hoy"
  if (days === 1) return "Ayer"
  if (days < 30) return `Hace ${days} días`
  return formatDate(date)
}

export function formatSalary(min: number | null, max: number | null, currency = "MXN") {
  if (min == null && max == null) return null
  const fmt = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  })
  if (min != null && max != null) return `${fmt.format(min)} – ${fmt.format(max)}`
  if (min != null) return `Desde ${fmt.format(min)}`
  return `Hasta ${fmt.format(max!)}`
}
