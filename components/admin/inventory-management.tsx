"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Truck,
  BarChart3,
  FileText,
  Settings,
  Download,
  Upload
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock inventory data
const mockInventoryItems = [
  {
    id: 1,
    productId: 1,
    productName: "Premium Wireless Headphones",
    sku: "PWH-001",
    currentStock: 15,
    reservedStock: 3,
    availableStock: 12,
    reorderPoint: 10,
    maxStock: 50,
    location: "Warehouse A - A1-B2",
    supplier: "TechCorp Ltd",
    unitCost: 150.00,
    lastRestocked: "2024-01-20",
    status: "in_stock" as const,
  },
  {
    id: 2,
    productId: 2,
    productName: "Smart Fitness Watch",
    sku: "SFW-002",
    currentStock: 8,
    reservedStock: 2,
    availableStock: 6,
    reorderPoint: 15,
    maxStock: 40,
    location: "Warehouse A - B2-C3",
    supplier: "WearableTech Inc",
    unitCost: 89.50,
    lastRestocked: "2024-01-18",
    status: "low_stock" as const,
  },
  {
    id: 3,
    productId: 3,
    productName: "Minimalist Desk Lamp",
    sku: "MDL-003",
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    reorderPoint: 5,
    maxStock: 25,
    location: "Warehouse B - C1-D2",
    supplier: "HomeDesign Co",
    unitCost: 35.00,
    lastRestocked: "2024-01-10",
    status: "out_of_stock" as const,
  },
  {
    id: 4,
    productId: 4,
    productName: "Organic Cotton T-Shirt",
    sku: "OCT-004",
    currentStock: 45,
    reservedStock: 8,
    availableStock: 37,
    reorderPoint: 20,
    maxStock: 100,
    location: "Warehouse A - D1-E2",
    supplier: "EcoFashion Ltd",
    unitCost: 12.50,
    lastRestocked: "2024-01-22",
    status: "in_stock" as const,
  },
]

// Mock suppliers data
const mockSuppliers = [
  {
    id: 1,
    name: "TechCorp Ltd",
    email: "orders@techcorp.com",
    phone: "+1-555-0123",
    address: "123 Tech Street, Silicon Valley, CA",
    products: 12,
    status: "active",
    rating: 4.8,
    lastOrder: "2024-01-20",
  },
  {
    id: 2,
    name: "WearableTech Inc",
    email: "supply@wearabletech.com",
    phone: "+1-555-0456",
    address: "456 Innovation Blvd, Austin, TX",
    products: 8,
    status: "active",
    rating: 4.6,
    lastOrder: "2024-01-18",
  },
  {
    id: 3,
    name: "HomeDesign Co",
    email: "orders@homedesign.com",
    phone: "+1-555-0789",
    address: "789 Design Ave, New York, NY",
    products: 15,
    status: "inactive",
    rating: 4.2,
    lastOrder: "2024-01-10",
  },
]

// Mock stock movements
const mockStockMovements = [
  {
    id: 1,
    productName: "Premium Wireless Headphones",
    sku: "PWH-001",
    type: "sale",
    quantity: -2,
    reason: "Customer order #ORD-001",
    timestamp: "2024-01-22 14:30",
    user: "System",
  },
  {
    id: 2,
    productName: "Smart Fitness Watch",
    sku: "SFW-002",
    type: "restock",
    quantity: +20,
    reason: "Supplier delivery",
    timestamp: "2024-01-21 09:15",
    user: "Admin",
  },
  {
    id: 3,
    productName: "Organic Cotton T-Shirt",
    sku: "OCT-004",
    type: "adjustment",
    quantity: -3,
    reason: "Damaged items removed",
    timestamp: "2024-01-20 16:45",
    user: "Warehouse Manager",
  },
  {
    id: 4,
    productName: "Premium Wireless Headphones",
    sku: "PWH-001",
    type: "restock",
    quantity: +15,
    reason: "Supplier delivery",
    timestamp: "2024-01-20 11:00",
    user: "Admin",
  },
]

interface InventoryItem {
  id: number
  productId: number
  productName: string
  sku: string
  currentStock: number
  reservedStock: number
  availableStock: number
  reorderPoint: number
  maxStock: number
  location: string
  supplier: string
  unitCost: number
  lastRestocked: string
  status: "in_stock" | "low_stock" | "out_of_stock"
}

interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  address: string
  products: number
  status: string
  rating: number
  lastOrder: string
}

