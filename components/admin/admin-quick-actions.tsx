"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Settings,
  Download,
  Upload,
  FolderOpen,
  FileText,
  Warehouse,
  Megaphone,
  DollarSign,
  TrendingUp
} from "lucide-react"

export function AdminQuickActions() {
  const router = useRouter()
  const quickActions = [
    {
      title: "Products",
      description: "Manage inventory",
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Orders",
      description: "Manage orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Categories",
      description: "Organize products",
      icon: FolderOpen,
      href: "/admin/categories",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Inventory",
      description: "Stock control",
      icon: Warehouse,
      href: "/admin/inventory",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Content",
      description: "CMS & Pages",
      icon: FileText,
      href: "/admin/content",
      color: "bg-teal-500 hover:bg-teal-600"
    },
    {
      title: "Marketing",
      description: "Promotions & Email",
      icon: Megaphone,
      href: "/admin/marketing",
      color: "bg-pink-500 hover:bg-pink-600"
    },
    {
      title: "Financials",
      description: "Revenue & Reports",
      icon: DollarSign,
      href: "/admin/financials",
      color: "bg-indigo-500 hover:bg-indigo-600"
    },
    {
      title: "Customers",
      description: "User management",
      icon: Users,
      href: "/admin/customers",
      color: "bg-cyan-500 hover:bg-cyan-600"
    },
    {
      title: "Analytics",
      description: "View reports",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
      title: "Settings",
      description: "Configure store",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500 hover:bg-gray-600"
    }
  ]

  const utilityActions = [
    {
      title: "Add New Product",
      description: "Quick product creation",
      icon: Plus,
      action: () => router.push('/admin/products'),
    },
    {
      title: "Export Data",
      description: "Download reports",
      icon: Download,
      action: () => console.log("Export data"),
    },
    {
      title: "Import Products",
      description: "Bulk upload",
      icon: Upload,
      action: () => console.log("Import products"),
    },
    {
      title: "View Analytics",
      description: "Performance metrics",
      icon: TrendingUp,
      action: () => router.push('/admin/analytics'),
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Navigation */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="group flex flex-col items-center p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <div className={`p-3 rounded-full ${action.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Utility Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Utilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {utilityActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                onClick={action.action}
                className="h-auto p-4 flex items-center space-x-4 justify-start"
              >
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}