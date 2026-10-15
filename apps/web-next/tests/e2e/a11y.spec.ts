import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

import { loginAs, type MockRole } from "./helpers"

// Automated WCAG 2.1 A/AA checks (CLAUDE.md §13: accessible UI). axe catches roughly
// a third of issues; keyboard and screen-reader checks are still done by hand.
const PAGES: { path: string; role: MockRole }[] = [
  { path: "/", role: "GUEST" },
  { path: "/vacantes", role: "GUEST" },
  { path: "/vacantes/job_1", role: "GUEST" },
  { path: "/empresas/tecnologias-norte", role: "GUEST" },
  { path: "/login", role: "GUEST" },
  { path: "/registro", role: "GUEST" },
  { path: "/recuperar", role: "GUEST" },
  { path: "/candidato/perfil", role: "CANDIDATE_INCOMPLETE" },
  { path: "/candidato/postulaciones", role: "CANDIDATE" },
  { path: "/empresa", role: "COMPANY" },
  { path: "/empresa/vacantes", role: "COMPANY" },
  { path: "/empresa/vacantes/nueva", role: "COMPANY" },
  { path: "/empresa/vacantes/job_1/postulantes", role: "COMPANY" },
]

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme })
    // axe analysis is slower than functional checks, especially on a cold server.
    test.setTimeout(60_000)

    for (const { path, role } of PAGES) {
      test(`${path} (${role}) has no WCAG A/AA violations`, async ({ page, context, baseURL }) => {
        await loginAs(context, role, baseURL!)
        await page.goto(path)
        await expect(page.locator("main h1").first()).toBeVisible()

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          // Dev-only role switcher in the footer is not part of the product.
          .exclude("footer [aria-label='Rol de vista previa']")
          .analyze()

        const summary = results.violations.map((v) => ({
          rule: v.id,
          impact: v.impact,
          help: v.help,
          targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
        }))
        expect(summary).toEqual([])
      })
    }
  })
}
