"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatGHS, convertUSDToGHS } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, RefreshCw, Download, Calendar, BarChart3 } from "lucide-react"

// Mock financial data
const mockSalesData = [
  { date: "2024-01-22", revenue: convertUSDToGHS(2456.78), orders: 23, avgOrder: convertUSDToGHS(106.82) },
  { date: "2024-01-21", revenue: convertUSDToGHS(1890.45), orders: 18, avgOrder: convertUSDToGHS(105.02) },
  { date: "2024-01-20", revenue: convertUSDToGHS(3201.56), orders: 31, avgOrder: convertUSDToGHS(103.27) },
  { date: "2024-01-19", revenue: convertUSDToGHS(2789.12), orders: 26, avgOrder: convertUSDToGHS(107.27) },
  { date: "2024-01-18", revenue: convertUSDToGHS(1456.89), orders: 15, avgOrder: convertUSDToGHS(97.12) },
]

const mockRefunds = [
  { id: "REF-001", orderId: "ORD-123", amount: convertUSDToGHS(299.99), reason: "Product defective", status: "processed", date: "2024-01-22" },
  { id: "REF-002", orderId: "ORD-124", amount: convertUSDToGHS(79.99), reason: "Customer request", status: "pending", date: "2024-01-21" },
  { id: "REF-003", orderId: "ORD-125", amount: convertUSDToGHS(149.99), reason: "Wrong size", status: "processed", date: "2024-01-20" },
]

const mockPayouts = [
  { id: "PAY-001", amount: convertUSDToGHS(4567.89), fee: convertUSDToGHS(136.78), net: convertUSDToGHS(4431.11), status: "completed", date: "2024-01-20" },
  { id: "PAY-002", amount: convertUSDToGHS(3245.67), fee: convertUSDToGHS(97.37), net: convertUSDToGHS(3148.30), status: "pending", date: "2024-01-22" },
]

export function FinancialManagement() {
  const [salesData] = useState(mockSalesData)
  const [refunds] = useState(mockRefunds)
  const [payouts] = useState(mockPayouts)
  const [dateRange, setDateRange] = useState("7days")

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const avgOrderValue = totalRevenue / totalOrders
  const totalRefunds = refunds.reduce((sum, refund) => sum + refund.amount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "processed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground">Monitor revenue, refunds, and financial performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 days</SelectItem>
              <SelectItem value="30days">30 days</SelectItem>
              <SelectItem value="90days">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatGHS(convertUSDToGHS(totalRevenue))}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatGHS(avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +3.8% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatGHS(totalRefunds)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -2.1% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue ({salesData.length} days)</CardTitle>
              <CardDescription>Track your daily sales performance and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Avg Order Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((day, index) => (
                    <TableRow key={day.date}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{day.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatGHS(day.revenue)}</TableCell>
                      <TableCell>{day.orders}</TableCell>
                      <TableCell>{formatGHS(day.avgOrder)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Refund Requests ({refunds.length})</CardTitle>
              <CardDescription>Manage and process customer refund requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-medium">{refund.id}</TableCell>
                      <TableCell>{refund.orderId}</TableCell>
                      <TableCell>{formatGHS(refund.amount)}</TableCell>
                      <TableCell>{refund.reason}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(refund.status)} variant="secondary">
                          {refund.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{refund.date}</TableCell>
                      <TableCell>
                        {refund.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Approve</Button>
                            <Button size="sm" variant="outline">Reject</Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payouts ({payouts.length})</CardTitle>
              <CardDescription>Track your payment transfers and fees</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Gross Amount</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.id}</TableCell>
                      <TableCell>{formatGHS(payout.amount)}</TableCell>
                      <TableCell>{formatGHS(payout.fee)}</TableCell>
                      <TableCell className="font-medium">{formatGHS(payout.net)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payout.status)} variant="secondary">
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payout.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}