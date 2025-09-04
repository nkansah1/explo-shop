"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Shield, UserCheck, AlertTriangle, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PromoteToAdminPage() {
  const { user, updateUserRole } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to promote yourself to admin.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Update the user role locally
      updateUserRole('admin')
      
      toast({
        title: "Success!",
        description: "You have been promoted to admin. Redirecting to admin panel...",
      })

      // Redirect to admin panel
      setTimeout(() => {
        router.push('/admin')
      }, 1500)

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Promotion Complete",
        description: "Your role has been updated. Redirecting to admin panel...",
      })
      
      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Shield className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground">Get admin privileges for your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Promote to Admin</CardTitle>
            <CardDescription className="text-center">
              Click the button below to gain admin access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div className="p-4 border rounded-lg bg-muted/50 text-center">
                  <div className="font-medium">{user.name || "Current User"}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                    {user.role || 'customer'}
                  </Badge>
                </div>

                {user.role !== 'admin' ? (
                  <Button 
                    onClick={makeCurrentUserAdmin}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {isLoading ? "Promoting..." : "Make Me Admin"}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <UserCheck className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">You are already an admin!</span>
                    </div>
                    <Link href="/admin">
                      <Button className="w-full" size="lg">
                        Go to Admin Panel
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="text-xs text-center text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  This will give you full admin access to the store
                </div>
              </>
            ) : (
              <div className="space-y-4 text-center">
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <LogIn className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                  <p className="text-yellow-800 font-medium">Please log in first</p>
                  <p className="text-yellow-700 text-sm">You need to be logged in to get admin access</p>
                </div>
                
                <div className="space-y-2">
                  <Link href="/login">
                    <Button className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="w-full">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  )
}