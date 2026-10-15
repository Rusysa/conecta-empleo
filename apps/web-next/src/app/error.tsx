"use client"

import { IslandFrame } from "@/components/island/island-frame"
import { ErrorState } from "@/components/layout/error-state"

// Catches errors in any page while keeping the root layout (island nav and footer).
export default function Error(props: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <IslandFrame>
      <ErrorState {...props} />
    </IslandFrame>
  )
}
