import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Definisi tipe untuk data yang masuk
interface Submission {
  id: string;
  tracked_views: number;
  campaign_id: string;
  promoter_id: string;
  // Kita perlu mengambil data kampanye juga
  campaigns: {
    rate_per_10k_views: number;
    creator_id: string;
    total_budget: number; // Untuk memeriksa sisa budget
  } | null;
}

// Fungsi ini akan dipanggil oleh cron job atau setelah scraper selesai
serve(async (req) => {
  try {
    // 1. Buat klien Supabase Admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Ambil semua submission yang statusnya 'tracking'
    //    dan memiliki selisih views yang perlu dibayar.
    //    Logika ini perlu disempurnakan. Untuk sekarang, kita ambil semua.
    const { data: submissions, error: submissionError } = await supabaseAdmin
      .from('submissions')
      .select(`
        id,
        tracked_views,
        campaign_id,
        promoter_id,
        campaigns ( rate_per_10k_views, creator_id, total_budget )
      `)
      .eq('status', 'tracking');

    if (submissionError) throw submissionError;
    if (!submissions || submissions.length === 0) {
      return new Response(JSON.stringify({ message: 'No submissions to process.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Proses setiap submission
    for (const submission of submissions as Submission[]) {
      // TODO: Logika yang lebih canggih diperlukan di sini.
      // Kita perlu menyimpan 'views_paid_for' untuk menghindari pembayaran ganda.
      // Untuk sekarang, kita asumsikan kita membayar untuk semua 'tracked_views'.

      if (!submission.campaigns) continue;

      const viewsToPay = submission.tracked_views; // Placeholder logic
      const rate = submission.campaigns.rate_per_10k_views;
      const paymentAmount = (viewsToPay / 10000) * rate;

      if (paymentAmount <= 0) continue;

      // TODO: Cek apakah budget kampanye mencukupi

      // 4. Panggil fungsi 'create_transfer' di database
      const { error: rpcError } = await supabaseAdmin.rpc('create_transfer', {
        from_id: submission.campaigns.creator_id,
        to_id: submission.promoter_id,
        amount_to_transfer: paymentAmount,
        submission_id: submission.id,
      });

      if (rpcError) {
        console.error(`Error processing payment for submission ${submission.id}:`, rpcError);
      } else {
        console.log(`Successfully processed payment of ${paymentAmount} for submission ${submission.id}.`);
        // TODO: Update 'views_paid_for' di tabel submissions
      }
    }

    return new Response(JSON.stringify({ message: 'Payment calculation process completed.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in Edge Function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});