// Mock payment processing utilities
// In production, this would integrate with Stripe, PayPal, etc.

export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "apple_pay" | "google_pay"
  name: string
  icon: string
  enabled: boolean
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  paymentMethod?: string
}

export interface CardDetails {
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
}

export interface PaymentRequest {
  amount: number
  currency: string
  paymentMethod: string
  cardDetails?: CardDetails
  billingAddress?: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

// Mock payment methods available
export const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    type: "card",
    name: "Credit/Debit Card",
    icon: "💳",
    enabled: true,
  },
  {
    id: "paypal",
    type: "paypal",
    name: "PayPal",
    icon: "🅿️",
    enabled: true,
  },
  {
    id: "apple_pay",
    type: "apple_pay",
    name: "Apple Pay",
    icon: "🍎",
    enabled: true,
  },
  {
    id: "google_pay",
    type: "google_pay",
    name: "Google Pay",
    icon: "🔵",
    enabled: true,
  },
]

// Mock card validation
export const validateCard = (cardNumber: string): { valid: boolean; type?: string } => {
  const cleaned = cardNumber.replace(/\s/g, "")

  if (cleaned.length < 13 || cleaned.length > 19) {
    return { valid: false }
  }

  // Simple Luhn algorithm check
  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleaned[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  const valid = sum % 10 === 0

  // Determine card type
  let type = "unknown"
  if (cleaned.startsWith("4")) type = "visa"
  else if (cleaned.startsWith("5") || cleaned.startsWith("2")) type = "mastercard"
  else if (cleaned.startsWith("3")) type = "amex"

  return { valid, type }
}

// Mock payment processing
export const processPayment = async (request: PaymentRequest): Promise<PaymentResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock validation
  if (request.amount <= 0) {
    return {
      success: false,
      error: "Invalid amount",
    }
  }

  if (request.paymentMethod === "card" && request.cardDetails) {
    const cardValidation = validateCard(request.cardDetails.cardNumber)
    if (!cardValidation.valid) {
      return {
        success: false,
        error: "Invalid card number",
      }
    }

    // Mock declined card
    if (request.cardDetails.cardNumber.includes("0000")) {
      return {
        success: false,
        error: "Card declined",
      }
    }
  }

  // Mock successful payment
  return {
    success: true,
    transactionId: "txn_" + Math.random().toString(36).substr(2, 9),
    paymentMethod: request.paymentMethod,
  }
}

// Format card number for display
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, "")
  const match = cleaned.match(/.{1,4}/g)
  return match ? match.join(" ") : cleaned
}

// Format expiry date
export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + (cleaned.length > 2 ? "/" + cleaned.substring(2, 4) : "")
  }
  return cleaned
}
