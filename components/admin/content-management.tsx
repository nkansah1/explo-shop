"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FileText, 
  Globe, 
  Eye, 
  EyeOff, 
  Image,
  Code,
  Settings,
  ExternalLink
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// TypeScript interfaces
interface Page {
  id: number
  title: string
  slug: string
  type: 'page' | 'legal' | 'help' | 'promotion'
  status: 'published' | 'draft' | 'scheduled'
  content: string
  metaTitle: string
  metaDescription: string
  createdAt: string
  updatedAt: string
  author: string
  views: number
}

// Mock pages data
const mockPages = [
  {
    id: 1,
    title: "About Us",
    slug: "about-us",
    content: "Learn more about our company and mission...",
    metaTitle: "About Us - EliteStore",
    metaDescription: "Learn about EliteStore's mission to provide premium products",
    status: "published" as const,
    type: "page" as const,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    author: "Admin",
    views: 1250,
  },
  {
    id: 2,
    title: "Privacy Policy", 
    slug: "privacy-policy",
    content: "Our commitment to protecting your privacy...",
    metaTitle: "Privacy Policy - EliteStore",
    metaDescription: "Read our privacy policy and data protection practices",
    status: "published" as const,
    type: "legal" as const,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-18",
    author: "Admin",
    views: 890,
  },
  {
    id: 3,
    title: "Shipping Information",
    slug: "shipping-info",
    content: "Everything you need to know about our shipping...",
    metaTitle: "Shipping Information - EliteStore",
    metaDescription: "Learn about our shipping options and delivery times",
    status: "draft" as const,
    type: "help" as const,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-19",
    author: "Admin",
    views: 0,
  },
  {
    id: 4,
    title: "Summer Sale 2024",
    slug: "summer-sale-2024",
    content: "Don't miss our biggest summer sale event...",
    metaTitle: "Summer Sale 2024 - Up to 70% Off",
    metaDescription: "Shop the biggest summer sale with up to 70% off premium products",
    status: "scheduled" as const,
    type: "promotion" as const,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-21",
    author: "Marketing",
    views: 0,
  },
]

// Mock banners data
const mockBanners = [
  {
    id: 1,
    title: "Welcome Hero Banner",
    image: "/hero-banner.jpg",
    linkUrl: "/products",
    buttonText: "Shop Now",
    position: "homepage-hero",
    isActive: true,
    priority: 1,
  },
  {
    id: 2,
    title: "Free Shipping Promo",
    image: "/free-shipping-banner.jpg",
    linkUrl: "/shipping",
    buttonText: "Learn More",
    position: "global-header",
    isActive: true,
    priority: 2,
  },
]



interface Banner {
  id: number
  title: string
  image: string
  linkUrl: string
  buttonText: string
  position: string
  isActive: boolean
  priority: number
}

