"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatGHS, convertUSDToGHS } from "@/lib/utils"
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
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Download, 
  Upload, 
  Filter, 
  MoreHorizontal,
  Eye,
  EyeOff,
  Package,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Type definitions
interface Product {
  id: number
  name: string
  category: string
  price: number
  compareAtPrice?: number | null
  stock: number
  sku: string
  status: string
  featured: boolean
  sales: number
  createdAt: string
  description?: string
  image?: string
}

// Mock product data with enhanced fields
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: convertUSDToGHS(299.99),
    compareAtPrice: 399.99,
    stock: 15,
    sku: "PWH-001",
    status: "active",
    image: "/premium-wireless-headphones.png",
    createdAt: "2024-01-15",
    sales: 245,
    featured: true,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    category: "Electronics",
    price: convertUSDToGHS(199.99),
    compareAtPrice: null,
    stock: 8,
    sku: "SFW-002",
    status: "active",
    image: "/smart-fitness-watch.png",
    createdAt: "2024-01-16",
    sales: 156,
    featured: true,
  },
  {
    id: 3,
    name: "Minimalist Desk Lamp",
    category: "Home",
    price: convertUSDToGHS(79.99),
    compareAtPrice: 99.99,
    stock: 0,
    sku: "MDL-003",
    status: "out_of_stock",
    image: "/minimalist-desk-lamp.png",
    createdAt: "2024-01-17",
    sales: 89,
    featured: false,
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    category: "Clothing",
    price: convertUSDToGHS(29.99),
    compareAtPrice: 39.99,
    stock: 45,
    sku: "OCT-004",
    status: "active",
    image: "/organic-cotton-tshirt.png",
    createdAt: "2024-01-18",
    sales: 312,
    featured: false,
  },
  {
    id: 5,
    name: "Professional Camera",
    category: "Electronics",
    price: convertUSDToGHS(1299.99),
    compareAtPrice: 1499.99,
    stock: 3,
    sku: "PC-005",
    status: "active",
    image: "/professional-camera.png",
    createdAt: "2024-01-19",
    sales: 23,
    featured: true,
  },
]

export function ProductManagement() {
  const [products, setProducts] = useState(mockProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState("name")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const { toast } = useToast()

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    compareAtPrice: "",
    stock: "",
    sku: "",
    description: "",
    featured: false,
  })

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "stock":
        return b.stock - a.stock
      case "sales":
        return b.sales - a.sales
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "discontinued":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Validation Error",
        description: "Name, price, and category are required.",
        variant: "destructive",
      })
      return
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      compareAtPrice: newProduct.compareAtPrice ? Number.parseFloat(newProduct.compareAtPrice) : null,
      stock: Number.parseInt(newProduct.stock) || 0,
      sku: newProduct.sku || `SKU-${Date.now()}`,
      status: "active",
      image: "/placeholder.svg",
      createdAt: new Date().toISOString().split("T")[0],
      sales: 0,
      featured: newProduct.featured,
    }

    setProducts([...products, product])
    setNewProduct({ 
      name: "", 
      category: "", 
      price: "", 
      compareAtPrice: "",
      stock: "", 
      sku: "",
      description: "",
      featured: false,
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Product Added",
      description: `${product.name} has been successfully added.`,
    })
  }

  const handleDeleteProduct = (id: number) => {
    const product = products.find((p) => p.id === id)
    setProducts(products.filter((p) => p.id !== id))
    
    toast({
      title: "Product Deleted",
      description: `${product?.name} has been successfully deleted.`,
    })
  }

  const handleBulkDelete = () => {
    const selectedProductNames = products
      .filter((p) => selectedProducts.includes(p.id))
      .map((p) => p.name)
      .slice(0, 3)
      .join(", ")
    
    setProducts(products.filter((p) => !selectedProducts.includes(p.id)))
    setSelectedProducts([])
    setShowBulkActions(false)
    
    toast({
      title: "Products Deleted",
      description: `Deleted ${selectedProducts.length} products including ${selectedProductNames}${selectedProducts.length > 3 ? '...' : ''}.`,
    })
  }

  const handleBulkStatusChange = (newStatus: string) => {
    setProducts(
      products.map((p) =>
        selectedProducts.includes(p.id) ? { ...p, status: newStatus } : p
      )
    )
    setSelectedProducts([])
    setShowBulkActions(false)
    
    toast({
      title: "Status Updated",
      description: `Updated status for ${selectedProducts.length} products to ${newStatus}.`,
    })
  }

  const handleBulkFeaturedToggle = () => {
    setProducts(
      products.map((p) =>
        selectedProducts.includes(p.id) ? { ...p, featured: !p.featured } : p
      )
    )
    setSelectedProducts([])
    setShowBulkActions(false)
    
    toast({
      title: "Featured Status Updated",
      description: `Updated featured status for ${selectedProducts.length} products.`,
    })
  }

  const handleExportProducts = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,SKU,Category,Price,Compare At Price,Stock,Status,Featured,Sales\n" +
      products.map(p => 
        `"${p.name}","${p.sku}","${p.category}",${p.price},${p.compareAtPrice || ''},${p.stock},"${p.status}",${p.featured},${p.sales}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "products.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Export Complete",
      description: "Products have been exported to CSV file.",
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(sortedProducts.map((p) => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }
  }

  const toggleProductStatus = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id 
          ? { ...p, status: p.status === "active" ? "draft" : "active" }
          : p
      )
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and catalog</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportProducts}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Create a new product for your store.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="Product SKU"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compare-price">Compare At Price</Label>
                    <Input
                      id="compare-price"
                      type="number"
                      step="0.01"
                      value={newProduct.compareAtPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Product description..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={newProduct.featured}
                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, featured: checked === true })}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddProduct}>
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedProducts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">{selectedProducts.length} selected</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedProducts([])
                    setShowBulkActions(false)
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("active")}>
                      Set as Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("draft")}>
                      Set as Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("discontinued")}>
                      Set as Discontinued
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkFeaturedToggle}
                >
                  Toggle Featured
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Product Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="stock">Stock Level</SelectItem>
                <SelectItem value="sales">Best Selling</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <Label className="text-sm">Price Range: {formatGHS(priceRange[0])} - {formatGHS(priceRange[1])}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-20"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products ({sortedProducts.length})</CardTitle>
              <CardDescription>Manage your product inventory and catalog</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {products.filter(p => p.status === "active").length} Active
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {products.filter(p => p.status === "out_of_stock").length} Out of Stock
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {products.filter(p => p.status === "draft").length} Draft
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.id} className={selectedProducts.includes(product.id) ? "bg-blue-50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, checked === true)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">Created {product.createdAt}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm">{product.sku}</code>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatGHS(product.price)}</div>
                      {product.compareAtPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatGHS(product.compareAtPrice)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className={product.stock === 0 ? "text-red-600 font-medium" : product.stock < 10 ? "text-orange-600" : ""}>
                        {product.stock}
                      </span>
                      {product.stock < 10 && product.stock > 0 && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                      {product.stock === 0 && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.sales}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(product.status)} variant="secondary">
                        {product.status.replace("_", " ")}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleProductStatus(product.id)}
                        title={product.status === "active" ? "Deactivate" : "Activate"}
                      >
                        {product.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.featured && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or create a new product.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
