"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CompanyLogo } from "@/components/jobs/company-logo"
import { LOGO_ACCEPT, validateLogoFile } from "@/lib/validations/company"

export function LogoUpload({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Free the object URL when the preview changes or the component unmounts.
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview])

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null
    setError(null)
    setFile(null)
    setPreview(null)
    if (!selected) return
    const message = validateLogoFile(selected)
    if (message) {
      setError(message)
      event.target.value = ""
      return
    }
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  async function upload() {
    if (!file) return
    setUploading(true)
    // TODO(backend): uploadCompanyLogo(formData) → re-validate, resize, store publicly, set logoUrl.
    await new Promise((r) => setTimeout(r, 800))
    console.info("uploadCompanyLogo (mock)", { name: file.name, size: file.size, type: file.type })
    setUploading(false)
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
    toast.success("Logotipo actualizado")
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <CompanyLogo
        company={{ name: name || "?", logoUrl: preview ?? logoUrl }}
        className="size-16"
      />
      <Field data-invalid={Boolean(error)} className="flex-1">
        <FieldLabel htmlFor="logo">Logotipo</FieldLabel>
        <div className="flex flex-wrap gap-2">
          <Input
            ref={inputRef}
            id="logo"
            type="file"
            accept={LOGO_ACCEPT}
            onChange={onFileChange}
            aria-invalid={Boolean(error)}
            aria-describedby="logo-help"
            className="max-w-xs"
          />
          <Button type="button" variant="outline" onClick={upload} disabled={!file || uploading}>
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
            Subir logotipo
          </Button>
        </div>
        <FieldDescription id="logo-help">
          PNG, JPG o WebP, máximo 2 MB. Se recomienda cuadrado. Si no subes uno, mostramos tus
          iniciales.
        </FieldDescription>
        {error && <FieldError>{error}</FieldError>}
      </Field>
    </div>
  )
}
