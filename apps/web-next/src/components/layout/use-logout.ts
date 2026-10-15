"use client"

import { useRouter } from "next/navigation"

import { mutate } from "@/lib/api"
import { toast } from "sonner"

export function useLogout() {
  const router = useRouter()
  return async () => {
    try {
      await mutate("/auth/logout")
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cerrar la sesión.")
    }
  }
}
