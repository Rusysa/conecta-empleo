import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = { title: "Recuperar contraseña" }

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            <h1>Recuperar contraseña</h1>
          </CardTitle>
          <CardDescription>Te enviaremos un enlace para crear una nueva.</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
