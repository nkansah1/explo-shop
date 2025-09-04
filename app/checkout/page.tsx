"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { PaymentForm } from "@/components/payment-form"
import { Truck, Shield, ArrowLeft, AlertCircle } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { formatGHS, convertUSDToGHS } from "@/lib/utils"
import { processPayment, type CardDetails, type PaymentRequest } from "@/lib/payment"

// Force dynamic rendering for checkout page to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  const { items, getTotalPrice, createOrder } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  })

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

  const subtotal = getTotalPrice()
  const shippingCost = shippingMethod === "express" ? convertUSDToGHS(15.99) : subtotal > convertUSDToGHS(50) ? 0 : convertUSDToGHS(9.99)
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const handleInputChange = (section: "shipping", field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setPaymentError("")
    setFieldErrors({})

    // Validate required fields
    const requiredFields = [
      { value: shippingInfo.firstName, name: "First Name", key: "firstName" },
      { value: shippingInfo.lastName, name: "Last Name", key: "lastName" },
      { value: shippingInfo.email, name: "Email", key: "email" },
      { value: shippingInfo.phone, name: "Phone", key: "phone" },
      { value: shippingInfo.address, name: "Address", key: "address" },
      { value: shippingInfo.city, name: "City", key: "city" },
      { value: shippingInfo.state, name: "State", key: "state" },
      { value: shippingInfo.zipCode, name: "ZIP Code", key: "zipCode" },
    ]

    const emptyFields = requiredFields.filter(field => !field.value.trim())
    
    if (emptyFields.length > 0) {
      const errors: Record<string, boolean> = {}
      emptyFields.forEach(field => {
        errors[field.key] = true
      })
      setFieldErrors(errors)
      setPaymentError(`Please fill in required fields: ${emptyFields.map(f => f.name).join(', ')}`)
      setIsProcessing(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingInfo.email)) {
      setPaymentError("Please enter a valid email address")
      setIsProcessing(false)
      return
    }

    // Validate payment details if using card
    if (paymentMethod === "card") {
      const cardRequiredFields = [
        { value: cardDetails.cardNumber, name: "Card Number" },
        { value: cardDetails.expiryDate, name: "Expiry Date" },
        { value: cardDetails.cvv, name: "CVV" },
        { value: cardDetails.nameOnCard, name: "Name on Card" },
      ]
      
      const emptyCardFields = cardRequiredFields.filter(field => !field.value.trim())
      
      if (emptyCardFields.length > 0) {
        setPaymentError(`Please fill in card details: ${emptyCardFields.map(f => f.name).join(', ')}`)
        setIsProcessing(false)
        return
      }
    }

    try {
      const paymentRequest: PaymentRequest = {
        amount: total,
        currency: "GHS",
        paymentMethod,
        cardDetails: paymentMethod === "card" ? cardDetails : undefined,
        billingAddress: sameAsBilling
          ? {
              firstName: shippingInfo.firstName,
              lastName: shippingInfo.lastName,
              address: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              zipCode: shippingInfo.zipCode,
              country: shippingInfo.country,
            }
          : undefined,
      }

      const result = await processPayment(paymentRequest)

      if (result.success) {
        // Create order in database
        const orderId = await createOrder({
          subtotal,
          tax_amount: tax,
          shipping_amount: shippingCost,
          total,
          billing: sameAsBilling
            ? {
                firstName: shippingInfo.firstName,
                lastName: shippingInfo.lastName,
                address: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                zipCode: shippingInfo.zipCode,
                country: shippingInfo.country,
              }
            : shippingInfo, // For now, use shipping as billing
          shipping: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            country: shippingInfo.country,
          },
          payment_method: paymentMethod,
        })

        if (orderId) {
          toast({
            title: "Order placed successfully!",
            description: `Order ID: ${orderId}`,
          })

          router.push(`/order-confirmation?orderId=${orderId}`)
        } else {
          throw new Error("Failed to create order")
        }
      } else {
        setPaymentError(result.error || "Payment failed. Please try again.")
        toast({
          title: "Payment failed",
          description: result.error || "Please check your payment details and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setPaymentError("An unexpected error occurred. Please try again.")
      toast({
        title: "Payment error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    router.push("/login?redirect=/checkout")
    return null
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Shipping Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange("shipping", "firstName", e.target.value)}
                        className={fieldErrors.firstName ? "border-destructive" : ""}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange("shipping", "lastName", e.target.value)}
                        className={fieldErrors.lastName ? "border-destructive" : ""}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange("shipping", "email", e.target.value)}
                        className={fieldErrors.email ? "border-destructive" : ""}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange("shipping", "phone", e.target.value)}
                        className={fieldErrors.phone ? "border-destructive" : ""}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange("shipping", "address", e.target.value)}
                      className={fieldErrors.address ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange("shipping", "city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={shippingInfo.state}
                        onValueChange={(value) => handleInputChange("shipping", "state", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleInputChange("shipping", "zipCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Standard Shipping</div>
                            <div className="text-sm text-muted-foreground">5-7 business days</div>
                          </div>
                          <div className="font-medium">{subtotal > convertUSDToGHS(50) ? "Free" : formatGHS(convertUSDToGHS(9.99))}</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Express Shipping</div>
                            <div className="text-sm text-muted-foreground">2-3 business days</div>
                          </div>
                          <div className="font-medium">{formatGHS(convertUSDToGHS(15.99))}</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <PaymentForm
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                cardDetails={cardDetails}
                onCardDetailsChange={setCardDetails}
                isProcessing={isProcessing}
              />

              {paymentError && (
                <div className="flex items-center space-x-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span className="text-sm text-destructive">{paymentError}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sameAsBilling" 
                  checked={sameAsBilling} 
                  onCheckedChange={(checked) => setSameAsBilling(checked === true)} 
                />
                <Label htmlFor="sameAsBilling" className="text-sm">
                  Billing address same as shipping address
                </Label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-medium">{formatGHS(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatGHS(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? "Free" : formatGHS(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatGHS(tax)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatGHS(total)}</span>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                    {isProcessing ? "Processing Payment..." : `Place Order - ${formatGHS(total)}`}
                  </Button>

                  <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure SSL encrypted checkout</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
