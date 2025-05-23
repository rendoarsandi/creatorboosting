"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface Campaign {
  id: string
  title: string
  description: string | null
  target_metric: string
  price_per_engagement: number
  // Tambahkan field lain yang relevan dan tidak sensitif jika perlu
  // Misalnya, jika ada kolom untuk gambar mini atau kategori
  // campaign_materials_url: string // Mungkin tidak ditampilkan di daftar publik
  // requirements: string // Mungkin tidak ditampilkan di daftar publik
}

export default function PublicCampaignsPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPublicCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      // Mengambil kampanye yang statusnya 'active'.
      // CATATAN: Saat ini, semua kampanye dibuat sebagai 'draft'. 
      // Daftar ini mungkin kosong sampai ada mekanisme untuk mengubah status kampanye menjadi 'active'.
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, title, description, target_metric, price_per_engagement")
        .eq("status", "active") 
        .order("created_at", { ascending: false })

      if (error) {
        toast({ title: "Error Fetching Campaigns", description: error.message, variant: "destructive" })
        setCampaigns([])
      } else {
        setCampaigns(data || [])
      }
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({ title: "Unexpected Error", description: errorMessage, variant: "destructive" })
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchPublicCampaigns()
  }, [fetchPublicCampaigns])

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Discover Campaigns</h1>
        <p className="text-xl text-muted-foreground">
          Find exciting influencer marketing campaigns to promote.
        </p>
      </div>

      {loading ? (
        <div className="text-center">
          <p>Loading campaigns...</p>
          {/* Bisa ditambahkan spinner atau skeleton loader di sini */}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl font-semibold">No campaigns available at the moment.</p>
          <p className="text-muted-foreground">Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
                {campaign.description && (
                  <CardDescription className="line-clamp-3 h-[60px] overflow-hidden"> 
                    {/* line-clamp untuk membatasi deskripsi, h-[60px] adalah perkiraan untuk 3 baris */}
                    {campaign.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Target Metric:</span> {campaign.target_metric}
                  </div>
                  <div>
                    <span className="font-semibold">Price per Engagement:</span> ${campaign.price_per_engagement.toFixed(2)}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {/* Tautan placeholder, nantinya akan ke halaman detail atau formulir pengajuan */}
                <Link href={`/campaigns/${campaign.id}`} passHref legacyBehavior>
                  <Button className="w-full" variant="outline">
                    View Details / Apply
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
