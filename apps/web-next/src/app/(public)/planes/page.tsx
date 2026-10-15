import type { Metadata } from "next"
import Link from "next/link"
import { Check, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Planes para empresas",
  description: "Publica vacantes gratis o destácalas para recibir más postulantes.",
}

// TODO(product): prices are placeholders until the team defines real plans and a payment
// provider (CLAUDE.md fase 3). Checkout is intentionally not implemented.
const PLANS = [
  {
    name: "Básico",
    price: "Gratis",
    detail: "Para empezar a contratar",
    featured: false,
    features: [
      "Vacantes ilimitadas",
      "Postulantes con nombre, correo, teléfono y CV",
      "Cambio de estado y exportación a CSV",
    ],
  },
  {
    name: "Vacante destacada",
    price: "$499 MXN",
    detail: "por vacante, durante 30 días",
    featured: true,
    features: [
      "Aparece primero en el listado y en la página de inicio",
      "Etiqueta “Destacada” para llamar la atención",
      "Todo lo del plan Básico",
    ],
  },
]

export default function PlansPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Planes para empresas</h1>
        <p className="text-muted-foreground">
          Publica tus vacantes gratis. Destácalas cuando necesites contratar más rápido.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={plan.featured ? "ring-2 ring-primary" : undefined}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">
                  <h2>{plan.name}</h2>
                </CardTitle>
                {plan.featured && (
                  <Badge className="gap-1">
                    <Star className="size-3 fill-current" aria-hidden /> Recomendado
                  </Badge>
                )}
              </div>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>{" "}
                {plan.detail}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.featured ? "default" : "outline"} asChild>
                <Link href={plan.featured ? "/empresa/vacantes" : "/registro?tipo=empresa"}>
                  {plan.featured ? "Destacar una vacante" : "Crear cuenta de empresa"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Precios de ejemplo. Los planes y el pago se definirán antes del lanzamiento.
      </p>
    </div>
  )
}
