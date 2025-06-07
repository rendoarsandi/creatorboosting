'use client'

import { useState } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type SubmissionWithCampaign = {
  id: string
  submitted_url: string
  status: string
  tracked_views: number | null
  campaigns: {
    title: string | null
  } | null | { title: string | null }[]
}

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { PromoterAnalytics } from '@/components/ui/promoter-analytics'

function getInitials(name: string) {
  const names = name.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase()
  }
  return initials
}

export default function PromoterDashboard() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [submissions] = useState<SubmissionWithCampaign[]>([])
  const [balance] = useState<number | null>(0) // Placeholder
  const [loading] = useState(false) // Placeholder

  const userName = user?.fullName || user?.emailAddresses[0]?.emailAddress || 'Pengguna'

  // TODO: Re-implement fetchSubmissions and fetchWalletBalance using API workers

  const handleLogout = () => {
    signOut(() => {
      window.location.href = '/'
    })
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
                href="/dashboard/promoter"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                Submission Saya
              </Link>
              <Link
                href="/marketplace"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                Marketplace
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
            {/* Search bar can be added here later */}
          </div>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <Button onClick={handleLogout} variant="outline">Keluar</Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h1 className="text-2xl font-semibold">Dasbor Promotor</h1>
              <p className="text-muted-foreground">Lacak submission dan pendapatan Anda.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Pendapatan (Dapat Ditarik)</p>
                    <p className="text-2xl font-bold">
                        {balance !== null ? `Rp ${Number(balance).toLocaleString('id-ID')}` : 'Memuat...'}
                    </p>
                </div>
                <Link href="/dashboard/promoter/withdraw">
                    <Button>Tarik Dana</Button>
                </Link>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <PromoterAnalytics />
          </div>
          
          <h2 className="text-xl font-semibold mt-6">Submission Saya</h2>
          {loading ? (
            <p>Memuat submission...</p>
          ) : submissions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {submissions.map((submission) => {
                const campaignTitle = (Array.isArray(submission.campaigns)
                  ? submission.campaigns[0]?.title
                  : submission.campaigns?.title) || 'Kampanye Tanpa Judul'
                
                return (
                  <Card key={submission.id}>
                    <CardHeader>
                      <CardTitle className="truncate">{campaignTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a href={submission.submitted_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline truncate block">
                        {submission.submitted_url}
                      </a>
                      <div className="flex justify-between items-center mt-4">
                        <Badge variant={submission.status === 'approved' ? 'default' : 'secondary'}>
                          {submission.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">Tracked Views</p>
                          <p className="text-lg font-bold">{submission.tracked_views?.toLocaleString('id-ID') || '0'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">Anda belum memiliki submission</h3>
              <p className="text-muted-foreground mb-4">Cari kampanye di marketplace dan mulai berpartisipasi.</p>
              <Link href="/marketplace">
                <Button>Jelajahi Marketplace</Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