export function ContentManagement() {
  const [pages, setPages] = useState<Page[]>(mockPages)
  const [banners, setBanners] = useState<Banner[]>(mockBanners)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false)
  const [isAddBannerDialogOpen, setIsAddBannerDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [editingBanner, setBannerEditing] = useState<Banner | null>(null)
  const { toast } = useToast()

  const [newPage, setNewPage] = useState<{
    title: string
    slug: string
    content: string
    metaTitle: string
    metaDescription: string
    type: 'page' | 'legal' | 'help' | 'promotion'
    status: 'published' | 'draft' | 'scheduled'
  }>({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    type: "page",
    status: "draft",
  })

  const [newBanner, setNewBanner] = useState({
    title: "",
    image: "",
    linkUrl: "",
    buttonText: "",
    position: "",
    isActive: true,
    priority: 1,
  })

  const filteredPages = pages.filter((page) => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || page.status === statusFilter
    const matchesType = typeFilter === "all" || page.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleAddPage = () => {
    if (!newPage.title.trim() || !newPage.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required.",
        variant: "destructive",
      })
      return
    }

    const page: Page = {
      id: Date.now(),
      title: newPage.title,
      slug: newPage.slug || generateSlug(newPage.title),
      content: newPage.content,
      metaTitle: newPage.metaTitle || newPage.title,
      metaDescription: newPage.metaDescription,
      status: newPage.status,
      type: newPage.type,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      author: "Admin",
      views: 0,
    }

    setPages([...pages, page])
    setNewPage({
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      type: "page",
      status: "draft",
    })
    setIsAddPageDialogOpen(false)

    toast({
      title: "Page Created",
      description: `${page.title} has been successfully created.`,
    })
  }

  const handleAddBanner = () => {
    if (!newBanner.title.trim() || !newBanner.image.trim()) {
      toast({
        title: "Validation Error", 
        description: "Title and image are required.",
        variant: "destructive",
      })
      return
    }

    const banner: Banner = {
      id: Date.now(),
      ...newBanner,
    }

    setBanners([...banners, banner])
    setNewBanner({
      title: "",
      image: "",
      linkUrl: "",
      buttonText: "",
      position: "",
      isActive: true,
      priority: 1,
    })
    setIsAddBannerDialogOpen(false)

    toast({
      title: "Banner Created",
      description: `${banner.title} has been successfully created.`,
    })
  }

  const handleDeletePage = (id: number) => {
    const page = pages.find((p) => p.id === id)
    if (!page) return

    setPages(pages.filter((p) => p.id !== id))
    
    toast({
      title: "Page Deleted",
      description: `${page.title} has been successfully deleted.`,
    })
  }

  const handleDeleteBanner = (id: number) => {
    const banner = banners.find((b) => b.id === id)
    if (!banner) return

    setBanners(banners.filter((b) => b.id !== id))
    
    toast({
      title: "Banner Deleted", 
      description: `${banner.title} has been successfully deleted.`,
    })
  }

  const handleTogglePageStatus = (id: number) => {
    setPages(
      pages.map((page) =>
        page.id === id 
          ? { ...page, status: page.status === "published" ? "draft" : "published" }
          : page
      )
    )
  }

  const handleToggleBannerStatus = (id: number) => {
    setBanners(
      banners.map((banner) =>
        banner.id === id 
          ? { ...banner, isActive: !banner.isActive }
          : banner
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "bg-blue-100 text-blue-800"
      case "legal":
        return "bg-purple-100 text-purple-800"
      case "help":
        return "bg-orange-100 text-orange-800"
      case "promotion":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Manage pages, content, and promotional materials</p>
        </div>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pages">Pages & Content</TabsTrigger>
          <TabsTrigger value="banners">Banners & Media</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          {/* Add Page Button */}
          <div className="flex justify-end">
            <Dialog open={isAddPageDialogOpen} onOpenChange={setIsAddPageDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Page
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Page</DialogTitle>
                  <DialogDescription>Create a new page or content section.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title *</Label>
                      <Input
                        id="title"
                        value={newPage.title}
                        onChange={(e) => {
                          const title = e.target.value
                          setNewPage({ 
                            ...newPage, 
                            title,
                            slug: generateSlug(title),
                            metaTitle: title
                          })
                        }}
                        placeholder="Enter page title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={newPage.slug}
                        onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                        placeholder="page-slug"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Page Type</Label>
                      <Select
                        value={newPage.type}
                        onValueChange={(value) => setNewPage({ ...newPage, type: value as 'page' | 'legal' | 'help' | 'promotion' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="page">General Page</SelectItem>
                          <SelectItem value="legal">Legal Document</SelectItem>
                          <SelectItem value="help">Help/Support</SelectItem>
                          <SelectItem value="promotion">Promotional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newPage.status}
                        onValueChange={(value) => setNewPage({ ...newPage, status: value as 'published' | 'draft' | 'scheduled' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={newPage.content}
                      onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                      placeholder="Enter page content..."
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta-title">SEO Title</Label>
                    <Input
                      id="meta-title"
                      value={newPage.metaTitle}
                      onChange={(e) => setNewPage({ ...newPage, metaTitle: e.target.value })}
                      placeholder="SEO optimized title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta-description">SEO Description</Label>
                    <Textarea
                      id="meta-description"
                      value={newPage.metaDescription}
                      onChange={(e) => setNewPage({ ...newPage, metaDescription: e.target.value })}
                      placeholder="SEO meta description"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddPage}>
                    Create Page
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Pages Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Page Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="page">General Page</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="help">Help</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pages Table */}
          <Card>
            <CardHeader>
              <CardTitle>Pages ({filteredPages.length})</CardTitle>
              <CardDescription>Manage your website pages and content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{page.title}</div>
                            <div className="text-sm text-muted-foreground">/{page.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(page.type)} variant="secondary">
                          {page.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(page.status)} variant="secondary">
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{page.views.toLocaleString()}</TableCell>
                      <TableCell>{page.updatedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" title="Preview">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePageStatus(page.id)}
                            title={page.status === "published" ? "Unpublish" : "Publish"}
                          >
                            {page.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePage(page.id)}
                            className="text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-6">
          {/* Add Banner Button */}
          <div className="flex justify-end">
            <Dialog open={isAddBannerDialogOpen} onOpenChange={setIsAddBannerDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Banner</DialogTitle>
                  <DialogDescription>Create a new promotional banner or media element.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="banner-title">Banner Title *</Label>
                    <Input
                      id="banner-title"
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                      placeholder="Enter banner title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="banner-image">Image URL *</Label>
                    <Input
                      id="banner-image"
                      value={newBanner.image}
                      onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                      placeholder="https://example.com/banner.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner-link">Link URL</Label>
                    <Input
                      id="banner-link"
                      value={newBanner.linkUrl}
                      onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                      placeholder="/products or https://external-link.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner-button">Button Text</Label>
                    <Input
                      id="banner-button"
                      value={newBanner.buttonText}
                      onChange={(e) => setNewBanner({ ...newBanner, buttonText: e.target.value })}
                      placeholder="Shop Now, Learn More, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner-position">Position</Label>
                    <Select
                      value={newBanner.position}
                      onValueChange={(value) => setNewBanner({ ...newBanner, position: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homepage-hero">Homepage Hero</SelectItem>
                        <SelectItem value="global-header">Global Header</SelectItem>
                        <SelectItem value="category-banner">Category Banner</SelectItem>
                        <SelectItem value="product-sidebar">Product Sidebar</SelectItem>
                        <SelectItem value="footer-promo">Footer Promotion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="banner-active"
                      checked={newBanner.isActive}
                      onCheckedChange={(checked) => setNewBanner({ ...newBanner, isActive: checked })}
                    />
                    <Label htmlFor="banner-active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddBanner}>
                    Create Banner
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Banners Table */}
          <Card>
            <CardHeader>
              <CardTitle>Banners ({banners.length})</CardTitle>
              <CardDescription>Manage promotional banners and media elements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banner</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                            <Image className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{banner.title}</div>
                            {banner.buttonText && (
                              <div className="text-sm text-muted-foreground">"{banner.buttonText}"</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{banner.position}</TableCell>
                      <TableCell>
                        <Badge 
                          className={banner.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          variant="secondary"
                        >
                          {banner.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{banner.priority}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleBannerStatus(banner.id)}
                            title={banner.isActive ? "Deactivate" : "Activate"}
                          >
                            {banner.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}