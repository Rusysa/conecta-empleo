import type { User } from "@/lib/auth-types"

type Envelope<T> = { data: T; error?: { message: string } }

async function readResponse<T>(response: Response): Promise<T> {
  const body: Envelope<T> | null = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.error?.message ?? "No pudimos conectar con el servidor. Inténtalo de nuevo.")
  if (!body) throw new Error("El servidor devolvió una respuesta inválida.")
  return body.data
}

export async function mutate<T>(path: string, data?: unknown, method = "POST"): Promise<T | undefined> {
  const session = await readResponse<{ user: User | null; csrfToken: string }>(
    await fetch("/api/v1/auth/session", { credentials: "same-origin", cache: "no-store" })
  )
  const response = await fetch(`/api/v1${path}`, {
    method,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": session.csrfToken },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
  if (response.status === 204) return undefined
  return readResponse<T>(response)
}

export function safeCallback(url?: string): string {
  if (!url || !url.startsWith("/") || url.startsWith("//") || /[\\\x00-\x20]/.test(url)) return "/vacantes"
  const parsed = new URL(url, "https://conecta.invalid")
  return parsed.origin === "https://conecta.invalid" ? parsed.pathname + parsed.search + parsed.hash : "/vacantes"
}
