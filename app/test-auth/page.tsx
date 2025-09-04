"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestAuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult("Testing Supabase connection...")
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('users').select('count').limit(1)
      
      if (error) {
        setResult(`Connection error: ${error.message}`)
      } else {
        setResult("✅ Supabase connection successful!")
      }
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    }
    
    setLoading(false)
  }

  const testSignUp = async () => {
    if (!email || !password || !name) {
      setResult("Please fill in all fields")
      return
    }

    setLoading(true)
    setResult("Testing sign up...")
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })
      
      if (error) {
        setResult(`Sign up error: ${error.message}`)
      } else if (data.user) {
        setResult(`✅ Sign up successful! User ID: ${data.user.id}`)
      } else {
        setResult("Sign up completed but no user data returned")
      }
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    }
    
    setLoading(false)
  }

  const testSignIn = async () => {
    if (!email || !password) {
      setResult("Please fill in email and password")
      return
    }

    setLoading(true)
    setResult("Testing sign in...")
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setResult(`Sign in error: ${error.message}`)
      } else if (data.user) {
        setResult(`✅ Sign in successful! User: ${data.user.email}`)
      } else {
        setResult("Sign in completed but no user data returned")
      }
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={loading} className="w-full">
            Test Supabase Connection
          </Button>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          
          <div className="space-y-2">
            <Button onClick={testSignUp} disabled={loading} className="w-full">
              Test Sign Up
            </Button>
            <Button onClick={testSignIn} disabled={loading} className="w-full" variant="outline">
              Test Sign In
            </Button>
          </div>
          
          {result && (
            <div className="p-4 bg-muted rounded text-sm">
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}