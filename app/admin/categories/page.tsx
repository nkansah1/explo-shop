"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { CategoryManagement } from "@/components/admin/category-management"
import { useAuth } from "@/hooks/use-auth"

export default function CategoriesPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/admin/categories")
    } else if (user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <AdminLayout>
      <CategoryManagement />
    </AdminLayout>
  )
}