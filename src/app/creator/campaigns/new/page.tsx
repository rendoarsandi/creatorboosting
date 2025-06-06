"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Pastikan ini sudah dibuat
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/mock-auth"
// import type { User } from "@supabase/supabase-js"

interface CampaignFormData {
  title: string
  description: string
  budget: number | string // Bisa string saat input, konversi ke number saat submit
  price_per_engagement: number | string
  target_metric: string
  campaign_materials_url: string
  requirements: string
}

export default function CreateCampaignPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    budget: "",
    price_per_engagement: "",
    target_metric: "", // e.g., 'views', 'clicks', 'installations'
    campaign_materials_url: "",
    requirements: "",
  })

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      toast({ title: "Unauthorized", description: "You must be logged in as a Creator.", variant: "destructive" })
      router.push("/auth/login")
    }
  }, [user, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || "" : value,
    }))
  }

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement campaign creation with Cloudflare D1 and R2
    toast({
      title: "Feature Not Implemented",
      description: "Campaign creation is currently disabled.",
    })
    console.log("Form Data:", formData)
    setLoading(false)
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading or redirecting...</p></div>
  }


  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
          <CardDescription>Fill in the details below to launch your campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCampaign} className="space-y-6">
            <div>
              <Label htmlFor="title">Campaign Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} disabled={loading} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="budget">Total Budget (USD)</Label>
                <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="e.g., 500" required disabled={loading} />
              </div>
              <div>
                <Label htmlFor="price_per_engagement">Price Per Engagement (USD)</Label>
                <Input id="price_per_engagement" name="price_per_engagement" type="number" value={formData.price_per_engagement} onChange={handleChange} placeholder="e.g., 0.50" required disabled={loading} />
              </div>
            </div>
            <div>
              <Label htmlFor="target_metric">Target Metric</Label>
              <Input id="target_metric" name="target_metric" value={formData.target_metric} onChange={handleChange} placeholder="e.g., views, clicks, signups" required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="campaign_materials_url">Campaign Materials URL</Label>
              <Input id="campaign_materials_url" name="campaign_materials_url" type="url" value={formData.campaign_materials_url} onChange={handleChange} placeholder="e.g., https://drive.google.com/..." disabled={loading} />
            </div>
            <div>
              <Label htmlFor="requirements">Requirements for Promoters</Label>
              <Textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Describe specific requirements for promoters..." disabled={loading} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Your campaign will be saved as a draft. You can publish it later.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
