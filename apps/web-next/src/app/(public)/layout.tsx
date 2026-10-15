import { IslandFrame } from "@/components/island/island-frame"

/** Public inner pages (job detail, companies, auth, plans, privacy) sit in the island frame. */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return <IslandFrame>{children}</IslandFrame>
}
