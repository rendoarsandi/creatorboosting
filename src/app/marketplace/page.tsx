'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

type CampaignWithCreator = {
  id: string
  title: string
  description: string | null
  rate_per_10k_views: number
  profiles: {
    full_name: string | null
  } | null | { full_name: string | null }[]
}

export default function MarketplacePage() {
  const [campaigns, setCampaigns] = useState<CampaignWithCreator[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchActiveCampaigns = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('campaigns')
          .select(`
            id,
            title,
            description,
            rate_per_10k_views,
            profiles ( full_name )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }
        if (data) {
          setCampaigns(data)
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching marketplace campaigns:', error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchActiveCampaigns()
  }, [supabase])

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace Kampanye</h1>
      {loading ? (
        <p>Memuat kampanye yang tersedia...</p>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
                <p className="text-sm text-muted-foreground pt-1">
                  oleh {
                    (Array.isArray(campaign.profiles)
                      ? campaign.profiles[0]?.full_name
                      : campaign.profiles?.full_name) || 'Kreator Anonim'
                  }
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  {campaign.description ? `${campaign.description.substring(0, 120)}...` : 'Tidak ada deskripsi.'}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                 <div className="text-lg font-bold text-primary">
                   Rp {Number(campaign.rate_per_10k_views).toLocaleString('id-ID')}
                   <span className="text-sm font-normal text-muted-foreground"> / 10k views</span>
                 </div>
                <Link href={`/marketplace/${campaign.id}`} className="w-full">
                  <Button className="w-full">Lihat Detail & Ikut Kampanye</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Saat ini tidak ada kampanye yang aktif. Silakan cek kembali nanti!</p>
      )}
    </div>
  )
}
