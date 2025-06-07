import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Definisi tipe untuk data yang masuk
interface Submission {
  id: string;
  tracked_views: number;
  views_paid_for: number;
  campaign_id: string;
  promoter_id: string;
  campaigns: {
    rate_per_10k_views: number;
    creator_id: string;
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

    // 2. Ambil semua submission yang statusnya 'tracking' dan memiliki selisih views
    const { data: submissions, error: submissionError } = await supabaseAdmin
      .from('submissions')
      .select(`
        id,
        tracked_views,
        views_paid_for,
        campaign_id,
        promoter_id,
        campaigns ( rate_per_10k_views, creator_id )
      `)
      .eq('status', 'tracking')
      .gt('tracked_views', 'views_paid_for'); // Hanya ambil jika ada views baru

    if (submissionError) throw submissionError;
    if (!submissions || submissions.length === 0) {
      return new Response(JSON.stringify({ message: 'No submissions to process.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Proses setiap submission
    for (const submission of submissions as Submission[]) {
      if (!submission.campaigns) {
        console.log(`Skipping submission ${submission.id} due to missing campaign data.`);
        continue;
      }

      const viewsToPay = submission.tracked_views - submission.views_paid_for;
      if (viewsToPay <= 0) continue;

      const rate = submission.campaigns.rate_per_10k_views;
      const paymentAmount = (viewsToPay / 10000) * rate;

      if (paymentAmount <= 0.01) continue; // Jangan proses pembayaran yang sangat kecil

      // 4. Panggil fungsi 'create_transfer' di database.
      // Fungsi ini sudah memiliki pengecekan saldo di dalamnya.
      const { error: rpcError } = await supabaseAdmin.rpc('create_transfer', {
        from_user_id: submission.campaigns.creator_id,
        to_user_id: submission.promoter_id,
        amount_to_transfer: paymentAmount,
        transfer_type: 'campaign_payment',
        related_entity: submission.id,
      });

      if (rpcError) {
        console.error(`Payment failed for submission ${submission.id}:`, rpcError.message);
        // Jika error karena saldo tidak cukup, kita bisa menandai kampanye
        if (rpcError.message.includes('Saldo tidak mencukupi')) {
            // Logika untuk menonaktifkan kampanye bisa ditambahkan di sini
        }
      } else {
        // 5. Jika transfer berhasil, update 'views_paid_for'
        const { error: updateError } = await supabaseAdmin
          .from('submissions')
          .update({ views_paid_for: submission.tracked_views })
          .eq('id', submission.id);

        if (updateError) {
          console.error(`CRITICAL: Payment was made for submission ${submission.id} but failed to update views_paid_for:`, updateError);
        } else {
          console.log(`Successfully processed payment of ${paymentAmount} for ${viewsToPay} new views on submission ${submission.id}.`);
        }
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
