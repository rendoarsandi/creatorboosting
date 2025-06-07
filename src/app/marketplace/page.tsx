'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Definisikan tipe data untuk kampanye
type Campaign = {
  id: number;
  creator_id: string;
  title: string;
  description: string;
  total_budget: number;
  rate_per_10k_views: number;
  status: string;
  created_at: string;
  // Nanti kita akan tambahkan data kreator di sini
  // creator_name: string;
  // creator_avatar: string;
};

export default function MarketplacePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Panggil API worker kita
        const response = await fetch('/api/campaigns');
        if (!response.ok) {
          throw new Error('Gagal mengambil data kampanye');
        }
        const data: Campaign[] = await response.json();
        setCampaigns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Memuat kampanye...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Marketplace Kampanye</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Temukan kampanye dari kreator dan dapatkan penghasilan dengan mempromosikan konten mereka.
        </p>
      </header>
      <main>
        {campaigns.length === 0 ? (
          <p className="text-center text-muted-foreground">Saat ini tidak ada kampanye yang tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Link href={`/marketplace/${campaign.id}`} key={campaign.id}>
                <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="truncate">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                      <Badge variant="secondary">
                        Rp {campaign.rate_per_10k_views.toLocaleString()} / 10k views
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Total Budget</p>
                      <p className="text-lg font-bold">Rp {campaign.total_budget.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
