'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export default function NewCampaignPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [totalBudget, setTotalBudget] = useState('')
  const [rate, setRate] = useState('')
  const [terms, setTerms] = useState('')
  const [assetUrl, setAssetUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Anda harus login untuk membuat kampanye.')

      // 1. Insert into campaigns table
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          creator_id: user.id,
          title,
          description,
          total_budget: parseFloat(totalBudget),
          rate_per_10k_views: parseFloat(rate),
          terms,
          status: 'draft', // Campaigns start as draft
        })
        .select()
        .single()

      if (campaignError) throw campaignError
      if (!campaignData) throw new Error('Gagal membuat kampanye.')

      // 2. Insert into campaign_assets table
      if (assetUrl) {
        const { error: assetError } = await supabase
          .from('campaign_assets')
          .insert({
            campaign_id: campaignData.id,
            asset_url: assetUrl,
            asset_type: 'youtube_video', // Placeholder type
          })
        if (assetError) throw assetError
      }

      alert('Kampanye berhasil dibuat!')
      router.push('/dashboard/creator')
      router.refresh()

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Buat Kampanye Baru</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleCreateCampaign} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Kampanye</label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <Textarea id="description" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700">Total Budget (Rp)</label>
              <Input id="totalBudget" type="number" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Tarif per 10.000 Views (Rp)</label>
              <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} required />
            </div>
          </div>
          <div>
            <label htmlFor="assetUrl" className="block text-sm font-medium text-gray-700">Link Aset (Google Drive, YouTube, dll.)</label>
            <Input id="assetUrl" value={assetUrl} onChange={(e) => setAssetUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label htmlFor="terms" className="block text-sm font-medium text-ray-700">Syarat & Ketentuan</label>
            <Textarea id="terms" value={terms} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTerms(e.target.value)} rows={4} placeholder="e.g., Wajib format video vertikal, durasi maks 60 detik..." />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan sebagai Draft'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
