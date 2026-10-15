"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

/**
 * Scroll and intro animations for the landing (GSAP + ScrollTrigger + Lenis smooth scroll).
 * Everything runs inside a gsap.context so leaving "/" with client-side navigation reverts
 * every tween/trigger and stops Lenis. Markup is pre-split on the server (no DOM rewriting).
 */
export function LandingMotion({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on("scroll", ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // In-page anchors scroll smoothly through Lenis.
    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      const id = link?.getAttribute("href")
      if (!id || id.length < 2) return
      const target = root.querySelector<HTMLElement>(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: -10, duration: 1.4 })
    }
    root.addEventListener("click", onAnchorClick)

    const hero = root.querySelector<HTMLElement>("#hero")
    const heroStickers = root.querySelectorAll<HTMLElement>(".hero__title .stk")
    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX / innerWidth - 0.5
      const y = e.clientY / innerHeight - 0.5
      heroStickers.forEach((s, i) =>
        gsap.to(s, {
          x: x * (20 + i * 12),
          y: y * (20 + i * 12),
          duration: 1,
          ease: "power3.out",
          overwrite: "auto",
        })
      )
    }
    hero?.addEventListener("pointermove", onPointerMove)

    const ctx = gsap.context(() => {
      // Idle float for every sticker (their resting tilt comes from CSS `rotate: var(--r)`).
      gsap.utils.toArray<HTMLElement>(".stk").forEach((s, i) => {
        gsap.to(s.querySelector("svg"), {
          y: gsap.utils.random(-14, -6),
          rotate: gsap.utils.random(-6, 6),
          duration: gsap.utils.random(2, 3.2),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        })
      })

      // 1. Intro: slot-machine roll of the wordmark + sticker pop + nav pills.
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          ".js-roll .ch > span",
          { yPercent: 0 },
          { yPercent: -75, duration: 1.6, stagger: 0.07, ease: "power4.inOut" }
        )
        .from("#ribbon", { scale: 1.15, opacity: 0, duration: 1.8 }, 0)
        .from(
          ".hero .js-pop",
          { scale: 0, rotation: "-=60", duration: 1, stagger: 0.09, ease: "back.out(2.2)" },
          0.9
        )
        .from(".hero .js-fade", { y: 40, opacity: 0, duration: 1, stagger: 0.1 }, 1)
        .from(
          ".nav .logo, .nav__right > *",
          { y: -30, opacity: 0, duration: 0.8, stagger: 0.05, ease: "back.out(2)" },
          0.6
        )
        .from(
          ".nav__pills .pill",
          { x: 40, opacity: 0, duration: 0.7, stagger: 0.05, ease: "back.out(1.8)" },
          0.8
        )

      // Scroll parallax for stickers with data-speed.
      gsap.utils.toArray<HTMLElement>(".stk[data-speed]").forEach((s) => {
        gsap.to(s, {
          yPercent: () => parseFloat(s.dataset.speed ?? "0") * -260,
          ease: "none",
          scrollTrigger: {
            trigger: s.closest(".frame"),
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      })

      // 2. Ribbon drifts / twists with scroll.
      gsap.to("#ribbon", {
        yPercent: 18,
        rotate: -6,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      })

      // 3. Nav: pills hide when scrolling down and come back on scroll up.
      const pills = gsap.utils.toArray<HTMLElement>(".nav__pills .pill")
      const nav = root.querySelector(".nav")
      let shown = true
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          nav?.classList.toggle("is-stuck", self.scroll() > 30)
          const want = self.direction === -1 || self.scroll() < 80
          if (want === shown) return
          shown = want
          gsap.to(pills, {
            x: want ? 0 : 40,
            opacity: want ? 1 : 0,
            scale: want ? 1 : 0.8,
            duration: 0.45,
            stagger: { each: 0.04, from: want ? "start" : "end" },
            ease: want ? "back.out(2)" : "power2.in",
            overwrite: true,
            pointerEvents: want ? "auto" : "none",
          })
        },
      })

      // 4. Mockup stage grows as it scrolls in.
      gsap.fromTo(
        "#stage",
        { scale: 0.72, borderRadius: 48 },
        {
          scale: 1,
          borderRadius: 20,
          ease: "none",
          scrollTrigger: { trigger: "#stage", start: "top 95%", end: "top 15%", scrub: true },
        }
      )
      gsap.utils.toArray<HTMLElement>(".js-phone").forEach((p, i) => {
        gsap.fromTo(
          p,
          { rotate: 0, yPercent: 30 },
          {
            rotate: p.dataset.rot,
            yPercent: i ? -8 : 6,
            ease: "none",
            scrollTrigger: {
              trigger: "#stage",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      })

      // 5. Kinetic rows slide horizontally in opposite directions.
      gsap.utils.toArray<HTMLElement>(".krow").forEach((r) => {
        const d = parseFloat(r.dataset.x ?? "0")
        gsap.fromTo(
          r,
          { xPercent: d },
          {
            xPercent: -d,
            ease: "none",
            scrollTrigger: {
              trigger: ".kinetic",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      })
      gsap.from(".js-kpop", {
        scale: 0,
        rotate: -45,
        duration: 0.9,
        stagger: 0.12,
        ease: "back.out(2.4)",
        scrollTrigger: { trigger: ".kinetic", start: "top 70%" },
      })

      // 6. Line reveal on headings.
      gsap.utils.toArray<HTMLElement>(".js-lines").forEach((el) => {
        gsap.from(el.querySelectorAll(".line > span"), {
          yPercent: 110,
          rotate: 3,
          duration: 1.1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        })
      })

      // 7. Feature headings: chars fill from gray to black while scrolling.
      gsap.utils.toArray<HTMLElement>(".js-fill").forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll(".c"),
          { color: "#cfcfcf" },
          {
            color: "#000",
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 40%", scrub: true },
          }
        )
      })

      // 8. Illustration cards: pop + inner parallax, cursor click loop.
      gsap.utils.toArray<HTMLElement>(".feat__art").forEach((a, i) => {
        gsap.from(a, {
          scale: 0.85,
          rotate: i % 2 ? 4 : -4,
          opacity: 0,
          duration: 1.1,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: a, start: "top 85%" },
        })
        const inner = a.querySelector(".js-par")
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: a, start: "top bottom", end: "bottom top", scrub: true },
            }
          )
        }
      })
      gsap.to(".js-cursor", {
        x: -10,
        y: -10,
        duration: 0.35,
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.9,
        ease: "power2.inOut",
        transformOrigin: "center",
      })

      // 9. Generic fade-up + staggered grids.
      gsap.utils.toArray<HTMLElement>(".js-fade-up").forEach((el) =>
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        })
      )
      gsap.utils.toArray<HTMLElement>(".js-stagger").forEach((g) =>
        gsap.from(g.children, {
          y: 60,
          opacity: 0,
          rotate: () => gsap.utils.random(-4, 4),
          duration: 0.9,
          stagger: 0.08,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: g, start: "top 85%" },
        })
      )
      gsap.utils.toArray<HTMLElement>(".step .js-pop, #empresas .js-pop").forEach((s) =>
        gsap.from(s, {
          scale: 0,
          duration: 0.9,
          ease: "back.out(2.4)",
          scrollTrigger: { trigger: s.parentElement, start: "top 80%" },
        })
      )

      // 10. Counters (the final value is rendered on the server; animate up to it).
      gsap.utils.toArray<HTMLElement>(".js-count").forEach((el) => {
        const to = Number(el.dataset.to)
        const counter = { v: 0 }
        el.textContent = "0"
        gsap.to(counter, {
          v: to,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = Math.round(counter.v).toLocaleString("es-MX")
          },
          scrollTrigger: { trigger: el, start: "top 90%" },
        })
      })

      // 11. Footer wordmark chars rise.
      gsap.from(".js-foot .ch > span", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.035,
        ease: "expo.out",
        scrollTrigger: { trigger: ".js-foot", start: "top 95%" },
      })
    }, root)

    const refresh = () => ScrollTrigger.refresh()
    if (document.readyState === "complete") requestAnimationFrame(refresh)
    else addEventListener("load", refresh, { once: true })

    // Trigger positions go stale when the page height changes (streamed jobs, filters),
    // and ScrollTrigger only re-measures on window resize, so watch the root's size.
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    let lastHeight = root.offsetHeight
    const resizeObserver = new ResizeObserver(() => {
      if (root.offsetHeight === lastHeight) return
      lastHeight = root.offsetHeight
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(refresh, 150)
    })
    resizeObserver.observe(root)

    return () => {
      removeEventListener("load", refresh)
      resizeObserver.disconnect()
      clearTimeout(resizeTimer)
      root.removeEventListener("click", onAnchorClick)
      hero?.removeEventListener("pointermove", onPointerMove)
      gsap.killTweensOf(heroStickers)
      ctx.revert()
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [rootId])

  return null
}
