"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Search,
  Star,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '@/components/mock-auth';

export function PromotorDashboard() {
  const { user } = useAuth();
  const stats = [
    {
      title: "Total Investment",
      value: "Rp 45,200,000",
      change: "+18.2%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Campaigns",
      value: "15",
      change: "+5",
      icon: BarChart3,
      color: "text-blue-600"
    },
    {
      title: "Total Reach",
      value: "2.8M",
      change: "+25.4%",
      icon: Eye,
      color: "text-purple-600"
    },
    {
      title: "ROI Average",
      value: "340%",
      change: "+12.8%",
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "My Total Earnings",
      value: "Rp 0", // Placeholder value
      change: "View History",
      icon: DollarSign, 
      color: "text-teal-600"
    }
  ]

  const campaigns = [
    {
      id: 1,
      title: "Summer Fashion Collection",
      creator: "Sarah Fashion",
      avatar: "/api/placeholder/40/40",
      status: "active",
      budget: "Rp 5,000,000",
      spent: "Rp 3,200,000",
      reach: "125K",
      engagement: "8.5%",
      roi: "285%"
    },
    {
      id: 2,
      title: "Tech Product Launch",
      creator: "TechReviewer Pro",
      avatar: "/api/placeholder/40/40",
      status: "completed",
      budget: "Rp 8,000,000",
      spent: "Rp 8,000,000",
      reach: "450K",
      engagement: "12.3%",
      roi: "420%"
    },
    {
      id: 3,
      title: "Food & Lifestyle",
      creator: "Foodie Adventures",
      avatar: "/api/placeholder/40/40",
      status: "pending",
      budget: "Rp 3,500,000",
      spent: "Rp 0",
      reach: "0",
      engagement: "0%",
      roi: "0%"
    }
  ]

  const topCreators = [
    {
      name: "Sarah Fashion",
      category: "Fashion & Lifestyle",
      followers: "250K",
      engagement: "9.2%",
      rating: 4.9,
      price: "Rp 2,500,000",
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "TechReviewer Pro",
      category: "Technology",
      followers: "180K",
      engagement: "11.5%",
      rating: 4.8,
      price: "Rp 3,200,000",
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Foodie Adventures",
      category: "Food & Travel",
      followers: "320K",
      engagement: "8.7%",
      rating: 4.7,
      price: "Rp 2,800,000",
      avatar: "/api/placeholder/40/40"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          {user?.fullName ? (
            <h1 className="text-3xl font-bold">Welcome, {user.fullName}!</h1>
          ) : (
            <h1 className="text-3xl font-bold">Promotor Dashboard</h1>
          )}
          <p className="text-muted-foreground">Kelola kampanye marketing dan pantau ROI.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Cari Creator
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Kampanye Baru
          </Button>
        </div>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Kampanye Aktif
              </CardTitle>
              <CardDescription>
                Monitor performa kampanye yang sedang berjalan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={campaign.avatar} />
                        <AvatarFallback>{campaign.creator.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground">{campaign.creator}</p>
                      </div>
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
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-semibold">{campaign.budget}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-semibold">{campaign.spent}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reach</p>
                      <p className="font-semibold">{campaign.reach}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ROI</p>
                      <p className="font-semibold text-green-600">{campaign.roi}</p>
                    </div>
                  </div>

                  {campaign.status === 'active' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget Progress</span>
                        <span>{Math.round((parseInt(campaign.spent.replace(/[^\d]/g, '')) / parseInt(campaign.budget.replace(/[^\d]/g, ''))) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(parseInt(campaign.spent.replace(/[^\d]/g, '')) / parseInt(campaign.budget.replace(/[^\d]/g, ''))) * 100} 
                        className="h-2" 
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {campaign.reach}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {campaign.engagement}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Creators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Creators
            </CardTitle>
            <CardDescription>
              Creator terbaik untuk kampanye Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCreators.map((creator, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{creator.name}</h4>
                    <p className="text-xs text-muted-foreground">{creator.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{creator.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-semibold">{creator.followers}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-semibold">{creator.engagement}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-green-600">{creator.price}</span>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              Lihat Semua Creator
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}