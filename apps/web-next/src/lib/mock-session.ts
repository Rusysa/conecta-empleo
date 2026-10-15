// Temporary stand-in for Auth.js while the app is front-only.
// A `mock_role` cookie (set from the dev switcher in the footer) picks who is "logged in".
// Replace with `auth()` from lib/auth.ts once Auth.js is configured.
import "server-only"

import { cookies } from "next/headers"

import { applications, candidates, companies } from "@/lib/mock-data"

export const MOCK_ROLE_COOKIE = "mock_role"

export type MockRole = "GUEST" | "CANDIDATE" | "CANDIDATE_INCOMPLETE" | "COMPANY"

export type MockSession =
  | {
      role: "CANDIDATE"
      email: string
      candidateId: string
      profileComplete: boolean
    }
  | { role: "COMPANY"; email: string; companyId: string }
  | null

export async function getMockRole(): Promise<MockRole> {
  const value = (await cookies()).get(MOCK_ROLE_COOKIE)?.value
  const roles: MockRole[] = ["GUEST", "CANDIDATE", "CANDIDATE_INCOMPLETE", "COMPANY"]
  return roles.includes(value as MockRole) ? (value as MockRole) : "GUEST"
}

export async function getMockSession(): Promise<MockSession> {
  const role = await getMockRole()
  if (role === "CANDIDATE" || role === "CANDIDATE_INCOMPLETE") {
    const candidate = candidates[0]
    return {
      role: "CANDIDATE",
      email: candidate.email,
      candidateId: candidate.id,
      profileComplete: role === "CANDIDATE",
    }
  }
  if (role === "COMPANY") {
    return { role: "COMPANY", email: "rh@tecnologiasnorte.mx", companyId: companies[0].id }
  }
  return null
}

export async function hasCandidateApplied(candidateId: string, jobId: string) {
  return applications.some((a) => a.candidateId === candidateId && a.jobId === jobId)
}
