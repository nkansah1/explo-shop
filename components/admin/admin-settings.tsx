"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Store, 
  Mail, 
  CreditCard, 
  Shield, 
  Database, 
  Bell,
  Globe,
  Package,
  Users,
  BarChart3
} from "lucide-react"

export function AdminSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "EliteStore",
    storeDescription: "Your trusted destination for premium products",
    storeEmail: "contact@elitestore.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Commerce Street, Business City, BC 12345",
    
    // Email Settings
    emailNotifications: true,
    orderConfirmations: true,
    lowStockAlerts: true,
    customerMessages: true,
    
    // Payment Settings
    stripeEnabled: false,
    paypalEnabled: false,
    cashOnDelivery: true,
    
    // Security Settings
    twoFactorAuth: false,
    loginAttempts: 5,
    sessionTimeout: 30,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    autoBackup: true,
  })

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    })
  }

  const handleTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to your configured email address.",
    })
  }

  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "Database backup has been initiated. You'll be notified when complete.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration and preferences</p>
      </div>

      <div className="grid gap-8">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <CardTitle>Store Information</CardTitle>
            </div>
            <CardDescription>
              Basic information about your store that appears to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone Number</Label>
                <Input
                  id="storePhone"
                  value={settings.storePhone}
                  onChange={(e) => setSettings(prev => ({ ...prev, storePhone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Input
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings(prev => ({ ...prev, storeAddress: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Email Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure when and what emails are sent automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable all email notifications
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Confirmations</Label>
                  <p className="text-sm text-muted-foreground">
                    Send confirmation emails for new orders
                  </p>
                </div>
                <Switch
                  checked={settings.orderConfirmations}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, orderConfirmations: checked }))
                  }
                  disabled={!settings.emailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when products are running low
                  </p>
                </div>
                <Switch
                  checked={settings.lowStockAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, lowStockAlerts: checked }))
                  }
                  disabled={!settings.emailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Customer Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Forward customer contact form messages
                  </p>
                </div>
                <Switch
                  checked={settings.customerMessages}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, customerMessages: checked }))
                  }
                  disabled={!settings.emailNotifications}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button variant="outline" onClick={handleTestEmail}>
                Send Test Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Payment Methods</CardTitle>
            </div>
            <CardDescription>
              Configure accepted payment methods for your store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="space-y-0.5">
                    <Label>Stripe Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept credit cards via Stripe</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={settings.stripeEnabled ? "default" : "secondary"}>
                    {settings.stripeEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={settings.stripeEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, stripeEnabled: checked }))
                    }
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="space-y-0.5">
                    <Label>PayPal</Label>
                    <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={settings.paypalEnabled ? "default" : "secondary"}>
                    {settings.paypalEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={settings.paypalEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, paypalEnabled: checked }))
                    }
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="space-y-0.5">
                    <Label>Cash on Delivery</Label>
                    <p className="text-sm text-muted-foreground">Allow cash payments on delivery</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={settings.cashOnDelivery ? "default" : "secondary"}>
                    {settings.cashOnDelivery ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={settings.cashOnDelivery}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, cashOnDelivery: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security Settings</CardTitle>
            </div>
            <CardDescription>
              Configure security and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, twoFactorAuth: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={settings.loginAttempts}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))
                    }
                    min={1}
                    max={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
                    }
                    min={5}
                    max={120}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <CardTitle>System Settings</CardTitle>
            </div>
            <CardDescription>
              System configuration and maintenance options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable the storefront for maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, maintenanceMode: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed error logging (development only)
                  </p>
                </div>
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, debugMode: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cache Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable caching for better performance
                  </p>
                </div>
                <Switch
                  checked={settings.cacheEnabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, cacheEnabled: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup database daily
                  </p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, autoBackup: checked }))
                  }
                />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={handleBackupNow}>
                  Backup Now
                </Button>
                <p className="text-sm text-muted-foreground">
                  Last backup: Today at 3:00 AM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} size="lg">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}