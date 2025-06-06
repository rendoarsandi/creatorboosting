'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { CreatorAnalytics } from '@/components/ui/creator-analytics'

type Campaign = {
  id: string
  title: string
  status: string
  total_budget: number
  rate_per_10k_views: number
}

function getInitials(name: string) {
  const names = name.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase()
  }
  return initials
}

export default function CreatorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Pengguna')
  const supabase = createClient()

  const fetchWalletBalance = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', userId)
        .single()

      if (error) throw error
      if (data) setBalance(data.balance)
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
    }
  }, [supabase])

  const fetchCampaigns = useCallback(async (creatorId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title, status, total_budget, rate_per_10k_views')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setCampaigns(data)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching campaigns:', error.message)
      } else {
        console.error('An unknown error occurred while fetching campaigns')
      }
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setUserName(user.user_metadata.full_name || user.email || 'Pengguna')
        fetchCampaigns(user.id)
        fetchWalletBalance(user.id)
      } else {
        window.location.href = '/login'
      }
    }
    fetchUserData()
  }, [supabase.auth, fetchCampaigns, fetchWalletBalance])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="">Creator Boosting</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard/creator"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                Kampanye Saya
              </Link>
              <Link
                href="/marketplace"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                Pasar
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                Profil
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {/* Bisa ditambahkan search bar di sini nanti */}
          </div>
          <Avatar>
            <AvatarImage src={user?.user_metadata.avatar_url} />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <Button onClick={handleLogout} variant="outline">Keluar</Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h1 className="text-2xl font-semibold">Kampanye Saya</h1>
              <p className="text-muted-foreground">Kelola dan pantau semua kampanye Anda.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Saldo Saat Ini</p>
                    <p className="text-2xl font-bold">
                        {balance !== null ? `Rp ${Number(balance).toLocaleString('id-ID')}` : 'Memuat...'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/creator/top-up">
                        <Button>Top-Up Saldo</Button>
                    </Link>
                    <Link href="/dashboard/creator/new">
                        <Button variant="outline">Buat Kampanye Baru</Button>
                    </Link>
                </div>
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <CreatorAnalytics />
          </div>
          <h2 className="text-xl font-semibold mt-6">Daftar Kampanye</h2>
          {loading ? (
            <p>Memuat kampanye...</p>
          ) : campaigns.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <CardTitle>{campaign.title}</CardTitle>
                    <CardDescription>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Total Budget</p>
                        <p className="text-lg font-semibold">
                          Rp {Number(campaign.total_budget).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Rate per 10k Views</p>
                        <p className="text-lg font-semibold">
                          Rp {Number(campaign.rate_per_10k_views).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">Anda belum memiliki kampanye</h3>
              <p className="text-muted-foreground mb-4">Mulai buat kampanye pertama Anda.</p>
              <Link href="/dashboard/creator/new">
                <Button>Buat Kampanye</Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
