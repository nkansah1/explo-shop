"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProductManagement } from "@/components/admin/product-management"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, LogIn, UserX } from "lucide-react"
import Link from "next/link"

export default function AdminProductsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/admin/products")
    } else if (!isLoading && user && user.role !== "admin") {
      console.log("User does not have admin role:", user.role)
    }
  }, [user, isLoading, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <LogIn className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              Please log in to access product management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login?redirect=/admin/products">
              <Button className="w-full">Log In</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">Create Account</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show access denied if user is not admin
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <UserX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              You need admin privileges to access product management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Current role: <span className="font-medium">{user.role}</span>
            </div>
            <Link href="/promote-admin">
              <Button className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Get Admin Access
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">Back to Store</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AdminLayout>
      <ProductManagement />
    </AdminLayout>
  )
}
