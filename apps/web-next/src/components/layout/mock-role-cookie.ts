import type { MockRole } from "@/lib/mock-session"

// Client-side writer for the cookie read by lib/mock-session.ts.
export function setMockRoleCookie(role: MockRole) {
  document.cookie = `mock_role=${role}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
}
