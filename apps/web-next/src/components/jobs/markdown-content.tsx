import Markdown, { type Components } from "react-markdown"

import { cn } from "@/lib/utils"

// Job text is written by companies: react-markdown never renders raw HTML and drops
// unsafe URLs (javascript:, data:). Images are removed to avoid tracking pixels, and
// headings are demoted so they never compete with the page's h1/h2.
const COMPONENTS: Components = {
  h1: ({ children }) => <h3 className="mt-4 font-semibold text-foreground">{children}</h3>,
  h2: ({ children }) => <h3 className="mt-4 font-semibold text-foreground">{children}</h3>,
  h3: ({ children }) => <h3 className="mt-4 font-semibold text-foreground">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-3 font-medium text-foreground">{children}</h4>,
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="ml-5 list-disc space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="ml-5 list-decimal space-y-1">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-primary underline underline-offset-4"
    >
      {children}
    </a>
  ),
}

export function MarkdownContent({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("space-y-3 text-muted-foreground", className)}>
      <Markdown components={COMPONENTS} disallowedElements={["img"]} unwrapDisallowed>
        {children}
      </Markdown>
    </div>
  )
}
