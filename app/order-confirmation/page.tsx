"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail, CreditCard } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

interface OrderDetails {
  orderId: string
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  timestamp: string
}

function OrderConfirmationContent() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const { items, getTotalPrice } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Try to get order ID from URL params first
    const orderId = searchParams.get('orderId')
    
    if (orderId) {
      // Create order details from current cart and URL params
      const details: OrderDetails = {
        orderId,
        total: getTotalPrice(),
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        timestamp: new Date().toISOString()
      }
      setOrderDetails(details)
    } else {
      // Fallback to localStorage for backwards compatibility
      const storedOrder = localStorage.getItem("lastOrder")
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder)
        setOrderDetails({
          orderId: parsed.transactionId || parsed.orderId,
          total: parsed.total,
          items: parsed.items || [],
          timestamp: parsed.timestamp
        })
      } else {
        // No order found, redirect to home
        router.push('/')
      }
    }
  }, [searchParams, items, getTotalPrice, router])

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-16">
          <div className="text-center">
            <p>Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const orderNumber = orderDetails.orderId || "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-balance">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Thank you for your purchase. Your order has been successfully placed and is being processed.
            </p>
            <div className="text-sm text-muted-foreground">
              Order Number: <span className="font-mono font-medium">{orderNumber}</span>
            </div>
            {orderDetails && (
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Total: ${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Order Status Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Confirmation Email Sent</div>
                    <div className="text-sm text-muted-foreground">
                      You'll receive an email confirmation shortly with your order details.
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Order Processing</div>
                    <div className="text-sm text-muted-foreground">
                      We're preparing your items for shipment. This usually takes 1-2 business days.
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Shipped</div>
                    <div className="text-sm text-muted-foreground">
                      Once shipped, you'll receive tracking information to monitor your delivery.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
              <Button variant="outline" size="lg">
                View Order Details
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Need help with your order?</p>
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-16">
          <div className="text-center">
            <p>Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
