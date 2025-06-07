'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Campaign {
  id: string
  title: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  budget: number
  target_clicks: number | null
  created_at: string
  profiles: {
    full_name: string
  } | null
}

export default function CampaignTable() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/admin/campaigns')
        if (!response.ok) {
          throw new Error('Gagal mengambil data kampanye.')
        }
        const data = await response.json()
        setCampaigns(data)
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  if (loading) {
    return <div>Memuat data kampanye...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="mt-6 border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul Kampanye</TableHead>
            <TableHead>Kreator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.title}</TableCell>
              <TableCell>{campaign.profiles?.full_name || 'N/A'}</TableCell>
              <TableCell>
                <Badge>{campaign.status}</Badge>
              </TableCell>
              <TableCell>${campaign.budget.toLocaleString()}</TableCell>
              <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}