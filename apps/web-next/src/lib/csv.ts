type Cell = string | number | null | undefined

/**
 * Escapes one CSV cell. Values that a spreadsheet would treat as a formula
 * (=, +, -, @, tab, CR) are prefixed with ' to prevent CSV injection, since
 * names and messages come from candidates.
 */
export function escapeCsvCell(value: Cell): string {
  let text = value == null ? "" : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Builds a CSV string (CRLF line endings) from a header row and data rows. */
export function toCsv(header: string[], rows: Cell[][]): string {
  return [header, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\r\n")
}

/** Triggers a browser download. The BOM makes Excel read UTF-8 accents correctly. */
export function downloadCsv(fileName: string, csv: string) {
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
