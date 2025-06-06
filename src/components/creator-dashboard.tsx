"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  Plus,
  ExternalLink,
  Calendar,
  Target
} from 'lucide-react'

export function CreatorDashboard() {
  const stats = [
    {
      title: "Total Earnings",
      value: "Rp 15,750,000",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Campaigns",
      value: "8",
      change: "+2",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Total Views",
      value: "125,430",
      change: "+8.2%",
      icon: Eye,
      color: "text-purple-600"
    },
    {
      title: "Followers Growth",
      value: "2,340",
      change: "+15.3%",
      icon: Users,
      color: "text-orange-600"
    }
  ]

  const campaigns = [
    {
      id: 1,
      title: "Skincare Brand Collaboration",
      brand: "GlowUp Beauty",
      status: "active",
      progress: 75,
      earnings: "Rp 2,500,000",
      deadline: "2025-06-15",
      views: "15,230"
    },
    {
      id: 2,
      title: "Tech Gadget Review",
      brand: "TechNova",
      status: "completed",
      progress: 100,
      earnings: "Rp 1,800,000",
      deadline: "2025-05-20",
      views: "28,450"
    },
    {
      id: 3,
      title: "Fashion Week Coverage",
      brand: "StyleHub",
      status: "pending",
      progress: 25,
      earnings: "Rp 3,200,000",
      deadline: "2025-07-01",
      views: "5,120"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground">Kelola kampanye dan pantau performa konten Anda</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Buat Konten Baru
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> dari bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaigns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Kampanye Aktif
            </CardTitle>
            <CardDescription>
              Kampanye yang sedang berjalan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.brand}</p>
                  </div>
                  <Badge 
                    variant={
                      campaign.status === 'active' ? 'default' :
                      campaign.status === 'completed' ? 'secondary' : 'outline'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Earnings</p>
                    <p className="font-semibold text-green-600">{campaign.earnings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{campaign.views}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {campaign.deadline}
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performa Bulanan
            </CardTitle>
            <CardDescription>
              Statistik engagement dan earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-muted-foreground">Engagement Rate</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-muted-foreground">Completed Campaigns</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Instagram</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>TikTok</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>YouTube</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}