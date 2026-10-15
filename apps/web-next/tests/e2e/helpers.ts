import type { BrowserContext } from "@playwright/test"

export type MockRole = "GUEST" | "CANDIDATE" | "CANDIDATE_INCOMPLETE" | "COMPANY" | "ADMIN"

/** Logs in as a mock role (same cookie the dev role switcher sets). Replace once Auth.js lands. */
export async function loginAs(context: BrowserContext, role: MockRole, baseURL: string) {
  await context.addCookies([{ name: "mock_role", value: role, url: baseURL }])
}

/** A tiny in-memory PDF for upload tests. */
export const SAMPLE_PDF = {
  name: "CV-Prueba.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.4\n% e2e test file\n"),
}
