"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { formatGHS, convertUSDToGHS } from "@/lib/utils"
import { useRouter } from "next/navigation"

const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: convertUSDToGHS(299.99),
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "/premium-wireless-headphones.png",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: convertUSDToGHS(199.99),
    rating: 4.6,
    reviews: 89,
    image: "/smart-fitness-watch.png",
    badge: "New",
  },
  {
    id: 3,
    name: "Minimalist Desk Lamp",
    price: convertUSDToGHS(79.99),
    rating: 4.9,
    reviews: 156,
    image: "/minimalist-desk-lamp.png",
    badge: null,
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: convertUSDToGHS(29.99),
    rating: 4.7,
    reviews: 203,
    image: "/organic-cotton-tshirt.png",
    badge: "Eco-Friendly",
  },
]

export function FeaturedProducts() {
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleAddToCart = async (product: (typeof featuredProducts)[0]) => {
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

  return (
    <section className="py-16 lg:py-24">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Featured Products</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Discover our most popular items, carefully selected for quality and style
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {product.badge && <Badge className="absolute top-3 left-3">{product.badge}</Badge>}
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-balance leading-tight">{product.name}</h3>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
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
      </div>
    </section>
  )
}
