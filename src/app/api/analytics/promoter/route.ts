import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type Submission = {
  tracked_views: number | null;
  created_at: string;
  campaigns: {
    rate_per_10k_views: number;
  } | {
    rate_per_10k_views: number;
  }[];
};

export async function GET() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 })
    }

    // Ambil semua submission milik promotor
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('tracked_views, created_at, campaigns(rate_per_10k_views)')
      .eq('promoter_id', session.user.id)

    if (submissionsError) throw submissionsError;
    if (!submissions) {
      return NextResponse.json({ error: 'Submissions not found' }, { status: 404 });
    }

    // Hitung statistik ringkasan
    const totalSubmissions = submissions.length;
    const totalViews = (submissions as Submission[]).reduce((acc, sub) => acc + (sub.tracked_views || 0), 0);
    
    // Hitung estimasi pendapatan total
    const totalEarnings = (submissions as Submission[]).reduce((acc, sub) => {
        const campaign = Array.isArray(sub.campaigns) ? sub.campaigns[0] : sub.campaigns;
        if (campaign && sub.tracked_views) {
            const rate = campaign.rate_per_10k_views;
            const earnings = (sub.tracked_views / 10000) * rate;
            return acc + earnings;
        }
        return acc;
    }, 0);

    // Siapkan data untuk grafik (contoh: views per hari)
    const viewsByDate = (submissions as Submission[]).reduce((acc: Record<string, number>, sub) => {
      const date = new Date(sub.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + (sub.tracked_views || 0);
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(viewsByDate)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const analyticsData = {
      summary: {
        totalSubmissions,
        totalViews,
        totalEarnings,
      },
      chartData,
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
