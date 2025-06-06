-- Hapus pemicu lama jika ada, untuk menghindari konflik
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 1. Buat Tabel Profil
-- Tabel ini akan menyimpan data publik pengguna yang tidak termasuk dalam skema auth.
-- Ini termasuk peran mereka di platform (Kreator atau Promotor).

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('creator', 'promoter')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS) untuk tabel profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan agar pengguna dapat melihat semua profil (bersifat publik)
CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT
USING (true);

-- Buat kebijakan agar pengguna dapat memperbarui profil mereka sendiri
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);


-- 2. Buat Fungsi Pemicu
-- Fungsi ini akan dipanggil oleh pemicu setiap kali pengguna baru mendaftar.
-- Ini akan membuat entri yang sesuai di tabel 'profiles' publik.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;


-- 3. Buat Pemicu
-- Pemicu ini akan memanggil fungsi 'handle_new_user' setiap kali
-- baris baru ditambahkan ke tabel 'auth.users'.

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();