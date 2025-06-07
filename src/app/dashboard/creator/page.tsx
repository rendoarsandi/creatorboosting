import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingCart, Package } from 'lucide-react'
import SalesChart from '@/components/ui/sales-chart'
import TopProducts from '@/components/ui/top-products'
import RecentActivity from '@/components/ui/recent-activity'

// Definisikan tipe data yang diharapkan dari RPC
type CreatorStats = {
  total_revenue: number
  sales_last_30_days: number
  total_products: number
}

type SalesData = {
  date: string
  total_sales: number
}

type TopProductData = {
  name: string
  count: number
}

type RecentSaleData = {
  name: string
  amount: number
  sale_date: string
}

export default async function CreatorDashboard() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Placeholder data
  const stats: CreatorStats = { total_revenue: 0, sales_last_30_days: 0, total_products: 0 };
  const sales_data: SalesData[] = [];
  const top_products: TopProductData[] = [];
  const recent_sales: RecentSaleData[] = [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Kreator</h1>
      <p className="text-muted-foreground mb-6">Fungsionalitas penuh akan diimplementasikan dengan API workers.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget Kampanye</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {stats?.total_revenue?.toLocaleString() || '0'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views (30 Hari)</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.sales_last_30_days || '0'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kampanye</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_products || '0'}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tren Views</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={sales_data} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Kampanye Teratas</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProducts data={top_products} />
          </CardContent>
        </Card>
      </div>
       <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Promotor Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity data={recent_sales} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
