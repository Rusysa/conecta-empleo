/** Two stacked copies of a pill label; hovering the pill rolls the second one in. */
export function RollText({ children }: { children: React.ReactNode }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  )
}
