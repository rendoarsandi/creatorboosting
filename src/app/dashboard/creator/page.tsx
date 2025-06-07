import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
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
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Panggil fungsi RPC dengan tipe yang benar
  const { data: stats } = await supabase.rpc('get_creator_stats', { creator_id_param: session.user.id }).single<CreatorStats>()
  const { data: sales_data } = await supabase.rpc('get_creator_sales_last_30_days', { creator_id_param: session.user.id })
  const { data: top_products } = await supabase.rpc('get_top_products', { creator_id_param: session.user.id })
  const { data: recent_sales } = await supabase.rpc('get_recent_sales', { creator_id_param: session.user.id })

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Penjual</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_revenue?.toLocaleString() || '0'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penjualan (30 Hari)</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.sales_last_30_days || '0'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
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
            <CardTitle>Tren Penjualan</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={sales_data as SalesData[] || []} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProducts data={top_products as TopProductData[] || []} />
          </CardContent>
        </Card>
      </div>
       <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity data={recent_sales as RecentSaleData[] || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
