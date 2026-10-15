import { Palm, Sea } from "@/components/landing/landing-art"

/**
 * Sky-colored page frame used by every route except the full-bleed landing pages:
 * room for the fixed nav, a palm peeking from the corner and the lagoon at the bottom.
 */
export function IslandFrame({ children }: { children: React.ReactNode }) {
  return (
    <section className="frame isle-frame">
      <Palm className="isle-frame__palm" />
      <div className="isle-frame__inner">{children}</div>
      <Sea />
    </section>
  )
}
