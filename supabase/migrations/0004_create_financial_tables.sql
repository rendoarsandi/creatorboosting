-- 1. Buat Tabel Dompet (Wallets)
-- Tabel ini akan menyimpan saldo saat ini untuk setiap pengguna.
-- Saldo disimpan sebagai tipe data NUMERIC untuk presisi finansial.

CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pemicu untuk membuat dompet baru saat profil baru dibuat
CREATE OR REPLACE FUNCTION public.handle_new_profile_create_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallets (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

CREATE TRIGGER on_profile_created_create_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_profile_create_wallet();

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Kebijakan: Pengguna hanya dapat melihat dan mengakses dompet mereka sendiri.
CREATE POLICY "Users can access their own wallet."
ON public.wallets FOR ALL
USING (auth.uid() = id);


-- 2. Buat Tabel Transaksi
-- Tabel ini adalah buku besar yang mencatat semua pergerakan dana.

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_wallet_id UUID REFERENCES public.wallets(id), -- Bisa NULL untuk top-up dari luar
  to_wallet_id UUID REFERENCES public.wallets(id),   -- Bisa NULL untuk withdrawal ke luar
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('top-up', 'payment', 'withdrawal', 'fee')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  related_submission_id UUID REFERENCES public.submissions(id), -- Untuk melacak pembayaran ke submission mana
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Kebijakan: Pengguna dapat melihat transaksi yang melibatkan dompet mereka.
CREATE POLICY "Users can view their own transactions."
ON public.transactions FOR SELECT
USING (auth.uid() = from_wallet_id OR auth.uid() = to_wallet_id);

-- Tambahkan indeks untuk performa
CREATE INDEX idx_transactions_from_wallet ON public.transactions(from_wallet_id);
CREATE INDEX idx_transactions_to_wallet ON public.transactions(to_wallet_id);