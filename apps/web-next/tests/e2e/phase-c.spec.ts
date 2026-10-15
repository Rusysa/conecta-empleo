import { expect, test } from "@playwright/test"

import { loginAs } from "./helpers"

test("featured jobs are listed first with a badge", async ({ page }) => {
  await page.goto("/vacantes")
  const cards = page.locator("main h3")
  await expect(cards.nth(0)).toHaveText(/Barista|Desarrollador Frontend \(React\)/)
  await expect(cards.nth(1)).toHaveText(/Barista|Desarrollador Frontend \(React\)/)
  await expect(page.getByText("Destacada")).toHaveCount(2)
})

test("a candidate saves a search as an alert and manages alerts", async ({
  page,
  context,
  baseURL,
}) => {
  await loginAs(context, "CANDIDATE", baseURL!)
  await page.goto("/vacantes?q=react&modalidad=remoto")
  await page.getByRole("button", { name: "Crear alerta" }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByText("“react” · Remoto")).toBeVisible()
  await dialog.getByRole("radio", { name: "Semanal" }).click()
  await dialog.getByRole("button", { name: "Crear alerta" }).click()
  await expect(page.getByText("Te avisaremos cada semana.")).toBeVisible()

  await page.goto("/candidato/alertas")
  await expect(page.getByRole("link", { name: "“frontend” en Monterrey" })).toBeVisible()
  await page.getByRole("button", { name: "Eliminar alerta “frontend” en Monterrey" }).click()
  await expect(page.getByRole("link", { name: "“frontend” en Monterrey" })).toHaveCount(0)
})

test("visitors do not see the alert button", async ({ page }) => {
  await page.goto("/vacantes")
  await expect(page.getByRole("button", { name: "Crear alerta" })).toHaveCount(0)
})

test("an admin verifies a company and unpublishes a job with a reason", async ({
  page,
  context,
  baseURL,
}) => {
  await loginAs(context, "ADMIN", baseURL!)
  await page.goto("/admin")
  const cafe = page.getByRole("row").filter({ hasText: "Café La Esquina" })
  await expect(cafe.getByText("Sin verificar")).toBeVisible()
  await cafe.getByRole("button", { name: "Verificar" }).click()
  await expect(cafe.getByText("Verificada")).toBeVisible()

  await page
    .getByRole("navigation", { name: "Administración" })
    .getByRole("link", { name: "Vacantes" })
    .click()
  const barista = page.getByRole("row").filter({ hasText: "Barista" })
  await barista.getByRole("button", { name: "Despublicar" }).click()
  const dialog = page.getByRole("dialog")
  const confirm = dialog.getByRole("button", { name: "Despublicar" })
  await dialog.getByLabel("Motivo").fill("corto")
  await expect(confirm).toBeDisabled()
  await dialog.getByLabel("Motivo").fill("La vacante solicita pagos a los candidatos.")
  await confirm.click()
  await expect(barista.getByText("Pausada")).toBeVisible()
})

test("the admin area is only for admins", async ({ page, context, baseURL }) => {
  await page.goto("/admin")
  await expect(page).toHaveURL("/login?callbackUrl=%2Fadmin")
  await loginAs(context, "COMPANY", baseURL!)
  await page.goto("/admin/vacantes")
  await expect(page).toHaveURL("/")
})

test("an admin cannot apply to jobs", async ({ page, context, baseURL }) => {
  await loginAs(context, "ADMIN", baseURL!)
  await page.goto("/vacantes/job_1")
  await expect(page.getByText("Solo candidatos pueden aplicar a vacantes.")).toBeVisible()
})
