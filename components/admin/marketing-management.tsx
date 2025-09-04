"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, Gift, Mail, TrendingUp, Users, Eye, EyeOff, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// TypeScript interfaces
interface Promotion {
  id: number
  name: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  code: string
  usageCount: number
  isActive: boolean
}

interface Campaign {
  id: number
  name: string
  type: 'newsletter' | 'automated'
  recipients: number
  openRate: number
  status: 'active' | 'sent' | 'draft'
  subject?: string
}

// Mock data
const mockPromotions = [
  { id: 1, name: "Summer Sale 2024", type: "percentage", value: 25, code: "SUMMER25", usageCount: 156, isActive: true },
  { id: 2, name: "Free Shipping", type: "free_shipping", value: 0, code: "FREESHIP", usageCount: 423, isActive: true },
]

const mockCampaigns = [
  { id: 1, name: "Welcome Series", type: "automated", recipients: 1250, openRate: 42.5, status: "active" },
  { id: 2, name: "Summer Sale", type: "newsletter", recipients: 2350, openRate: 38.7, status: "sent" },
]

export function MarketingManagement() {
  const [promotions, setPromotions] = useState(mockPromotions)
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddPromoDialogOpen, setIsAddPromoDialogOpen] = useState(false)
  const [isAddCampaignDialogOpen, setIsAddCampaignDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newPromotion, setNewPromotion] = useState({
    name: "", type: "percentage", value: "", code: "", isActive: true
  })

  const [newCampaign, setNewCampaign] = useState({
    name: "", type: "newsletter", subject: ""
  })

  const handleAddPromotion = () => {
    if (!newPromotion.name || !newPromotion.code) {
      toast({ title: "Validation Error", description: "Name and code are required.", variant: "destructive" })
      return
    }

    const promotion = {
      id: Date.now(),
      name: newPromotion.name,
      type: newPromotion.type as 'percentage' | 'fixed',
      value: parseFloat(newPromotion.value) || 0,
      code: newPromotion.code.toUpperCase(),
      usageCount: 0,
      isActive: newPromotion.isActive,
    }

    setPromotions([...promotions, promotion])
    setNewPromotion({ name: "", type: "percentage", value: "", code: "", isActive: true })
    setIsAddPromoDialogOpen(false)
    toast({ title: "Promotion Created", description: `${promotion.name} has been created.` })
  }

  const handleAddCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject) {
      toast({ title: "Validation Error", description: "Name and subject are required.", variant: "destructive" })
      return
    }

    const campaign = {
      id: Date.now(),
      name: newCampaign.name,
      type: newCampaign.type as 'newsletter' | 'automated',
      subject: newCampaign.subject,
      recipients: 0,
      openRate: 0,
      status: "draft",
    }

    setCampaigns([...campaigns, campaign])
    setNewCampaign({ name: "", type: "newsletter", subject: "" })
    setIsAddCampaignDialogOpen(false)
    toast({ title: "Campaign Created", description: `${campaign.name} has been created.` })
  }

  const togglePromotionStatus = (id: number) => {
    setPromotions(promotions.map((promo) => promo.id === id ? { ...promo, isActive: !promo.isActive } : promo))
  }

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({ title: "Code Copied", description: `Code "${code}" copied to clipboard.` })
  }

  const getPromotionTypeColor = (type: string) => {
    switch (type) {
      case "percentage": return "bg-blue-100 text-blue-800"
      case "fixed": return "bg-green-100 text-green-800"
      case "free_shipping": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Management</h1>
          <p className="text-muted-foreground">Manage promotions, campaigns, and marketing tools</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.filter(p => p.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40.6%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,600</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="promotions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isAddPromoDialogOpen} onOpenChange={setIsAddPromoDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Create Promotion</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Promotion</DialogTitle>
                  <DialogDescription>Set up a new discount code or promotion.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="promo-name">Promotion Name *</Label>
                    <Input id="promo-name" value={newPromotion.name} onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={newPromotion.type} onValueChange={(value) => setNewPromotion({ ...newPromotion, type: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage Off</SelectItem>
                          <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                          <SelectItem value="free_shipping">Free Shipping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input type="number" value={newPromotion.value} onChange={(e) => setNewPromotion({ ...newPromotion, value: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Promotion Code *</Label>
                    <Input value={newPromotion.code} onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value.toUpperCase() })} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={newPromotion.isActive} onCheckedChange={(checked) => setNewPromotion({ ...newPromotion, isActive: checked })} />
                    <Label>Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddPromotion}>Create Promotion</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Promotions ({promotions.length})</CardTitle>
              <CardDescription>Manage your discount codes and promotional offers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm">{promotion.code}</code>
                          <Button variant="ghost" size="icon" onClick={() => copyPromoCode(promotion.code)} className="h-6 w-6">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPromotionTypeColor(promotion.type)} variant="secondary">
                          {promotion.type} {promotion.value > 0 && `${promotion.value}${promotion.type === 'percentage' ? '%' : '$'}`}
                        </Badge>
                      </TableCell>
                      <TableCell>{promotion.usageCount} used</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={promotion.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"} variant="secondary">
                            {promotion.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button variant="ghost" size="icon" onClick={() => togglePromotionStatus(promotion.id)}>
                            {promotion.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isAddCampaignDialogOpen} onOpenChange={setIsAddCampaignDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Create Campaign</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Email Campaign</DialogTitle>
                  <DialogDescription>Set up a new email marketing campaign.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Campaign Name *</Label>
                    <Input value={newCampaign.name} onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="automated">Automated</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject Line *</Label>
                    <Input value={newCampaign.subject} onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddCampaign}>Create Campaign</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns ({campaigns.length})</CardTitle>
              <CardDescription>Manage your email marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell><Badge variant="secondary">{campaign.type}</Badge></TableCell>
                      <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                      <TableCell>{campaign.openRate}%</TableCell>
                      <TableCell><Badge variant="secondary">{campaign.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Analytics</CardTitle>
              <CardDescription>Track your marketing performance and ROI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Marketing analytics dashboard would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}