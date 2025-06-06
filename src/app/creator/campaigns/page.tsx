"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
// import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/mock-auth"
// import type { User } from "@supabase/supabase-js"

interface Campaign {
  id: string
  title: string
  status: string
  budget: number
  price_per_engagement: number
  target_metric: string
  created_at: string
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Demo Campaign: Summer Sale",
    status: "active",
    budget: 1000,
    price_per_engagement: 0.5,
    target_metric: "clicks",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Demo Campaign: New Product Launch",
    status: "draft",
    budget: 2500,
    price_per_engagement: 1.2,
    target_metric: "signups",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
  {
    id: "3",
    title: "Old Campaign: Winter Special",
    status: "completed",
    budget: 500,
    price_per_engagement: 0.25,
    target_metric: "views",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
  },
]

export default function CreatorCampaignsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      toast({ title: "Unauthorized", description: "You must be logged in as a Creator to view this page.", variant: "destructive" })
      router.push("/auth/login")
      return
    }

    // Simulate fetching data
    setLoading(true)
    setTimeout(() => {
      // TODO: Replace with actual data fetching from Cloudflare D1
      setCampaigns(mockCampaigns)
      setLoading(false)
    }, 1000)
  }, [user, router, toast])
  
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading or redirecting...</p></div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Campaigns</CardTitle>
            <CardDescription>View and manage your influencer marketing campaigns.</CardDescription>
          </div>
          <Link href="/creator/campaigns/new" passHref>
            <Button>Create New Campaign</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading && !campaigns.length ? (
            <p>Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl font-semibold">No campaigns yet!</p>
              <p className="text-muted-foreground mb-4">Start by creating your first campaign.</p>
              <Link href="/creator/campaigns/new" passHref>
                <Button>Create Campaign</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Budget (USD)</TableHead>
                  <TableHead className="text-right">Price/Engagement (USD)</TableHead>
                  <TableHead>Target Metric</TableHead>
                  <TableHead>Created At</TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.title}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                            campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                    </TableCell>
                    <TableCell className="text-right">${campaign.budget.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${campaign.price_per_engagement.toFixed(2)}</TableCell>
                    <TableCell>{campaign.target_metric}</TableCell>
                    <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
                    {/* <TableCell>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/creator/campaigns/edit/${campaign.id}`)}>Edit</Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
              {campaigns.length === 0 && (
                 <TableCaption>You have not created any campaigns yet.</TableCaption>
              )}
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
