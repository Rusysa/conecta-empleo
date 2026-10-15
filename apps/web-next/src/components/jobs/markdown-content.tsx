import Markdown, { type Components } from "react-markdown"

import { cn } from "@/lib/utils"

// Job text is written by companies: react-markdown never renders raw HTML and drops
// unsafe URLs (javascript:, data:). Images are removed to avoid tracking pixels, and
// headings are demoted so they never compete with the page's h1/h2.
// Colors are inherited from the surrounding card so the text works in both themes.
const HEADING = "mt-6 text-lg leading-tight font-bold tracking-[-0.01em] first:mt-0"
const COMPONENTS: Components = {
  h1: ({ children }) => <h3 className={HEADING}>{children}</h3>,
  h2: ({ children }) => <h3 className={HEADING}>{children}</h3>,
  h3: ({ children }) => <h3 className={HEADING}>{children}</h3>,
  h4: ({ children }) => <h4 className="mt-4 font-bold">{children}</h4>,
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => (
    <ul className="ml-5 list-[square] space-y-1.5 marker:text-current">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="ml-5 list-decimal space-y-1.5 marker:font-bold">{children}</ol>
  ),
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="font-semibold underline decoration-2 underline-offset-4 hover:decoration-lagoon focus-visible:rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </a>
  ),
}

/** Long-form job text: comfortable measure (< 70ch) and relaxed leading. */
export function MarkdownContent({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("max-w-[68ch] space-y-3 text-base leading-relaxed", className)}>
      <Markdown components={COMPONENTS} disallowedElements={["img"]} unwrapDisallowed>
        {children}
      </Markdown>
    </div>
  )
}
