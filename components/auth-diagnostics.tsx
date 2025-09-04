"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle, Bug, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"

interface DiagnosticResult {
  test: string
  status: "pass" | "fail" | "warning"
  message: string
  details?: string
}

export function AuthDiagnostics() {
  const [isVisible, setIsVisible] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const { user, login, logout } = useAuth()

  const runDiagnostics = async () => {
    setIsRunning(true)
    const diagnosticResults: DiagnosticResult[] = []

    // Test 1: Environment Variables
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        diagnosticResults.push({
          test: "Environment Variables",
          status: "fail",
          message: "Missing Supabase environment variables",
          details: `URL: ${!!supabaseUrl}, Key: ${!!supabaseKey}`
        })
      } else if (supabaseUrl.includes('your-project') || supabaseKey.includes('your-supabase')) {
        diagnosticResults.push({
          test: "Environment Variables",
          status: "warning",
          message: "Environment variables contain placeholder values",
          details: "Variables are set but contain example/placeholder text"
        })
      } else {
        diagnosticResults.push({
          test: "Environment Variables",
          status: "pass",
          message: "Environment variables properly configured"
        })
      }
    } catch (error) {
      diagnosticResults.push({
        test: "Environment Variables",
        status: "fail",
        message: "Error checking environment variables",
        details: error instanceof Error ? error.message : String(error)
      })
    }

    // Test 2: Supabase Client Creation
    try {
      const supabase = createClient()
      diagnosticResults.push({
        test: "Supabase Client",
        status: "pass",
        message: "Supabase client created successfully"
      })

      // Test 3: Supabase Connection
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          diagnosticResults.push({
            test: "Supabase Connection",
            status: "fail",
            message: "Failed to connect to Supabase",
            details: error.message
          })
        } else {
          diagnosticResults.push({
            test: "Supabase Connection",
            status: "pass",
            message: "Successfully connected to Supabase"
          })
        }
      } catch (error) {
        diagnosticResults.push({
          test: "Supabase Connection",
          status: "fail",
          message: "Exception during Supabase connection test",
          details: error instanceof Error ? error.message : String(error)
        })
      }

      // Test 4: Auth State Check
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          diagnosticResults.push({
            test: "Auth State Check",
            status: "warning",
            message: "Error checking current auth state",
            details: error.message
          })
        } else {
          diagnosticResults.push({
            test: "Auth State Check",
            status: "pass",
            message: currentUser ? "User is authenticated" : "No current user session"
          })
        }
      } catch (error) {
        diagnosticResults.push({
          test: "Auth State Check",
          status: "fail",
          message: "Exception during auth state check",
          details: error instanceof Error ? error.message : String(error)
        })
      }

    } catch (error) {
      diagnosticResults.push({
        test: "Supabase Client",
        status: "fail",
        message: "Failed to create Supabase client",
        details: error instanceof Error ? error.message : String(error)
      })
    }

    // Test 5: Browser Environment
    const isProduction = process.env.NODE_ENV === 'production'
    const origin = typeof window !== 'undefined' ? window.location.origin : 'unknown'
    
    diagnosticResults.push({
      test: "Environment Info",
      status: "pass",
      message: `Running in ${isProduction ? 'production' : 'development'} mode`,
      details: `Origin: ${origin}`
    })

    setResults(diagnosticResults)
    setIsRunning(false)
  }

  const testLogin = async () => {
    try {
      // Use a test account - in production you should provide real test credentials
      const success = await login("test@example.com", "testpassword")
      console.log("Test login result:", success)
    } catch (error) {
      console.error("Test login error:", error)
    }
  }

  const testLogout = async () => {
    try {
      await logout()
      console.log("Test logout completed")
    } catch (error) {
      console.error("Test logout error:", error)
    }
  }

  const getStatusIcon = (status: "pass" | "fail" | "warning") => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
    }
  }

  const getStatusColor = (status: "pass" | "fail" | "warning") => {
    switch (status) {
      case "pass":
        return "text-green-600"
      case "fail":
        return "text-red-600"
      case "warning":
        return "text-amber-600"
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
        >
          <Bug className="h-4 w-4 mr-2" />
          Auth Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-lg">
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Bug className="h-5 w-5 text-blue-600 mr-2" />
              Authentication Diagnostics
            </CardTitle>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current User Status */}
          <div className="p-3 bg-white rounded border">
            <div className="text-sm font-medium mb-1">Current User:</div>
            {user ? (
              <div className="text-xs">
                <div>Email: {user.email}</div>
                <div>Role: {user.role}</div>
                <Badge variant="outline" className="text-green-600 border-green-600 mt-1">
                  Authenticated
                </Badge>
              </div>
            ) : (
              <Badge variant="outline" className="text-gray-600 border-gray-600">
                Not authenticated
              </Badge>
            )}
          </div>

          {/* Test Actions */}
          <div className="flex gap-2">
            <Button
              onClick={runDiagnostics}
              disabled={isRunning}
              size="sm"
              className="text-xs"
            >
              {isRunning ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Run Tests
            </Button>
            
            <Button
              onClick={testLogout}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Test Logout
            </Button>
          </div>

          {/* Diagnostic Results */}
          {results.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="p-2 bg-white rounded border text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <div className={getStatusColor(result.status)}>
                    {result.message}
                  </div>
                  {result.details && (
                    <div className="text-gray-600 mt-1 text-xs">
                      {result.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}