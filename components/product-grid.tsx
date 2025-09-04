"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { formatGHS, convertUSDToGHS } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Mock product data - in real app, this would come from an API
const allProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: convertUSDToGHS(299.99),
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "/premium-wireless-headphones.png",
    category: "electronics",
    badge: "Best Seller",
    description: "High-quality wireless headphones with noise cancellation",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: convertUSDToGHS(199.99),
    rating: 4.6,
    reviews: 89,
    image: "/smart-fitness-watch.png",
    category: "electronics",
    badge: "New",
    description: "Advanced fitness tracking with heart rate monitoring",
  },
  {
    id: 3,
    name: "Minimalist Desk Lamp",
    price: convertUSDToGHS(79.99),
    rating: 4.9,
    reviews: 156,
    image: "/minimalist-desk-lamp.png",
    category: "home",
    badge: null,
    description: "Modern LED desk lamp with adjustable brightness",
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: convertUSDToGHS(29.99),
    rating: 4.7,
    reviews: 203,
    image: "/organic-cotton-tshirt.png",
    category: "clothing",
    badge: "Eco-Friendly",
    description: "Sustainable organic cotton t-shirt in multiple colors",
  },
  {
    id: 5,
    name: "Wireless Charging Pad",
    price: convertUSDToGHS(49.99),
    rating: 4.5,
    reviews: 78,
    image: "/wireless-charging-pad.png",
    category: "electronics",
    badge: null,
    description: "Fast wireless charging for all compatible devices",
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug Set",
    price: convertUSDToGHS(39.99),
    rating: 4.8,
    reviews: 145,
    image: "/ceramic-coffee-mug-set.png",
    category: "home",
    badge: null,
    description: "Handcrafted ceramic mugs perfect for your morning coffee",
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    price: convertUSDToGHS(89.99),
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 92,
    image: "/bluetooth-speaker.png",
    category: "electronics",
    badge: "Sale",
    description: "Portable speaker with premium sound quality",
  },
  {
    id: 8,
    name: "Yoga Mat Premium",
    price: convertUSDToGHS(59.99),
    rating: 4.9,
    reviews: 167,
    image: "/yoga-mat-premium.png",
    category: "fitness",
    badge: null,
    description: "Non-slip yoga mat made from eco-friendly materials",
  },
]

interface ProductGridProps {
  searchQuery: string
  selectedCategory: string
  priceRange: number[]
  sortBy: string
  viewMode: "grid" | "list"
}

export function ProductGrid({ searchQuery, selectedCategory, priceRange, sortBy, viewMode }: ProductGridProps) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // Keep original order for "featured"
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  const handleAddToCart = async (product: (typeof allProducts)[0]) => {
    try {
      await addItem({
        product_id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
      
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding to cart:", error)
    }
  }

  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {filteredAndSortedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex">
              <div className="relative w-48 h-48">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && <Badge className="absolute top-3 left-3">{product.badge}</Badge>}
              </div>

              <CardContent className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors">{product.name}</h3>
                    </Link>

                    <p className="text-muted-foreground text-sm">{product.description}</p>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold">{formatGHS(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button size="sm" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAndSortedProducts.map((product) => (
        <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {product.badge && <Badge className="absolute top-3 left-3">{product.badge}</Badge>}

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <Button variant="secondary" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Link href={`/products/${product.id}`}>
                <Button variant="secondary" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-balance leading-tight hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews})</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">{formatGHS(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>

            <Button className="w-full group" onClick={() => handleAddToCart(product)}>
              <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
