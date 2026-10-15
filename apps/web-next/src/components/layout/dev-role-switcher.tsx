"use client"

import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MockRole } from "@/lib/mock-session"
import { setMockRoleCookie } from "@/components/layout/mock-role-cookie"

const OPTIONS: { value: MockRole; label: string }[] = [
  { value: "GUEST", label: "Visitante" },
  { value: "CANDIDATE", label: "Candidato (perfil completo)" },
  { value: "CANDIDATE_INCOMPLETE", label: "Candidato (sin CV)" },
  { value: "COMPANY", label: "Empresa" },
]

/** Dev-only helper to preview the UI as each role. Remove when Auth.js lands. */
export function DevRoleSwitcher({ role }: { role: MockRole }) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">Vista previa como:</span>
      <Select
        value={role}
        onValueChange={(value) => {
          setMockRoleCookie(value as MockRole)
          router.refresh()
        }}
      >
        <SelectTrigger size="sm" className="w-56" aria-label="Rol de vista previa">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
