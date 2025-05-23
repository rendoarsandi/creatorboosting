"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Pastikan ini sudah dibuat
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

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
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
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
    const fetchUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          toast({ title: "Unauthorized", description: "You must be logged in to create a campaign.", variant: "destructive" })
          router.push("/auth/login")
        }
      } catch (error: unknown) {
        let errorMessage = "An error occurred while fetching user data.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast({ title: "Error fetching user", description: errorMessage, variant: "destructive" })
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || "" : value,
    }))
  }

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) {
      toast({ title: "Error", description: "User not found. Please log in again.", variant: "destructive" })
      return
    }
    setLoading(true)

    const budgetAsNumber = parseFloat(formData.budget as string)
    const pricePerEngagementAsNumber = parseFloat(formData.price_per_engagement as string)

    if (isNaN(budgetAsNumber) || isNaN(pricePerEngagementAsNumber)) {
        toast({ title: "Invalid Input", description: "Budget and Price per Engagement must be valid numbers.", variant: "destructive" })
        setLoading(false)
        return
    }

    try {
      const { error } = await supabase
        .from("campaigns")
        .insert([
          {
            creator_id: user.id,
            title: formData.title,
            description: formData.description,
            budget: budgetAsNumber,
            price_per_engagement: pricePerEngagementAsNumber,
            target_metric: formData.target_metric,
            campaign_materials_url: formData.campaign_materials_url,
            requirements: formData.requirements,
            status: "draft", // Default status
          },
        ])
        .select() // Untuk mendapatkan data yang baru saja dimasukkan (opsional)

      if (error) {
        toast({ title: "Error Creating Campaign", description: error.message, variant: "destructive" })
      } else {
        toast({ title: "Campaign Created!", description: "Your new campaign has been created as a draft." })
        router.push("/creator/campaigns") // Arahkan ke daftar kampanye
      }
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({ title: "Unexpected Error", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) { // Tampilkan loading hanya jika user belum ter-fetch
    return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>
  }
  if (!user && !loading) { // Jika sudah selesai loading dan user tidak ada (sudah diarahkan, tapi sebagai fallback)
     return <div className="flex items-center justify-center min-h-screen"><p>Redirecting to login...</p></div>
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
