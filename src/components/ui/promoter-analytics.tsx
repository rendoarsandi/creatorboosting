'use client'

import { useState, useEffect } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface AnalyticsData {
  summary: {
    totalSubmissions: number;
    totalViews: number;
    totalEarnings: number;
  };
  chartData: {
    date: string;
    views: number;
  }[];
}

export function PromoterAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    // Placeholder data until API is ready
    setData({
      summary: { totalSubmissions: 0, totalViews: 0, totalEarnings: 0 },
      chartData: [],
    });
    setLoading(false);
  }, [])

  if (loading) {
    return <p>Memuat analitik...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (!data) {
    return <p>Tidak ada data untuk ditampilkan.</p>
  }

  return (
    <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Total Submission</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{data.summary.totalSubmissions}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{data.summary.totalViews.toLocaleString('id-ID')}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Estimasi Pendapatan</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">Rp {data.summary.totalEarnings.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Tren Views Harian</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="views" stroke="#82ca9d" name="Total Views" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  )
}
