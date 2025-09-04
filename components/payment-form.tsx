"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Wallet, Shield, AlertCircle } from "lucide-react"
import { paymentMethods, validateCard, formatCardNumber, formatExpiryDate, type CardDetails } from "@/lib/payment"

interface PaymentFormProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  cardDetails: CardDetails
  onCardDetailsChange: (details: CardDetails) => void
  isProcessing?: boolean
}

export function PaymentForm({
  selectedMethod,
  onMethodChange,
  cardDetails,
  onCardDetailsChange,
  isProcessing = false,
}: PaymentFormProps) {
  const [cardValidation, setCardValidation] = useState({ valid: true, type: "" })

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    const validation = validateCard(value)

    setCardValidation(validation)
    onCardDetailsChange({
      ...cardDetails,
      cardNumber: formatted,
    })
  }

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiryDate(value)
    onCardDetailsChange({
      ...cardDetails,
      expiryDate: formatted,
    })
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "paypal":
        return <Wallet className="h-5 w-5" />
      case "apple_pay":
      case "google_pay":
        return <Smartphone className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Method</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
          {paymentMethods
            .filter((method) => method.enabled)
            .map((method) => (
              <div
                key={method.id}
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                  {getPaymentIcon(method.type)}
                  <span className="font-medium">{method.name}</span>
                  {method.type === "card" && (
                    <div className="flex space-x-1 ml-auto">
                      <Badge variant="outline" className="text-xs">
                        Visa
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        MC
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Amex
                      </Badge>
                    </div>
                  )}
                </Label>
              </div>
            ))}
        </RadioGroup>

        {/* Card Details Form */}
        {selectedMethod === "card" && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  maxLength={19}
                  className={!cardValidation.valid && cardDetails.cardNumber ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {cardValidation.type && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {cardValidation.type}
                    </Badge>
                  </div>
                )}
              </div>
              {!cardValidation.valid && cardDetails.cardNumber && (
                <div className="flex items-center space-x-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Invalid card number</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  maxLength={5}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => onCardDetailsChange({ ...cardDetails, cvv: e.target.value })}
                  maxLength={4}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  placeholder="John Doe"
                  value={cardDetails.nameOnCard}
                  onChange={(e) => onCardDetailsChange({ ...cardDetails, nameOnCard: e.target.value })}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        )}

        {/* Alternative Payment Methods */}
        {selectedMethod === "paypal" && (
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4">
              You will be redirected to PayPal to complete your payment securely.
            </p>
            <Button variant="outline" disabled>
              <Wallet className="mr-2 h-4 w-4" />
              Continue with PayPal
            </Button>
          </div>
        )}

        {(selectedMethod === "apple_pay" || selectedMethod === "google_pay") && (
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Use your {selectedMethod === "apple_pay" ? "Touch ID, Face ID, or passcode" : "fingerprint or PIN"} to pay
              securely.
            </p>
            <Button variant="outline" disabled>
              <Smartphone className="mr-2 h-4 w-4" />
              Pay with {selectedMethod === "apple_pay" ? "Apple Pay" : "Google Pay"}
            </Button>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <Shield className="h-4 w-4" />
          <span>Your payment information is encrypted and secure. We never store your card details.</span>
        </div>
      </CardContent>
    </Card>
  )
}
