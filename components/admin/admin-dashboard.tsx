"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatGHS, convertUSDToGHS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown, Eye, FolderOpen, FileText, Warehouse, Megaphone, BarChart3 } from "lucide-react"
import { AdminQuickActions } from "@/components/admin/admin-quick-actions"
import Link from "next/link"

// Mock data
const stats = [
  {
    title: "Total Revenue",
    value: formatGHS(convertUSDToGHS(45231.89)),
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "1,234",
    change: "+19%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Active Users",
    value: "573",
    change: "+201",
    trend: "up",
    icon: Users,
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    amount: formatGHS(convertUSDToGHS(299.99)),
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: formatGHS(convertUSDToGHS(199.99)),
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    amount: formatGHS(convertUSDToGHS(79.99)),
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    amount: formatGHS(convertUSDToGHS(149.99)),
    status: "pending",
    date: "2024-01-14",
  },
]

const topProducts = [
  {
    name: "Premium Wireless Headphones",
    sales: 145,
    revenue: formatGHS(convertUSDToGHS(43455)),
    trend: "up",
  },
  {
    name: "Smart Fitness Watch",
    sales: 98,
    revenue: formatGHS(convertUSDToGHS(19602)),
    trend: "up",
  },
  {
    name: "Minimalist Desk Lamp",
    sales: 76,
    revenue: formatGHS(convertUSDToGHS(6076)),
    trend: "down",
  },
  {
    name: "Organic Cotton T-Shirt",
    sales: 203,
    revenue: formatGHS(convertUSDToGHS(6089)),
    trend: "up",
  },
]

export function AdminDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Complete administrative control over your ecommerce store. Manage everything from products to financials.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <AdminQuickActions />

      {/* Comprehensive Admin Management */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Management Hub</CardTitle>
          <CardDescription>Complete administrative control over your ecommerce store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Core Management */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Core Management</h4>
              <div className="space-y-3">
                <Link href="/admin/products" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
                  <Package className="h-5 w-5 mr-3 text-blue-500" />
                  <div>
                    <div className="font-medium">Product Management</div>
                    <div className="text-sm text-muted-foreground">Catalog, bulk operations, import/export</div>
                  </div>
                </Link>
                <Link href="/admin/orders" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
                  <ShoppingCart className="h-5 w-5 mr-3 text-green-500" />
                  <div>
                    <div className="font-medium">Order Management</div>
                    <div className="text-sm text-muted-foreground">Orders, refunds, customer communication</div>
                  </div>
                </Link>
                <Link href="/admin/categories" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
                  <FolderOpen className="h-5 w-5 mr-3 text-purple-500" />
                  <div>
                    <div className="font-medium">Category Management</div>
                    <div className="text-sm text-muted-foreground">Organize products, hierarchical structure</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Operations */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Operations</h4>
              <div className="space-y-3">
                <Link href="/admin/inventory" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
                  <Warehouse className="h-5 w-5 mr-3 text-orange-500" />
                  <div>
                    <div className="font-medium">Inventory Management</div>
                    <div className="text-sm text-muted-foreground">Stock control, suppliers, movements</div>
                  </div>
                </Link>
                <Link href="/admin/content" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
                  <FileText className="h-5 w-5 mr-3 text-teal-500" />
                  <div>
                    <div className="font-medium">Content Management</div>
                    <div className="text-sm text-muted-foreground">CMS, pages, banners, SEO</div>
                  </div>
                </Link>
                <Link href="/admin/customers" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
                  <Users className="h-5 w-5 mr-3 text-cyan-500" />
                  <div>
                    <div className="font-medium">Customer Management</div>
                    <div className="text-sm text-muted-foreground">User accounts, customer support</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Business Intelligence */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Business Intelligence</h4>
              <div className="space-y-3">
                <Link href="/admin/marketing" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
                  <Megaphone className="h-5 w-5 mr-3 text-pink-500" />
                  <div>
                    <div className="font-medium">Marketing Management</div>
                    <div className="text-sm text-muted-foreground">Promotions, coupons, email campaigns</div>
                  </div>
                </Link>
                <Link href="/admin/financials" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
                  <DollarSign className="h-5 w-5 mr-3 text-indigo-500" />
                  <div>
                    <div className="font-medium">Financial Management</div>
                    <div className="text-sm text-muted-foreground">Revenue, reports, payouts, refunds</div>
                  </div>
                </Link>
                <Link href="/admin/analytics" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
                  <BarChart3 className="h-5 w-5 mr-3 text-emerald-500" />
                  <div>
                    <div className="font-medium">Analytics & Reports</div>
                    <div className="text-sm text-muted-foreground">Performance metrics, insights</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your customers</CardDescription>
              </div>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)} variant="secondary">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </div>
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.sales} sales</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{product.revenue}</span>
                    {product.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
