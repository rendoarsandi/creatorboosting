'use client'

import { useState } from 'react'
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
  const [assetFile, setAssetFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('total_budget', totalBudget)
    formData.append('rate_per_10k_views', rate)
    formData.append('terms', terms)
    if (assetFile) {
      formData.append('assetFile', assetFile)
    }

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json() as { error?: string };
 
       if (!response.ok) {
         throw new Error(result.error || 'Gagal membuat kampanye.')
       }

      alert('Kampanye berhasil dibuat!')
      router.push('/dashboard/creator')
      router.refresh()

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Terjadi kesalahan tidak diketahui.')
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
            <label htmlFor="assetFile" className="block text-sm font-medium text-gray-700">Unggah Aset Kampanye</label>
            <Input id="assetFile" type="file" onChange={(e) => setAssetFile(e.target.files ? e.target.files[0] : null)} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            <p className="mt-1 text-sm text-gray-500">Opsional. Unggah gambar atau video pendek.</p>
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
