"use client"

import { useRef, useState } from "react"
import { FileText, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/format"
import { CV_ACCEPT, validateCvFile } from "@/lib/validations/candidate"

export type CurrentCv = { fileName: string; updatedAt: Date } | null

export function CvUpload({
  current,
  onUploaded,
}: {
  current: CurrentCv
  onUploaded: (cv: NonNullable<CurrentCv>) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null
    setFile(null)
    setError(null)
    if (!selected) return
    const message = validateCvFile(selected)
    if (message) {
      setError(message)
      event.target.value = ""
      return
    }
    setFile(selected)
  }

  async function upload() {
    if (!file) return
    setUploading(true)
    // TODO(backend): uploadCv(formData) Server Action → Supabase Storage (private bucket).
    await new Promise((r) => setTimeout(r, 1000))
    console.info("uploadCv (mock)", { name: file.name, size: file.size, type: file.type })
    setUploading(false)
    onUploaded({ fileName: file.name, updatedAt: new Date() })
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
    toast.success(current ? "CV reemplazado" : "CV subido")
  }

  return (
    <div className="grid gap-6">
      {current ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
          <FileText className="size-8 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{current.fileName}</p>
            <p className="text-xs text-muted-foreground">
              Actualizado el {formatDate(current.updatedAt)}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              // TODO(backend): GET /api/candidate/cv → redirect to a signed URL.
              toast.info("La descarga estará disponible al conectar el almacenamiento.")
            }
          >
            Ver CV
          </Button>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Aún no has subido tu CV. Lo necesitas para aplicar a vacantes.
        </p>
      )}

      <Field data-invalid={Boolean(error)}>
        <FieldLabel htmlFor="cv">{current ? "Reemplazar CV" : "Subir CV"}</FieldLabel>
        <Input
          ref={inputRef}
          id="cv"
          type="file"
          accept={CV_ACCEPT}
          onChange={onFileChange}
          aria-invalid={Boolean(error)}
          aria-describedby="cv-help"
        />
        <FieldDescription id="cv-help">PDF o DOCX, máximo 5 MB.</FieldDescription>
        {error && <FieldError>{error}</FieldError>}
      </Field>

      <div>
        <Button type="button" onClick={upload} disabled={!file || uploading}>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
          {current ? "Reemplazar CV" : "Subir CV"}
        </Button>
      </div>
    </div>
  )
}
