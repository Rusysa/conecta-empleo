"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

import { LandingJobCard, type LandingJob } from "@/components/landing/landing-job-card"

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "presencial", label: "Presencial" },
  { key: "remoto", label: "Remoto" },
  { key: "hibrido", label: "Híbrido" },
  { key: "practicas", label: "Prácticas" },
]

/** Home page "Vacantes destacadas": client-side modality filter over the recent jobs. */
export function LandingJobs({ jobs }: { jobs: LandingJob[] }) {
  const [filter, setFilter] = useState("all")
  const grid = useRef<HTMLDivElement>(null)
  const list = filter === "all" ? jobs : jobs.filter((j) => j.filters.includes(filter))

  useEffect(() => {
    const cards = grid.current?.querySelectorAll(".job")
    if (!cards?.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const tween = gsap.from(cards, {
      y: 40,
      opacity: 0,
      rotate: () => gsap.utils.random(-3, 3),
      duration: 0.7,
      stagger: 0.07,
      ease: "back.out(1.6)",
    })
    return () => {
      tween.revert()
    }
  }, [filter])

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrar por modalidad">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className="pill pill--sm"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="jobs" ref={grid} aria-live="polite">
        {list.length === 0 && (
          <p className="jobs__empty">No hay vacantes con ese filtro por ahora.</p>
        )}
        {list.map((job) => (
          <LandingJobCard key={job.id} job={job} />
        ))}
      </div>
    </>
  )
}
