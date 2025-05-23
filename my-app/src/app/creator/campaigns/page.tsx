"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

interface Campaign {
  id: string
  title: string
  status: string
  budget: number
  price_per_engagement: number
  target_metric: string
  created_at: string
}

export default function CreatorCampaignsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(true) // Untuk loading awal user

  const fetchCampaigns = useCallback(async (currentUserId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, title, status, budget, price_per_engagement, target_metric, created_at")
        .eq("creator_id", currentUserId)
        .order("created_at", { ascending: false })

      if (error) {
        toast({ title: "Error Fetching Campaigns", description: error.message, variant: "destructive" })
        setCampaigns([])
      } else {
        setCampaigns(data || [])
      }
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({ title: "Unexpected Error", description: errorMessage, variant: "destructive" })
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    const fetchUserAndCampaigns = async () => {
      setPageLoading(true)
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser) {
          setUser(currentUser)
          await fetchCampaigns(currentUser.id)
        } else {
          toast({ title: "Unauthorized", description: "You must be logged in to view your campaigns.", variant: "destructive" })
          router.push("/auth/login")
        }
      } catch (error: unknown) {
        let errorMessage = "An error occurred while fetching user data.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast({ title: "Error fetching user", description: errorMessage, variant: "destructive" })
        router.push("/auth/login")
      } finally {
        setPageLoading(false)
      }
    }
    fetchUserAndCampaigns()
  }, [router, toast, fetchCampaigns])
  
  if (pageLoading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading page...</p></div>
  }

  if (!user && !pageLoading) {
     return <div className="flex items-center justify-center min-h-screen"><p>Redirecting to login...</p></div>
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
