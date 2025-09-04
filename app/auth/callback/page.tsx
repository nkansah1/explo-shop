"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

function AuthCallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const { checkAuth } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      try {
        // Get the code from URL parameters
        const code = searchParams.get("code")
        const error = searchParams.get("error")
        const error_description = searchParams.get("error_description")

        if (error) {
          setStatus("error")
          setErrorMessage(error_description || error)
          return
        }

        if (code) {
          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setStatus("error")
            setErrorMessage(exchangeError.message)
            return
          }

          if (data.user) {
            // Check if this is email confirmation
            if (data.user.email_confirmed_at) {
              setStatus("success")
              
              // Update auth state
              await checkAuth()
              
              toast({
                title: "Email verified successfully!",
                description: "Your account has been activated. Welcome to EliteStore!",
              })

              // Redirect to login or dashboard after a short delay
              setTimeout(() => {
                router.push("/login?verified=true")
              }, 2000)
            } else {
              setStatus("error")
              setErrorMessage("Email verification failed. Please try again.")
            }
          } else {
            setStatus("error")
            setErrorMessage("No user data received. Please try again.")
          }
        } else {
          setStatus("error")
          setErrorMessage("No verification code found. Please check your email link.")
        }
      } catch (error: any) {
        console.error("Auth callback error:", error)
        setStatus("error")
        setErrorMessage(error.message || "An unexpected error occurred during verification.")
      }
    }

    handleAuthCallback()
  }, [searchParams, router, checkAuth, toast])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold">Verifying Your Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You can now access all features of your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting you to login in a moment...
              </p>
              <Link href="/login?verified=true">
                <Button className="w-full">
                  Continue to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Verification Failed</CardTitle>
          <CardDescription>
            {errorMessage || "We couldn't verify your email address. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Try Registration Again
              </Button>
            </Link>
            <div className="text-center text-sm text-muted-foreground">
              Need help?{" "}
              <a href="mailto:support@elitestore.com" className="text-primary hover:underline">
                Contact support
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}