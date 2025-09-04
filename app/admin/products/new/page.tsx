"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminProductForm } from "@/components/admin/admin-product-form"
import { useAuth } from "@/hooks/use-auth"

export default function NewProductPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/admin/products/new")
    } else if (user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <AdminLayout>
      <AdminProductForm />
    </AdminLayout>
  )
}