/** Public base URL of the app (no trailing slash). Used for metadata and JSON-LD. */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
  /\/$/,
  ""
)
