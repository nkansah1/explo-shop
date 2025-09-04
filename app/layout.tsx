import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/auth-provider'
import { AuthErrorBoundary } from '@/components/auth-error-boundary'
import { CartProvider } from '@/components/cart-provider'
import { DevConfigCheck } from '@/components/dev-config-check'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthErrorBoundary>
            <AuthProvider>
              <CartProvider>
                {children}
                <Toaster />
                <DevConfigCheck />
              </CartProvider>
            </AuthProvider>
          </AuthErrorBoundary>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
