/** Splits text into per-character masks; `copies` stacks repeats for the slot-machine roll. */
export function SplitChars({ text, copies = 1 }: { text: string; copies?: number }) {
  return [...text].map((c, i) => {
    const char = c === " " ? " " : c
    return (
      <span key={i} className="ch">
        <span>
          {copies === 1 ? char : Array.from({ length: copies }, (_, k) => <i key={k}>{char}</i>)}
        </span>
      </span>
    )
  })
}
