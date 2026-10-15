/** Only allow same-origin relative paths, to avoid open redirects via ?next= or ?callbackUrl=. */
export function safeRedirectPath(value: unknown): string | null {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : null
}
