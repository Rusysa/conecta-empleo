import { expect, test } from "@playwright/test"

import { loginAs, SAMPLE_PDF } from "./helpers"

// CLAUDE.md §14.2, §14.3, §14.7 (front-only: data comes from the mock layer).

test("registering as a candidate leads to profile onboarding", async ({ page }) => {
  await page.goto("/registro")
  await page.getByRole("button", { name: "Crear cuenta" }).click()
  await expect(page.getByText("Ingresa un correo válido")).toBeVisible()
  await expect(page.getByText("Debes aceptar el aviso de privacidad")).toBeVisible()

  await page.getByLabel("Correo electrónico").fill("nueva@example.com")
  await page.getByLabel("Contraseña", { exact: true }).fill("secreto123")
  await page.getByLabel("Confirmar contraseña").fill("secreto123")
  await page.getByRole("checkbox", { name: /aviso de privacidad/ }).check()
  await page.getByRole("button", { name: "Crear cuenta" }).click()

  await expect(page).toHaveURL("/candidato/perfil")
  await expect(page.getByText("Completa tu perfil para poder aplicar")).toBeVisible()
})

test("a candidate completes the profile, then applies to a job", async ({
  page,
  context,
  baseURL,
}) => {
  await loginAs(context, "CANDIDATE_INCOMPLETE", baseURL!)
  await page.goto("/vacantes/job_1")
  await page.getByRole("link", { name: "Completa tu perfil para aplicar" }).click()
  await expect(page).toHaveURL(/\/candidato\/perfil\?next=%2Fvacantes%2Fjob_1/)

  await page.getByLabel("Nombre completo").fill("Ana Prueba")
  await page.getByLabel("Teléfono").fill("12345")
  await page.getByRole("button", { name: "Guardar datos" }).click()
  await expect(page.getByText("Ingresa un teléfono de 10 dígitos")).toBeVisible()
  await page.getByLabel("Teléfono").fill("81 1111 2222")
  await page.getByRole("button", { name: "Guardar datos" }).click()
  await expect(page.getByText("Datos guardados")).toBeVisible()

  const cvInput = page.getByLabel("Archivo del CV")
  await cvInput.setInputFiles({
    name: "notas.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("x"),
  })
  await expect(page.getByText("Solo se aceptan archivos PDF o DOCX")).toBeVisible()
  await cvInput.setInputFiles(SAMPLE_PDF)
  await page.getByRole("button", { name: "Subir CV" }).click()

  // Profile complete → back to the job, now able to apply.
  await expect(page).toHaveURL("/vacantes/job_1")
  await page.getByRole("button", { name: "Aplicar", exact: true }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByText("Tecnologías Norte recibirá los siguientes datos:")).toBeVisible()
  await dialog.getByLabel(/Mensaje para la empresa/).fill("Me interesa mucho la vacante.")
  await dialog.getByRole("button", { name: "Enviar postulación" }).click()

  await expect(page).toHaveURL("/candidato/postulaciones")
  await expect(page.getByText("¡Postulación enviada!")).toBeVisible()
})

test("a candidate cannot apply twice and sees application statuses", async ({
  page,
  context,
  baseURL,
}) => {
  await loginAs(context, "CANDIDATE", baseURL!)
  await page.goto("/vacantes/job_2")
  await expect(page.getByRole("button", { name: "Ya aplicaste" })).toBeDisabled()

  await page.getByRole("link", { name: "Ver mis postulaciones" }).click()
  const backend = page.getByRole("listitem").filter({ hasText: "Desarrollador Backend (Node.js)" })
  await expect(backend.getByText("Vista")).toBeVisible()
})

test("candidate pages are protected", async ({ page, context, baseURL }) => {
  await page.goto("/candidato/postulaciones")
  await expect(page).toHaveURL("/login?callbackUrl=%2Fcandidato%2Fpostulaciones")

  await loginAs(context, "COMPANY", baseURL!)
  await page.goto("/candidato/perfil")
  await expect(page).toHaveURL("/")
})