interface StockMovement {
  id: number
  productName: string
  sku: string
  type: string
  quantity: number
  reason: string
  timestamp: string
  user: string
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryItems)
  const [suppliers, setSuppliers] = useState(mockSuppliers)
  const [stockMovements, setStockMovements] = useState(mockStockMovements)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const { toast } = useToast()

  const [adjustmentData, setAdjustmentData] = useState({
    type: "adjustment",
    quantity: "",
    reason: "",
  })

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800"
      case "low_stock":
        return "bg-orange-100 text-orange-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "restock":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "adjustment":
        return <Settings className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleStockAdjustment = () => {
    if (!selectedItem || !adjustmentData.quantity || !adjustmentData.reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const adjustment = parseInt(adjustmentData.quantity)
    const newStock = selectedItem.currentStock + adjustment

    if (newStock < 0) {
      toast({
        title: "Invalid Adjustment",
        description: "Stock cannot be negative.",
        variant: "destructive",
      })
      return
    }

    // Update inventory
    setInventory(
      inventory.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              currentStock: newStock,
              availableStock: newStock - item.reservedStock,
              status: newStock === 0 ? "out_of_stock" : newStock <= item.reorderPoint ? "low_stock" : "in_stock",
            }
          : item
      )
    )

    // Add stock movement record
    const movement = {
      id: Date.now(),
      productName: selectedItem.productName,
      sku: selectedItem.sku,
      type: adjustmentData.type,
      quantity: adjustment,
      reason: adjustmentData.reason,
      timestamp: new Date().toLocaleString(),
      user: "Admin",
    }
    setStockMovements([movement, ...stockMovements])

    setAdjustmentData({ type: "adjustment", quantity: "", reason: "" })
    setSelectedItem(null)
    setIsAdjustmentDialogOpen(false)

    toast({
      title: "Stock Updated",
      description: `${selectedItem.productName} stock has been updated.`,
    })
  }

  const openAdjustmentDialog = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsAdjustmentDialogOpen(true)
  }

  const stats = {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => item.status === "low_stock").length,
    outOfStock: inventory.filter(item => item.status === "out_of_stock").length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0),
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor stock levels, suppliers, and inventory movements</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Stock
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Levels ({filteredInventory.length})</CardTitle>
              <CardDescription>Monitor and manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">{item.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{item.location}</div>
                          <div className="text-muted-foreground">{item.supplier}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.currentStock}</span>
                          {item.reservedStock > 0 && (
                            <Badge variant="outline" className="text-xs">
                              -{item.reservedStock} reserved
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={item.availableStock === 0 ? "text-red-600 font-medium" : ""}>
                          {item.availableStock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span>{item.reorderPoint}</span>
                          {item.currentStock <= item.reorderPoint && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)} variant="secondary">
                          {item.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAdjustmentDialog(item)}
                          >
                            Adjust Stock
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          {/* Suppliers Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Suppliers ({suppliers.length})</CardTitle>
                  <CardDescription>Manage your product suppliers and vendors</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-muted-foreground">{supplier.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{supplier.email}</div>
                          <div className="text-muted-foreground">{supplier.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{supplier.products}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{supplier.rating}</span>
                          <span className="text-muted-foreground">/5.0</span>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.lastOrder}</TableCell>
                      <TableCell>
                        <Badge 
                          className={supplier.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          variant="secondary"
                        >
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          {/* Stock Movements */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>Track all inventory changes and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{movement.productName}</div>
                          <div className="text-sm text-muted-foreground">{movement.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getMovementIcon(movement.type)}
                          <span className="capitalize">{movement.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={movement.quantity > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{movement.reason}</TableCell>
                      <TableCell>{movement.user}</TableCell>
                      <TableCell>{movement.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              {selectedItem && `Update stock levels for ${selectedItem.productName}`}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Current Stock: {selectedItem.currentStock}</Label>
                <Label>Available: {selectedItem.availableStock}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adjustment-type">Adjustment Type</Label>
                <Select
                  value={adjustmentData.type}
                  onValueChange={(value) => setAdjustmentData({ ...adjustmentData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                    <SelectItem value="restock">Restock</SelectItem>
                    <SelectItem value="damage">Damage/Loss</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Change</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={adjustmentData.quantity}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, quantity: e.target.value })}
                  placeholder="Enter positive or negative number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={adjustmentData.reason}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                  placeholder="Explain the reason for this adjustment"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleStockAdjustment}>Update Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}