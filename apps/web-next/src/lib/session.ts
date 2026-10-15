import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Session, User } from "@/lib/auth-types"

/** Verifies the session against the API once per request (navbar, guards and pages share it). */
export const getSession = cache(loadSession)

async function loadSession(): Promise<Session> {
  const store = await cookies()
  const sessionCookie = store.get("__Host-conecta_session") ?? store.get("conecta_session")
  if (!sessionCookie) return null
  const response = await fetch(
    `${process.env.API_INTERNAL_URL || "http://127.0.0.1:3001"}/api/v1/users/me`,
    {
      headers: { Cookie: `${sessionCookie.name}=${sessionCookie.value}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    }
  )
  if (response.status === 401) return null
  if (!response.ok) throw new Error("No se pudo verificar la sesión. Inténtalo de nuevo.")
  const { data: user }: { data: User } = await response.json()
  return { user, email: user.email, role: user.role === "candidate" ? "CANDIDATE" : "COMPANY" }
}

export async function requireSession(role?: User["role"]) {
  const session = await getSession()
  if (!session) redirect("/login")
  if (role && session.user.role !== role)
    redirect(session.user.role === "candidate" ? "/candidato/perfil" : "/empresa/perfil")
  return session
}
