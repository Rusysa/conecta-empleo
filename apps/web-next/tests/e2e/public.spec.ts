import { expect, test } from "@playwright/test"

// CLAUDE.md §14.1 and §14.6: visitors see active jobs without logging in;
// paused/closed jobs are not listed and not reachable.

test("a visitor can browse and filter active jobs", async ({ page }) => {
  await page.goto("/vacantes")
  await expect(page.getByRole("heading", { name: "Vacantes", level: 1 })).toBeVisible()
  await expect(page.getByText("7 vacantes encontradas")).toBeVisible()
  // Paused ("Líder Técnico") and closed ("Repostero") jobs are not listed.
  await expect(page.getByRole("link", { name: "Líder Técnico" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Repostero" })).toHaveCount(0)

  await page.getByLabel("Modalidad").selectOption("remoto")
  await page.getByRole("button", { name: "Buscar" }).click()
  await expect(page).toHaveURL(/modalidad=remoto/)
  await expect(page.getByText("2 vacantes encontradas")).toBeVisible()
})

test("job detail asks a visitor to log in, keeping the way back", async ({ page }) => {
  await page.goto("/vacantes/job_1")
  await expect(page.getByRole("heading", { name: "Desarrollador Frontend (React)" })).toBeVisible()

  await page.getByRole("link", { name: "Inicia sesión para aplicar" }).click()
  await expect(page).toHaveURL("/login?callbackUrl=%2Fvacantes%2Fjob_1")
})

test("a paused job is not reachable", async ({ page }) => {
  await page.goto("/vacantes/job_5")
  await expect(page.getByRole("heading", { name: "No encontramos esta página" })).toBeVisible()
  await expect(page.getByText("Líder Técnico")).toHaveCount(0)
})
