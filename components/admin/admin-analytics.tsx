"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatGHS, convertUSDToGHS } from "@/lib/utils"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Eye,
  Calendar,
  Download,
  Filter
} from "lucide-react"

// Mock analytics data with Ghana Cedis
const analyticsData = {
  overview: {
    totalRevenue: convertUSDToGHS(45231.50),
    revenueChange: 12.5,
    totalOrders: 1247,
    ordersChange: 8.2,
    totalCustomers: 892,
    customersChange: 15.3,
    totalProducts: 156,
    productsChange: 3.1,
  },
  salesData: [
    { date: "2024-01-01", revenue: convertUSDToGHS(1200), orders: 15 },
    { date: "2024-01-02", revenue: convertUSDToGHS(1500), orders: 22 },
    { date: "2024-01-03", revenue: convertUSDToGHS(1100), orders: 18 },
    { date: "2024-01-04", revenue: convertUSDToGHS(1800), orders: 28 },
    { date: "2024-01-05", revenue: convertUSDToGHS(2100), orders: 32 },
    { date: "2024-01-06", revenue: convertUSDToGHS(1900), orders: 25 },
    { date: "2024-01-07", revenue: convertUSDToGHS(2300), orders: 35 },
  ],
  topProducts: [
    { 
      name: "Premium Wireless Headphones", 
      sales: 145, 
      revenue: convertUSDToGHS(43455), 
      growth: 12.5,
      category: "Electronics"
    },
    { 
      name: "Smart Fitness Watch", 
      sales: 98, 
      revenue: convertUSDToGHS(19602), 
      growth: 8.3,
      category: "Electronics"
    },
    { 
      name: "Organic Cotton T-Shirt", 
      sales: 203, 
      revenue: convertUSDToGHS(6089), 
      growth: -2.1,
      category: "Clothing"
    },
    { 
      name: "Minimalist Desk Lamp", 
      sales: 76, 
      revenue: convertUSDToGHS(6076), 
      growth: 5.7,
      category: "Home"
    },
  ],
  customerInsights: {
    newCustomers: 147,
    returningCustomers: 745,
    averageOrderValue: convertUSDToGHS(89.50),
    customerLifetimeValue: convertUSDToGHS(285.30),
  },
  geographicData: [
    { country: "Ghana", orders: 456, revenue: convertUSDToGHS(22300) },
    { country: "Nigeria", orders: 123, revenue: convertUSDToGHS(8900) },
    { country: "South Africa", orders: 98, revenue: convertUSDToGHS(7200) },
    { country: "Kenya", orders: 67, revenue: convertUSDToGHS(4500) },
    { country: "Egypt", orders: 45, revenue: convertUSDToGHS(3100) },
  ]
}

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  const formatCurrency = (amount: number) => {
    return formatGHS(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Insights and performance metrics for your store</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analyticsData.overview.totalRevenue)}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {analyticsData.overview.revenueChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={analyticsData.overview.revenueChange >= 0 ? "text-green-600" : "text-red-600"}>
                {formatPercentage(analyticsData.overview.revenueChange)}
              </span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalOrders.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">
                {formatPercentage(analyticsData.overview.ordersChange)}
              </span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalCustomers.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">
                {formatPercentage(analyticsData.overview.customersChange)}
              </span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalProducts}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">
                {formatPercentage(analyticsData.overview.productsChange)}
              </span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Best selling products in the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.category}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium text-sm">
                      {formatCurrency(product.revenue)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {product.sales} sales
                      </span>
                      <Badge 
                        variant={product.growth >= 0 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {formatPercentage(product.growth)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Understanding your customer behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">New Customers</div>
                  <div className="text-2xl font-bold">
                    {analyticsData.customerInsights.newCustomers}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Returning Customers</div>
                  <div className="text-2xl font-bold">
                    {analyticsData.customerInsights.returningCustomers}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Average Order Value</div>
                  <div className="font-medium">
                    {formatCurrency(analyticsData.customerInsights.averageOrderValue)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Customer Lifetime Value</div>
                  <div className="font-medium">
                    {formatCurrency(analyticsData.customerInsights.customerLifetimeValue)}
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="text-sm text-muted-foreground mb-2">Customer Distribution</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>New Customers</span>
                    <span>{((analyticsData.customerInsights.newCustomers / (analyticsData.customerInsights.newCustomers + analyticsData.customerInsights.returningCustomers)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${(analyticsData.customerInsights.newCustomers / (analyticsData.customerInsights.newCustomers + analyticsData.customerInsights.returningCustomers)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Sales performance by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.geographicData.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-6 bg-muted rounded flex items-center justify-center text-xs font-medium">
                      {country.country.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{country.country}</div>
                      <div className="text-xs text-muted-foreground">
                        {country.orders} orders
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(country.revenue)}</div>
                    <div className="w-32 bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(country.revenue / Math.max(...analyticsData.geographicData.map(c => c.revenue))) * 100}%` 
                        }}
                      ></div>
                    </div>
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