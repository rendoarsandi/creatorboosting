-- 1. Buat Tabel Notifikasi
-- Tabel ini akan menyimpan notifikasi untuk pengguna, seperti pembayaran diterima,
-- kampanye baru yang cocok, atau status submission berubah.

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link_to TEXT, -- Opsional, untuk membuat notifikasi dapat diklik (misal: /marketplace/campaign-id)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Kebijakan: Pengguna hanya dapat melihat dan mengelola notifikasi mereka sendiri.
CREATE POLICY "Users can manage their own notifications."
ON public.notifications FOR ALL
USING (auth.uid() = user_id);

-- Tambahkan indeks untuk performa
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
