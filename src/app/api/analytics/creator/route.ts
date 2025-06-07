import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type Campaign = {
  id: number;
  created_at: string;
};

type Submission = {
  tracked_views: number | null;
  created_at: string;
};

export async function GET() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 })
    }

    // Ambil semua kampanye milik kreator
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, created_at')
      .eq('creator_id', session.user.id)

    if (campaignsError) throw campaignsError;
    if (!campaigns) {
      return NextResponse.json({ error: 'Campaigns not found' }, { status: 404 });
    }

    const campaignIds = (campaigns as Campaign[]).map((c) => c.id);

    // Ambil semua submission yang terkait dengan kampanye kreator
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('tracked_views, created_at')
      .in('campaign_id', campaignIds)

    if (submissionsError) throw submissionsError;
    if (!submissions) {
      return NextResponse.json({ error: 'Submissions not found' }, { status: 404 });
    }

    // Hitung statistik ringkasan
    const totalCampaigns = campaigns.length;
    const totalSubmissions = submissions.length;
    const totalViews = (submissions as Submission[]).reduce((acc, sub) => acc + (sub.tracked_views || 0), 0);

    // Siapkan data untuk grafik (contoh: submissions per hari)
    const submissionsByDate = (submissions as Submission[]).reduce((acc: Record<string, number>, sub) => {
      const date = new Date(sub.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(submissionsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const analyticsData = {
      summary: {
        totalCampaigns,
        totalSubmissions,
        totalViews,
      },
      chartData,
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
