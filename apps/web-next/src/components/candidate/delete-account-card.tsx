"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { setMockRoleCookie } from "@/components/layout/mock-role-cookie"

const CONFIRM_WORD = "ELIMINAR"

/** Account deletion (CLAUDE.md §9, fase 2): cascades the candidate's data and CV files. */
export function DeleteAccountCard() {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)

  async function deleteAccount() {
    setDeleting(true)
    // TODO(backend): deleteCandidateAccount() Server Action → cascade in DB + remove CV files
    // from storage (cvs/candidates/{id}/ and applications/{id}/), then signOut().
    await new Promise((r) => setTimeout(r, 900))
    console.info("deleteCandidateAccount (mock)")
    setMockRoleCookie("GUEST")
    toast.success("Tu cuenta fue eliminada")
    router.push("/")
    router.refresh()
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle>Eliminar cuenta</CardTitle>
        <CardDescription>
          Borra tu perfil, tu CV y tus postulaciones. Esta acción no se puede deshacer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog onOpenChange={(open) => !open && setConfirmText("")}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 /> Eliminar mi cuenta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar tu cuenta?</DialogTitle>
              <DialogDescription>
                Se borrarán tus datos de contacto, tu CV y tus postulaciones. Las empresas ya no
                podrán ver tu información.
              </DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel htmlFor="confirm-delete">
                Escribe {CONFIRM_WORD} para confirmar
              </FieldLabel>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoComplete="off"
              />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button
                variant="destructive"
                disabled={confirmText.trim() !== CONFIRM_WORD || deleting}
                onClick={deleteAccount}
              >
                {deleting && <Loader2 className="animate-spin" />}
                Eliminar definitivamente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
