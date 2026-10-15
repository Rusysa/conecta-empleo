"use client"

import { useRouter } from "next/navigation"

import { setMockRoleCookie } from "@/components/layout/mock-role-cookie"

// TODO(auth): replace with Auth.js signOut().
export function useMockLogout() {
  const router = useRouter()
  return () => {
    setMockRoleCookie("GUEST")
    router.push("/")
    router.refresh()
  }
}
