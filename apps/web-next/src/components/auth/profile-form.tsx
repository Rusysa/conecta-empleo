"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CircleCheck } from "lucide-react"

import { AuthAlert, authInputClass } from "@/components/auth/auth-shell"
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
      <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span className="break-all">{user.email}</span>
        <span className="label rounded-full border border-black bg-lavender px-2.5 py-1 text-black">
          {user.role === "candidate" ? "Candidato" : "Empresa"}
        </span>
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
          className={authInputClass}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">
          {user.role === "candidate" ? "Acerca de ti" : "Acerca de tu empresa"}
        </Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio}
          maxLength={2000}
          rows={5}
          className="rounded-xl px-3.5 py-2.5"
        />
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
            className={authInputClass}
          />
        </div>
      )}
      {error && <AuthAlert>{error}</AuthAlert>}
      {saved && (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold">
          <CircleCheck className="size-5 text-lagoon-deep dark:text-lagoon" aria-hidden />
          Perfil guardado.
        </p>
      )}
      <Button type="submit" size="lg" className="h-12 px-6 text-[13px]" disabled={pending}>
        {pending ? "Guardando…" : "Guardar perfil"}
      </Button>
    </form>
  )
}
