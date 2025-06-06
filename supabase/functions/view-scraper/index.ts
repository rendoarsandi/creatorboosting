import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Definisi tipe untuk data yang masuk
interface Submission {
  id: string;
  submitted_url: string;
}

// Fungsi untuk melakukan scraping (saat ini hanya placeholder)
async function scrapeViewCount(url: string): Promise<number> {
  console.log(`Scraping URL: ${url}`);
  // TODO: Implementasikan logika scraping yang sebenarnya di sini.
  // Ini bisa menggunakan fetch untuk API tidak resmi atau library browser headless.
  // Untuk sekarang, kita kembalikan angka acak untuk simulasi.
  const mockViewCount = Math.floor(Math.random() * 10000) + 1000;
  console.log(`Mocked view count: ${mockViewCount}`);
  return mockViewCount;
}

// @ts-ignore: Deno-specific APIs are available in the Supabase Edge Function environment
serve(async (req: Request) => {
  try {
    // 1. Ambil data submission dari body permintaan
    const { submissions } = (await req.json()) as { submissions: Submission[] };
    if (!submissions || submissions.length === 0) {
      return new Response(JSON.stringify({ message: 'No submissions provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Buat klien Supabase di dalam Edge Function
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 3. Proses setiap submission
    for (const submission of submissions) {
      const newViewCount = await scrapeViewCount(submission.submitted_url);

      // 4. Update jumlah views di tabel submissions
      const { error } = await supabaseAdmin
        .from('submissions')
        .update({
          tracked_views: newViewCount,
          last_checked_at: new Date().toISOString(),
          status: 'tracking' // Update status menjadi tracking
        })
        .eq('id', submission.id);

      if (error) {
        console.error(`Error updating submission ${submission.id}:`, error);
      } else {
        console.log(`Successfully updated submission ${submission.id} with ${newViewCount} views.`);
      }
    }

    return new Response(JSON.stringify({ message: 'View scraping process completed.' }), {
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