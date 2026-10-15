// Result contract for Server Actions (CLAUDE.md §8): actions never throw to the client,
// they return one of these. The UI maps error codes to Spanish messages here.

export type ActionErrorCode =
  | "RATE_LIMITED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_TAKEN"
  | "ALREADY_APPLIED"
  | "JOB_NOT_ACTIVE"
  | "UNAUTHORIZED"
  | "VALIDATION"
  | "UNKNOWN"

export type ActionError = { code: ActionErrorCode; retryAfterSeconds?: number }

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: ActionError }

function formatWait(seconds: number) {
  if (seconds < 60) return `${seconds} segundos`
  const minutes = Math.ceil(seconds / 60)
  return minutes === 1 ? "1 minuto" : `${minutes} minutos`
}

export function actionErrorMessage(error: ActionError): string {
  switch (error.code) {
    case "RATE_LIMITED":
      return error.retryAfterSeconds
        ? `Demasiados intentos. Intenta de nuevo en ${formatWait(error.retryAfterSeconds)}.`
        : "Demasiados intentos. Intenta de nuevo en unos minutos."
    case "INVALID_CREDENTIALS":
      return "Correo o contraseña incorrectos."
    case "EMAIL_TAKEN":
      return "Ya existe una cuenta con ese correo."
    case "ALREADY_APPLIED":
      return "Ya aplicaste a esta vacante."
    case "JOB_NOT_ACTIVE":
      return "Esta vacante ya no acepta postulaciones."
    case "UNAUTHORIZED":
      return "Tu sesión expiró. Inicia sesión de nuevo."
    case "VALIDATION":
      return "Revisa los datos del formulario."
    default:
      return "Algo salió mal. Intenta de nuevo."
  }
}

/**
 * Mock of a rate-limited action for the front-only phase: emails at @ratelimit.test
 * get RATE_LIMITED so the UI state can be previewed. TODO(backend): delete.
 */
export async function mockActionResult(email?: string): Promise<ActionResult> {
  await new Promise((r) => setTimeout(r, 600))
  if (email?.toLowerCase().endsWith("@ratelimit.test")) {
    return { ok: false, error: { code: "RATE_LIMITED", retryAfterSeconds: 90 } }
  }
  return { ok: true, data: undefined }
}
