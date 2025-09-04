"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react"

interface DeploymentStatus {
  supabaseUrl: string | undefined
  supabaseKey: string | undefined
  isProduction: boolean
  hasValidConfig: boolean
  environment: string
}

export function DeploymentDebug() {
  const [status, setStatus] = useState<DeploymentStatus | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const isProduction = process.env.NODE_ENV === "production"
    
    const hasValidConfig = !!(
      supabaseUrl && 
      supabaseKey && 
      !supabaseUrl.includes("your-project-id") && 
      !supabaseKey.includes("your-supabase-anon-key") &&
      supabaseUrl.includes("supabase.co")
    )

    setStatus({
      supabaseUrl,
      supabaseKey,
      isProduction,
      hasValidConfig,
      environment: isProduction ? "production" : "development"
    })

    // Auto-show in production if there are issues
    if (isProduction && !hasValidConfig) {
      setIsVisible(true)
    }
  }, [])

  if (!status) return null

  // Only show debug panel if there are issues or if manually triggered
  if (!isVisible && status.hasValidConfig) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-md text-sm font-medium border border-green-300"
        >
          <Info className="h-4 w-4 inline mr-1" />
          Debug
        </button>
      </div>
    )
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="border-2 border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              {status.hasValidConfig ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              )}
              Deployment Status
            </CardTitle>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Environment:</div>
            <Badge variant={status.isProduction ? "default" : "secondary"}>
              {status.environment}
            </Badge>
            
            <div>Supabase URL:</div>
            <div className="flex items-center">
              {status.supabaseUrl ? (
                status.supabaseUrl.includes("supabase.co") ? (
                  <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Valid
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 border-amber-600 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Invalid
                  </Badge>
                )
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
                  <XCircle className="h-3 w-3 mr-1" />
                  Missing
                </Badge>
              )}
            </div>

            <div>Supabase Key:</div>
            <div className="flex items-center">
              {status.supabaseKey && !status.supabaseKey.includes("your-supabase-anon-key") ? (
                <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Set
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
                  <XCircle className="h-3 w-3 mr-1" />
                  Missing
                </Badge>
              )}
            </div>
          </div>

          {!status.hasValidConfig && (
            <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 font-medium mb-2">
                🚨 Configuration Issues Detected
              </p>
              <ul className="text-xs text-amber-700 space-y-1">
                {!status.supabaseUrl && (
                  <li>• Missing NEXT_PUBLIC_SUPABASE_URL</li>
                )}
                {!status.supabaseKey && (
                  <li>• Missing NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                )}
                {status.supabaseUrl && !status.supabaseUrl.includes("supabase.co") && (
                  <li>• Invalid Supabase URL format</li>
                )}
              </ul>
              <p className="text-xs text-amber-700 mt-2">
                Configure environment variables in Vercel dashboard
              </p>
            </div>
          )}

          {status.isProduction && (
            <div className="text-xs text-gray-600 border-t pt-2">
              <strong>Deployed URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}