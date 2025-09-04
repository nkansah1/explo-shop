"use client"

import { useEffect } from "react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { loadCart } = useCart()

  useEffect(() => {
    if (user) {
      loadCart()
    }
  }, [user, loadCart])

  return <>{children}</>
}