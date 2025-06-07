-- Menghapus pemicu dan fungsi yang tidak lagi digunakan.
-- Logika pembuatan profil sekarang ditangani oleh aplikasi di sisi klien
-- pada halaman registrasi untuk memastikan peran pengguna dipilih dengan benar,
-- terutama untuk pengguna yang mendaftar melalui OAuth.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user();
