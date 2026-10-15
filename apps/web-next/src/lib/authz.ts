// Role guards for pages (CLAUDE.md §3), backed by the real API session (lib/session.ts).
// Jobs and applications still come from mock data until their API endpoints exist, so the
// guards also expose the demo candidateId/companyId those queries expect.
import "server-only"

import { redirect } from "next/navigation"

import { candidates, companies } from "@/lib/mock-data"
import { getSession } from "@/lib/session"

/** Ensures the visitor is a CANDIDATE; otherwise redirects (to login or home). */
export async function requireCandidate(currentPath: string) {
  const session = await getSession()
  if (!session) redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`)
  if (session.role !== "CANDIDATE") redirect("/")
  // TODO(backend): use the candidate id from the API once applications are persisted.
  return { ...session, candidateId: candidates[0].id }
}

/** Ensures the visitor is a COMPANY; otherwise redirects (to login or home). */
export async function requireCompany(currentPath: string) {
  const session = await getSession()
  if (!session) redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`)
  if (session.role !== "COMPANY") redirect("/")
  // TODO(backend): use the company id from the API once jobs are persisted.
  return { ...session, companyId: companies[0].id }
}
