'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useParams, useRouter } from 'next/navigation'

type CampaignDetail = {
  id: string
  title: string
  description: string | null
  terms: string | null
  rate_per_10k_views: number
  profiles: { full_name: string | null } | null | { full_name: string | null }[]
  campaign_assets: { asset_url: string }[]
}

export default function CampaignDetailPage() {
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [loading] = useState(false) // Changed to false as we use placeholder data
  const { user } = useUser()
  const [submittedUrl, setSubmittedUrl] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string
  
  // Placeholder data until the API endpoint is ready
  useEffect(() => {
    if (campaignId) {
      setCampaign({
        id: campaignId,
        title: 'Placeholder Campaign Title',
        description: 'This is a placeholder description for the campaign. Details will be loaded from the API.',
        terms: 'These are placeholder terms and conditions.',
        rate_per_10k_views: 50000,
        profiles: { full_name: 'Placeholder Creator' },
        campaign_assets: [{ asset_url: 'https://example.com/asset' }],
      });
    }
  }, [campaignId]);

  const handleSubmitUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Anda harus login untuk submit.')
      return
    }
    if (!submittedUrl) {
      setError('URL tidak boleh kosong.')
      return
    }

    setSubmitLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          submitted_url: submittedUrl,
        }),
      })

      const result = await response.json() as { error?: string };
 
       if (!response.ok) {
         throw new Error(result.error || 'Gagal mengirimkan URL.')
       }

      alert('URL berhasil disubmit! Anda akan diarahkan ke dasbor Anda.')
      router.push('/dashboard/promoter')
      router.refresh()
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Terjadi kesalahan tidak diketahui.')
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) return <div className="container mx-auto p-8 text-center">Memuat...</div>
  if (error) return <div className="container mx-auto p-8 text-center text-red-500">{error}</div>
  if (!campaign) return <div className="container mx-auto p-8 text-center">Kampanye tidak ditemukan.</div>

  const creatorName = (Array.isArray(campaign.profiles)
    ? campaign.profiles[0]?.full_name
    : campaign.profiles?.full_name) || 'Kreator Anonim'

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
        <p className="text-md text-gray-600 mb-6">oleh {creatorName}</p>

        <div className="prose max-w-none mb-6">
          <h2 className="text-xl font-semibold">Deskripsi</h2>
          <p>{campaign.description || 'Tidak ada deskripsi.'}</p>

          <h2 className="text-xl font-semibold mt-4">Aset Kampanye</h2>
          <ul>
            {campaign.campaign_assets.map((asset, index) => (
              <li key={index}><a href={asset.asset_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{asset.asset_url}</a></li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4">Syarat & Ketentuan</h2>
          <p>{campaign.terms || 'Tidak ada syarat & ketentuan spesifik.'}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Submit Hasil Karyamu</h3>
          <form onSubmit={handleSubmitUrl} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Link Video (TikTok, Reels, Shorts)
              </label>
              <Input
                id="url"
                type="url"
                value={submittedUrl}
                onChange={(e) => setSubmittedUrl(e.target.value)}
                placeholder="https://www.tiktok.com/..."
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitLoading}>
              {submitLoading ? 'Mengirim...' : 'Submit Link'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
