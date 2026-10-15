import { expect, test } from "@playwright/test"

import { loginAs } from "./helpers"

test("login shows a rate-limit message instead of failing silently", async ({ page }) => {
  await page.goto("/login")
  await page.getByLabel("Correo electrónico").fill("ana@ratelimit.test")
  await page.getByLabel("Contraseña").fill("secreto123")
  await page.getByRole("button", { name: "Iniciar sesión" }).click()
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Demasiados intentos. Intenta de nuevo en 2 minutos." })
  ).toBeVisible()
  await expect(page).toHaveURL("/login")
})

test("an unverified account sees the verification banner", async ({ page, context, baseURL }) => {
  await loginAs(context, "CANDIDATE_INCOMPLETE", baseURL!)
  await page.goto("/candidato/perfil")
  await expect(page.getByRole("status").filter({ hasText: "Verifica tu correo" })).toBeVisible()

  await page.goto("/verificar?token=abcdefghijklmnop1234")
  await expect(page.getByRole("heading", { name: "¡Correo verificado!" })).toBeVisible()
  await page.goto("/verificar")
  await expect(page.getByRole("heading", { name: "Enlace no válido" })).toBeVisible()
})

test("company dashboard lists applicants per open job", async ({ page, context, baseURL }) => {
  await loginAs(context, "COMPANY", baseURL!)
  await page.goto("/empresa")
  const row = page.getByRole("row").filter({ hasText: "Desarrollador Frontend (React)" })
  await expect(row.getByRole("cell").nth(2)).toHaveText("2")
  await expect(page.getByRole("status").filter({ hasText: "Verifica tu correo" })).toHaveCount(0)
})

test("robots.txt blocks private areas and points to the sitemap", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text()
  expect(robots).toContain("Disallow: /candidato/")
  expect(robots).toContain("Disallow: /empresa/")
  const sitemap = await (await request.get("/sitemap.xml")).text()
  expect(sitemap).toContain("/vacantes/job_1")
  expect(sitemap).not.toContain("/vacantes/job_5") // paused
})
