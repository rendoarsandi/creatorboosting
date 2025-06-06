"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
// import { supabase } from "@/lib/supabaseClient"
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

const mockPublicCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Summer Sale Extravaganza",
    description: "Promote our biggest summer sale event! Get exclusive codes for your followers and earn big.",
    target_metric: "clicks",
    price_per_engagement: 0.5,
  },
  {
    id: "4",
    title: "New Mobile Game Launch",
    description: "Be the first to showcase our new epic mobile game. We are looking for enthusiastic gamers.",
    target_metric: "installs",
    price_per_engagement: 2.0,
  },
  {
    id: "5",
    title: "Eco-Friendly Product Line",
    description: "Help us spread the word about our new sustainable and eco-friendly products.",
    target_metric: "views",
    price_per_engagement: 0.1,
  },
]

export default function PublicCampaignsPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching public data
    setLoading(true)
    setTimeout(() => {
      // TODO: Replace with actual data fetching from Cloudflare D1
      setCampaigns(mockPublicCampaigns)
      setLoading(false)
    }, 1000)
  }, [])

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
