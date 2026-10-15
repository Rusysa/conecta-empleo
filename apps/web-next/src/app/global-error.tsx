"use client"

import "./globals.css"

import { ErrorState } from "@/components/layout/error-state"

// Replaces the root layout when it fails, so it must render its own <html>/<body>.
export default function GlobalError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="es-MX">
      <body>
        <title>Error · Bolsa de Trabajo</title>
        <ErrorState {...props} />
      </body>
    </html>
  )
}
