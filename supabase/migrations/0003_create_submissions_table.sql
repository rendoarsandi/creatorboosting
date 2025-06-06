-- 1. Buat Tabel Submissions
-- Tabel ini akan melacak setiap video yang disubmit oleh Promotor untuk sebuah kampanye.

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  promoter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submitted_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'tracking')),
  tracked_views BIGINT DEFAULT 0,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Kebijakan: Promotor dapat membuat dan melihat submission mereka sendiri.
CREATE POLICY "Promoters can manage their own submissions."
ON public.submissions FOR ALL
USING (auth.uid() = promoter_id);

-- Kebijakan: Kreator dapat melihat semua submission untuk kampanye mereka.
CREATE POLICY "Creators can view submissions for their own campaigns."
ON public.submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = submissions.campaign_id AND creator_id = auth.uid()
  )
);

-- Tambahkan indeks untuk performa query yang lebih baik
CREATE INDEX idx_submissions_campaign_id ON public.submissions(campaign_id);
CREATE INDEX idx_submissions_promoter_id ON public.submissions(promoter_id);