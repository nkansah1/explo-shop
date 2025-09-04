import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Ghana Cedis currency formatting function
export function formatGHS(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Convert USD to GHS (approximate rate: 1 USD = 12 GHS)
export function convertUSDToGHS(usdAmount: number): number {
  return usdAmount * 12
}
