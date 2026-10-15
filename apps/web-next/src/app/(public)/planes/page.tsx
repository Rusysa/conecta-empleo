import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"

import { Sticker, vars } from "@/components/landing/landing-art"
import { RollText } from "@/components/landing/roll-text"
import { cn } from "@/lib/utils"

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
    href: "/registro?tipo=empresa",
    cta: "Crear cuenta de empresa",
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
    href: "/empresa/vacantes",
    cta: "Destacar una vacante",
    features: [
      "Aparece primero en el listado y en la página de inicio",
      "Etiqueta “Destacada” para llamar la atención",
      "Todo lo del plan Básico",
    ],
  },
]

export default function PlansPage() {
  return (
    <div className="wrap">
      <header className="mx-auto max-w-3xl text-center">
        <p className="label">Para empresas</p>
        <h1 className="mt-3 text-balance">Planes para empresas</h1>
        <p className="mx-auto mt-5 max-w-[48ch] text-lg leading-relaxed">
          Publica tus vacantes gratis. Destácalas cuando necesites contratar más rápido.
        </p>
      </header>

      <ul className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <li
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-[40px] border p-7 sm:p-10",
              // Featured tile: fixed sunburst + black ink (AA in both themes).
              plan.featured
                ? "border-black bg-sunburst text-black md:-rotate-1"
                : "border-border bg-card text-card-foreground"
            )}
          >
            {plan.featured && (
              // The page's one idea: the recommended plan wears a star sticker.
              <span
                className="stk"
                style={vars({ right: "-18px", top: "-30px", width: "84px", "--r": "12deg" })}
              >
                <Sticker name="star" />
              </span>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl leading-tight font-bold">{plan.name}</h2>
              {plan.featured && (
                <span className="label rounded-full border border-black bg-white px-2.5 py-1">
                  Recomendado
                </span>
              )}
            </div>
            <p className="mt-6 font-display text-[clamp(56px,7vw,88px)] leading-[0.9] uppercase">
              {plan.price}
            </p>
            <p className="mt-2 font-semibold">{plan.detail}</p>

            <ul className="mt-8 space-y-3 border-t border-dashed border-current pt-6">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-black text-black",
                      plan.featured ? "bg-white" : "bg-mint"
                    )}
                    aria-hidden
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              className={cn("pill pill--lg mt-10 w-full", plan.featured && "pill--dark")}
              href={plan.href}
            >
              <RollText>{plan.cta}</RollText>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Precios de ejemplo. Los planes y el pago se definirán antes del lanzamiento.
      </p>
    </div>
  )
}
