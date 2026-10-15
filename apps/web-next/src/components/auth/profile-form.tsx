"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { mutate } from "@/lib/api"
import type { User } from "@/lib/auth-types"

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setPending(true)
    setError("")
    setSaved(false)
    try {
      await mutate(
        "/users/me",
        {
          name: data.get("name"),
          bio: data.get("bio"),
          ...(user.role === "candidate" ? { resumeUrl: data.get("resumeUrl") } : {}),
        },
        "PATCH"
      )
      setSaved(true)
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar el perfil.")
    } finally {
      setPending(false)
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {user.email} · {user.role === "candidate" ? "Candidato" : "Empresa"}
      </p>
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={user.name}
          minLength={2}
          maxLength={100}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">
          {user.role === "candidate" ? "Acerca de ti" : "Acerca de tu empresa"}
        </Label>
        <Textarea id="bio" name="bio" defaultValue={user.bio} maxLength={2000} rows={5} />
      </div>
      {user.role === "candidate" && (
        <div className="space-y-2">
          <Label htmlFor="resumeUrl">Enlace a tu CV o portafolio (HTTPS)</Label>
          <Input
            id="resumeUrl"
            name="resumeUrl"
            type="url"
            pattern="https://.*"
            defaultValue={user.resumeUrl}
            maxLength={2048}
            placeholder="https://…"
          />
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-sm">
          Perfil guardado.
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar perfil"}
      </Button>
    </form>
  )
}
