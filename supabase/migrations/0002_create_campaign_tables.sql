-- 1. Buat Tabel Kampanye
-- Tabel ini menyimpan detail utama dari setiap kampanye yang dibuat oleh Kreator.

CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  total_budget NUMERIC(10, 2) NOT NULL CHECK (total_budget >= 0),
  rate_per_10k_views NUMERIC(10, 2) NOT NULL CHECK (rate_per_10k_views > 0),
  terms TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Kebijakan: Kreator dapat melihat dan mengelola kampanye mereka sendiri.
CREATE POLICY "Creators can manage their own campaigns."
ON public.campaigns FOR ALL
USING (auth.uid() = creator_id);

-- Kebijakan: Semua pengguna yang diautentikasi (termasuk Promotor) dapat melihat kampanye yang aktif.
CREATE POLICY "Authenticated users can view active campaigns."
ON public.campaigns FOR SELECT
USING (status = 'active');


-- 2. Buat Tabel Aset Kampanye
-- Tabel ini menyimpan link ke materi yang disediakan oleh Kreator.

CREATE TABLE IF NOT EXISTS public.campaign_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  asset_url TEXT NOT NULL,
  asset_type TEXT, -- e.g., 'google_drive_folder', 'youtube_video', 'direct_upload'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.campaign_assets ENABLE ROW LEVEL SECURITY;

-- Kebijakan: Pengguna dapat melihat aset dari kampanye yang dapat mereka lihat.
-- Ini bergantung pada kebijakan di tabel 'campaigns'.
CREATE POLICY "Users can view assets for campaigns they can access."
ON public.campaign_assets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns WHERE id = campaign_id
  )
);

-- Kebijakan: Kreator dapat menambahkan/menghapus aset ke kampanye mereka sendiri.
CREATE POLICY "Creators can manage assets for their own campaigns."
ON public.campaign_assets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns WHERE id = campaign_id AND creator_id = auth.uid()
  )
);