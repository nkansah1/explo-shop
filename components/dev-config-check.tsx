"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface ConfigStatus {
  supabaseUrl: boolean
  supabaseKey: boolean
  isProduction: boolean
}

export function DevConfigCheck() {
  const [config, setConfig] = useState<ConfigStatus | null>(null)
  const [showCheck, setShowCheck] = useState(false)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const isProduction = process.env.NODE_ENV === "production"

    setConfig({
      supabaseUrl: !!(supabaseUrl && !supabaseUrl.includes("your-project-id")),
      supabaseKey: !!(supabaseKey && !supabaseKey.includes("your-supabase-anon-key")),
      isProduction,
    })
  }, [])

  if (!config || config.isProduction) return null

  const allGood = config.supabaseUrl && config.supabaseKey

  if (allGood && !showCheck) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!allGood && (
        <Card className="w-80 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-5 w-5" />
              Configuration Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Supabase URL</span>
                {config.supabaseUrl ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Set
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Supabase Key</span>
                {config.supabaseKey ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Set
                  </Badge>
                )}
              </div>
            </div>
            
            {!allGood && (
              <div className="text-xs text-yellow-700 dark:text-yellow-300">
                Please update your .env.local file with actual Supabase credentials. 
                Check SETUP.md for instructions.
              </div>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowCheck(false)}
              className="w-full"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}
      
      {allGood && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowCheck(!showCheck)}
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Config OK
        </Button>
      )}
    </div>
  )
}