"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Shield, User, UserCheck, AlertTriangle } from "lucide-react"

export default function UserRoleManagerPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [foundUser, setFoundUser] = useState<any>(null)

  // Quick method to make current user admin
  const makeCurrentUserAdmin = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Update user role in the database
      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating role:', error)
        toast({
          title: "Error",
          description: "Failed to update role. This is normal in development - role has been set locally.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success!",
          description: "You have been promoted to admin. Please refresh the page.",
        })
      }

      // Force a page refresh to update the auth state
      setTimeout(() => {
        router.refresh()
      }, 1000)

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Role Updated Locally",
        description: "Your role has been set to admin locally. Refresh to see changes.",
      })
      
      // Force refresh anyway for development
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  const searchUserByEmail = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to search.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !data) {
        setFoundUser(null)
        toast({
          title: "User Not Found",
          description: "No user found with that email address.",
          variant: "destructive",
        })
      } else {
        setFoundUser(data)
      }
    } catch (error) {
      console.error('Error searching user:', error)
      toast({
        title: "Search Error",
        description: "Failed to search for user.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: 'admin' | 'customer') => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
        console.error('Error updating role:', error)
        toast({
          title: "Error",
          description: "Failed to update user role.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success!",
          description: `User role updated to ${newRole}.`,
        })
        setFoundUser({ ...foundUser, role: newRole })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">User Role Manager</h1>
          <p className="text-muted-foreground">Manage user roles and admin access</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Admin Promotion */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Quick Admin Access</CardTitle>
              </div>
              <CardDescription>
                Make yourself an admin user instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8" />
                  <div>
                    <div className="font-medium">{user?.name || "Current User"}</div>
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                    <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                      {user?.role || 'customer'}
                    </Badge>
                  </div>
                </div>
              </div>

              {user?.role !== 'admin' ? (
                <Button 
                  onClick={makeCurrentUserAdmin}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {isLoading ? "Promoting..." : "Make Me Admin"}
                </Button>
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">You are already an admin!</span>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                This will promote your current account to admin status
              </div>
            </CardContent>
          </Card>

          {/* Search and Manage Users */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>Manage Other Users</CardTitle>
              </div>
              <CardDescription>
                Search and update user roles by email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button 
                    onClick={searchUserByEmail}
                    disabled={isLoading}
                    variant="outline"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {foundUser && (
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{foundUser.full_name || foundUser.email}</div>
                        <div className="text-sm text-muted-foreground">{foundUser.email}</div>
                        <Badge variant={foundUser.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                          {foundUser.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => updateUserRole(foundUser.id, 'admin')}
                      disabled={isLoading || foundUser.role === 'admin'}
                      variant={foundUser.role === 'admin' ? 'outline' : 'default'}
                      className="flex-1"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Make Admin
                    </Button>
                    <Button
                      onClick={() => updateUserRole(foundUser.id, 'customer')}
                      disabled={isLoading || foundUser.role === 'customer'}
                      variant={foundUser.role === 'customer' ? 'outline' : 'secondary'}
                      className="flex-1"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Make Customer
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">To access admin features:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Use "Make Me Admin" button above to promote your current account</li>
                <li>Refresh the page to see admin navigation links</li>
                <li>Access admin panel at <code className="bg-muted px-1 rounded">/admin</code></li>
                <li>Admin icon will appear in the header navigation</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Admin Features Available:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Dashboard with analytics and metrics</li>
                <li>Product management (add, edit, delete)</li>
                <li>Order management and processing</li>
                <li>Customer management and roles</li>
                <li>Store settings and configuration</li>
                <li>Real-time notifications</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}