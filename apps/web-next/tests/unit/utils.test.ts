import { describe, expect, it } from "vitest"

import { escapeCsvCell, toCsv } from "@/lib/csv"
import { formatSalary } from "@/lib/format"
import { buildJobsHref, parseJobSearchParams } from "@/lib/job-search-params"
import { safeRedirectPath } from "@/lib/safe-redirect"

describe("escapeCsvCell", () => {
  it("quotes cells with commas, quotes or line breaks", () => {
    expect(escapeCsvCell("López, Ana")).toBe('"López, Ana"')
    expect(escapeCsvCell('dijo "hola"')).toBe('"dijo ""hola"""')
    expect(escapeCsvCell("línea 1\nlínea 2")).toBe('"línea 1\nlínea 2"')
  })

  it("neutralizes spreadsheet formulas (CSV injection)", () => {
    expect(escapeCsvCell("=HYPERLINK(\"http://x\")")).toBe("\"'=HYPERLINK(\"\"http://x\"\")\"")
    expect(escapeCsvCell("+52 81 1234")).toBe("'+52 81 1234")
    expect(escapeCsvCell("@SUM(A1)")).toBe("'@SUM(A1)")
    expect(escapeCsvCell("-1")).toBe("'-1")
  })

  it("renders null and undefined as empty", () => {
    expect(escapeCsvCell(null)).toBe("")
    expect(escapeCsvCell(undefined)).toBe("")
  })
})

describe("toCsv", () => {
  it("joins rows with CRLF", () => {
    expect(toCsv(["a", "b"], [[1, null]])).toBe("a,b\r\n1,")
  })
})

describe("safeRedirectPath", () => {
  it("allows same-origin relative paths", () => {
    expect(safeRedirectPath("/vacantes/job_1")).toBe("/vacantes/job_1")
  })

  it.each(["//evil.com", "https://evil.com", "javascript:alert(1)", "vacantes", undefined, 42])(
    "rejects %j",
    (value) => {
      expect(safeRedirectPath(value)).toBeNull()
    }
  )
})

describe("job search params", () => {
  it("parses Spanish slugs into filters", () => {
    expect(parseJobSearchParams({ q: " react ", ciudad: "Monterrey", modalidad: "remoto", page: "2" })).toEqual({
      q: "react",
      city: "Monterrey",
      modalidad: "remoto",
      workMode: "REMOTE",
      page: 2,
    })
  })

  it("ignores invalid modality and page values", () => {
    const parsed = parseJobSearchParams({ modalidad: "lunar", page: "-3" })
    expect(parsed.workMode).toBeUndefined()
    expect(parsed.modalidad).toBeUndefined()
    expect(parsed.page).toBe(1)
  })

  it("round-trips through buildJobsHref and omits page 1", () => {
    expect(buildJobsHref({ q: "café", modalidad: "hibrido", page: 1 })).toBe("/vacantes?q=caf%C3%A9&modalidad=hibrido")
    expect(buildJobsHref({})).toBe("/vacantes")
  })
})

describe("formatSalary", () => {
  it("formats ranges and open-ended salaries in MXN", () => {
    expect(formatSalary(9000, 11000)).toMatch(/^\$9,000 – \$11,000$/)
    expect(formatSalary(8000, null)).toMatch(/^Desde \$8,000$/)
    expect(formatSalary(null, null)).toBeNull()
  })
})
