import { expect, test } from "@playwright/test"

import { loginAs } from "./helpers"

// CLAUDE.md §14.4 and §14.5. The mock company is "Tecnologías Norte" (cmp_1).

test.beforeEach(async ({ context, baseURL }) => {
  await loginAs(context, "COMPANY", baseURL!)
})

test("a company reviews applicants: contact data, detail and status", async ({ page }) => {
  await page.goto("/empresa/vacantes/job_1/postulantes")
  const row = page.getByRole("row").filter({ hasText: "Luis Hernández" })
  await expect(row.getByRole("link", { name: "luis.hernandez@example.com" })).toBeVisible()
  await expect(row.getByRole("link", { name: "55 2345 6789" })).toBeVisible()
  await expect(row.getByRole("button", { name: "Ver CV" })).toBeVisible()
  await expect(page.getByRole("button", { name: /^Enviada/ })).toContainText("1")

  // Opening a new application marks it as viewed.
  await row.getByRole("button", { name: "Detalle" }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByText("Tengo 3 años trabajando con React")).toBeVisible()
  const statusSelect = dialog.getByRole("combobox", { name: "Estado de Luis Hernández" })
  await expect(statusSelect).toHaveText("Vista")

  await statusSelect.click()
  await page.getByRole("option", { name: "En proceso" }).click()
  await expect(page.getByText("Estado cambiado a “En proceso”")).toBeVisible()

  // Close the modal (the page behind it is hidden from assistive tech while open).
  await page.keyboard.press("Escape")
  await expect(page.getByRole("button", { name: /^Enviada/ })).toContainText("0")
  await expect(page.getByRole("button", { name: /^En proceso/ })).toContainText("2")
})

test("a company cannot see another company's applicants or edit its jobs", async ({ page }) => {
  for (const path of ["/empresa/vacantes/job_6/postulantes", "/empresa/vacantes/job_6/editar"]) {
    await page.goto(path)
    await expect(page.getByRole("heading", { name: "No encontramos esta página" })).toBeVisible()
    // job_6 belongs to "Café La Esquina" and has an applicant; nothing of it may leak.
    await expect(page.getByText("luis.hernandez@example.com")).toHaveCount(0)
    await expect(page.getByText("Barista")).toHaveCount(0)
  }
})

test("a company validates and publishes a new job", async ({ page }) => {
  await page.goto("/empresa/vacantes/nueva")
  await page.getByRole("button", { name: "Publicar" }).click()
  // Errors are role="alert"; "Elige una modalidad" is also the select placeholder.
  await expect(page.getByRole("alert").filter({ hasText: "Ingresa el título de la vacante" })).toBeVisible()
  await expect(page.getByRole("alert").filter({ hasText: "Elige una modalidad" })).toBeVisible()

  await page.getByLabel("Título de la vacante").fill("Diseñador UX")
  await page.getByRole("combobox", { name: "Modalidad" }).click()
  await page.getByRole("option", { name: "Remoto" }).click()
  await page.getByRole("combobox", { name: "Tipo de contrato" }).click()
  await page.getByRole("option", { name: "Tiempo completo" }).click()
  await page.getByLabel("Mínimo").fill("30000")
  await page.getByLabel("Máximo").fill("20000")
  await page.getByLabel("Descripción").fill("Diseña flujos y prototipos para nuestros productos.")
  await page.getByLabel("Requisitos").fill("- Figma\n- Portafolio")
  await page.getByRole("button", { name: "Publicar" }).click()
  await expect(page.getByText("El salario máximo debe ser mayor o igual al mínimo")).toBeVisible()

  await page.getByLabel("Máximo").fill("40000")
  await page.getByRole("button", { name: "Publicar" }).click()
  await expect(page).toHaveURL("/empresa/vacantes")
  await expect(page.getByText("¡Vacante publicada!")).toBeVisible()
})

test("company pages are protected from candidates", async ({ page, context, baseURL }) => {
  await loginAs(context, "CANDIDATE", baseURL!)
  await page.goto("/empresa")
  await expect(page).toHaveURL("/")
})
