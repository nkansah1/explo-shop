"use client"

import { useAuth } from "@/hooks/use-auth"
import { formatGHS, convertUSDToGHS } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, ShoppingBag, CreditCard, MapPin, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccountPage() {
  const { user, logout } = useAuth()
  const { orders } = useCart()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log('Account: Logout button clicked')
      await logout()
      console.log('Account: Logout completed successfully')
      router.push('/')
    } catch (error) {
      console.error('Account: Logout failed:', error)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const recentOrders = orders?.slice(0, 3) || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">Manage your account settings and view your order history</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Your personal details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Your latest purchases and order status</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length || 0} items • {formatGHS(order.total || 0)}
                      </p>
                    </div>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/orders">View All Orders</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button asChild>
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and shopping experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent" asChild>
                <Link href="/cart">
                  <ShoppingBag className="h-6 w-6" />
                  <span>View Cart</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent" asChild>
                <Link href="/orders">
                  <CreditCard className="h-6 w-6" />
                  <span>Order History</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
                <MapPin className="h-6 w-6" />
                <span>Addresses</span>
              </Button>
              {user.role === "admin" ? (
                <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent" asChild>
                  <Link href="/admin">
                    <Settings className="h-6 w-6" />
                    <span>Admin Panel</span>
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent" asChild>
                  <Link href="/promote-admin">
                    <Settings className="h-6 w-6" />
                    <span>Get Admin Access</span>
                  </Link>
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end">
              <Button variant="destructive" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
