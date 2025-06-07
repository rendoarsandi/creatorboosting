import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio'

// Definisi tipe untuk data yang masuk
interface Submission {
  id: string;
  submitted_url: string;
}

// Fungsi untuk melakukan scraping menggunakan Cheerio
async function scrapeViewCount(url: string): Promise<number> {
  console.log(`Scraping URL: ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        // Meniru user-agent browser umum untuk menghindari pemblokiran sederhana
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Coba beberapa selector umum untuk menemukan jumlah penayangan
    let viewCount = 0;
    
    // 1. Coba dari meta tag (sering digunakan untuk SEO/OpenGraph)
    const metaSelector = 'meta[property="og:description"], meta[name="description"]';
    $(metaSelector).each((i, el) => {
        const content = $(el).attr('content');
        if (content) {
            const match = content.match(/([\d,.\s]+)\s*views/i) || content.match(/([\d,.\s]+)\s*plays/i);
            if (match && match[1]) {
                viewCount = parseInt(match[1].replace(/[,.\s]/g, ''), 10);
                if (!isNaN(viewCount)) return false; // Keluar dari loop jika ditemukan
            }
        }
    });

    if (viewCount > 0) {
      console.log(`Ditemukan dari meta tag: ${viewCount}`);
      return viewCount;
    }

    // 2. Coba dari skrip JSON-LD (data terstruktur modern)
    $('script[type="application/ld+json"]').each((i, el) => {
        try {
            const json = JSON.parse($(el).html() || '{}');
            if (json.interactionStatistic && json.interactionStatistic.userInteractionCount) {
                viewCount = parseInt(json.interactionStatistic.userInteractionCount, 10);
                if (!isNaN(viewCount)) return false;
            }
        } catch (e) {
            // Abaikan error parsing JSON
        }
    });
    
    if (viewCount > 0) {
      console.log(`Ditemukan dari JSON-LD: ${viewCount}`);
      return viewCount;
    }

    // 3. Fallback: Cari teks di body yang cocok dengan pola "X views"
    const bodyText = $('body').text();
    const bodyMatch = bodyText.match(/([\d,.\s]+)\s*views/i);
    if (bodyMatch && bodyMatch[1]) {
        viewCount = parseInt(bodyMatch[1].replace(/[,.\s]/g, ''), 10);
    }

    console.log(`Scraped view count: ${viewCount}`);
    return isNaN(viewCount) ? 0 : viewCount;

  } catch (error) {
    console.error(`Error saat scraping ${url}:`, error.message);
    return 0; // Kembalikan 0 jika terjadi error
  }
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