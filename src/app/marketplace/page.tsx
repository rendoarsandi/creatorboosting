'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Campaign = {
  id: string
  title: string
  description: string | null
  rate_per_10k_views: number
  creator_id: string
  creator: { full_name: string | null } | null
}

export default function MarketplacePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

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
            creator_id,
            creator:profiles ( full_name )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) setCampaigns(data as unknown as Campaign[])
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching marketplace campaigns:', error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchActiveCampaigns()
  }, [])

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace Kampanye</h1>
      {loading ? (
        <p>Memuat kampanye yang tersedia...</p>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex-grow">
                <h2 className="text-xl font-bold mb-2">{campaign.title}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  oleh {campaign.creator?.full_name || 'Kreator Anonim'}
                </p>
                <p className="text-gray-700 mb-4">
                  {campaign.description?.substring(0, 100) || 'Tidak ada deskripsi.'}...
                </p>
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold text-green-600">
                  Rp {Number(campaign.rate_per_10k_views).toLocaleString('id-ID')}
                  <span className="text-sm font-normal text-gray-500"> / 10k views</span>
                </p>
                <Link href={`/marketplace/${campaign.id}`} className="mt-4">
                  <Button className="w-full">Lihat Detail</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Saat ini tidak ada kampanye yang aktif. Silakan cek kembali nanti!</p>
      )}
    </div>
  )
}
