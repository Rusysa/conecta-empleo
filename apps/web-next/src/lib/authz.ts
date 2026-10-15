// Role guards for pages (CLAUDE.md §3). Backed by the mock session for now;
// once Auth.js lands, swap getMockSession() for auth() and keep these signatures.
import "server-only"

import { redirect } from "next/navigation"

import { getMockSession } from "@/lib/mock-session"

/** Ensures the visitor is a CANDIDATE; otherwise redirects (to login or home). */
export async function requireCandidate(currentPath: string) {
  const session = await getMockSession()
  if (!session) redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`)
  if (session.role !== "CANDIDATE") redirect("/")
  return session
}

/** Ensures the visitor is a COMPANY; otherwise redirects (to login or home). */
export async function requireCompany(currentPath: string) {
  const session = await getMockSession()
  if (!session) redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`)
  if (session.role !== "COMPANY") redirect("/")
  return session
}
