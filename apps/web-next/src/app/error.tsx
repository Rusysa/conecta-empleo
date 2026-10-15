"use client"

import { ErrorState } from "@/components/layout/error-state"

// Catches errors in any page while keeping the root layout (navbar/footer).
export default function Error(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorState {...props} />
}
