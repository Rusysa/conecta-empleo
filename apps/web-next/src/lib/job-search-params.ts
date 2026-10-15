import type { JobSearchParams } from "@/server/queries/jobs"
import type { WorkMode } from "@/lib/types"

// Public URL uses Spanish slugs: /vacantes?q=&ciudad=&modalidad=&page=
export const WORK_MODE_SLUGS: Record<string, WorkMode> = {
  presencial: "ONSITE",
  remoto: "REMOTE",
  hibrido: "HYBRID",
}

type RawParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined
}

export function parseJobSearchParams(raw: RawParams): JobSearchParams & {
  modalidad?: string
} {
  const modalidad = first(raw.modalidad)
  const page = Number(first(raw.page))
  return {
    q: first(raw.q),
    city: first(raw.ciudad),
    modalidad: modalidad && modalidad in WORK_MODE_SLUGS ? modalidad : undefined,
    workMode: modalidad ? WORK_MODE_SLUGS[modalidad] : undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function buildJobsHref(params: {
  q?: string
  city?: string
  modalidad?: string
  page?: number
}) {
  const search = new URLSearchParams()
  if (params.q) search.set("q", params.q)
  if (params.city) search.set("ciudad", params.city)
  if (params.modalidad) search.set("modalidad", params.modalidad)
  if (params.page && params.page > 1) search.set("page", String(params.page))
  const qs = search.toString()
  return qs ? `/vacantes?${qs}` : "/vacantes"
}
