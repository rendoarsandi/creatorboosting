# Rencana Implementasi: Platform Pemasaran (Vercel & Supabase Stack)

Dokumen ini menguraikan langkah-langkah teknis untuk membangun dan mendeploy platform pemasaran berdasarkan PRD, menggunakan tumpukan teknologi Vercel dan Supabase.

## 1. Arsitektur Teknis (Vercel & Supabase)

- **Frontend**: Next.js (App Router), dihosting di **Vercel**.
- **Backend/API**: Next.js API Routes, dihosting di **Vercel**.
- **Database**: **Supabase Postgres** (Database SQL).
- **Penyimpanan File**: **Supabase Storage** (Untuk aset kampanye, bukti performa).
- **Autentikasi**: **Supabase Auth** (Email/Password, Social Logins).
- **UI**: Shadcn UI, Tailwind CSS.
- **Bahasa**: TypeScript.

## 2. Penyiapan Infrastruktur & Keamanan Supabase

**Langkah-langkah:**
1.  **Setup Proyek Supabase**:
    - Membuat proyek baru di [supabase.com](https://supabase.com).
    - Mendapatkan URL Proyek dan `anon` key dari pengaturan API.
2.  **Desain Skema Database**:
    - Mendesain dan membuat tabel yang diperlukan (`profiles`, `campaigns`, dll.) menggunakan Supabase Studio (SQL Editor).
    - Mengaktifkan Row Level Security (RLS) pada tabel untuk mengontrol akses data.
3.  **Konfigurasi Supabase Auth**:
    - Mengonfigurasi provider otentikasi (misalnya, Email/Password, Google, GitHub).
    - Menyesuaikan template email jika diperlukan.
4.  **Variabel Lingkungan**:
    - Membuat file `.env.local` untuk pengembangan lokal.
    - Menambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` ke `.env.local` dan ke pengaturan proyek Vercel.

## 3. Rencana Pengembangan Fitur (MVP)

### Tahap 1: Fondasi & Otentikasi (Sudah Selesai)
- **Tugas**:
    - **Halaman Login/Signup**:
        - Membuat formulir login dan signup kustom di `/auth/login` dan `/auth/signup`.
        - Mengintegrasikan dengan **Supabase Auth** untuk menangani pendaftaran dan login pengguna.
    - **Middleware (`src/middleware.ts`)**:
        - Menggunakan middleware Next.js dengan `@supabase/ssr` untuk mengelola sesi pengguna.
        - Melindungi rute yang memerlukan otentikasi (misalnya, `/profile`, `/creator/*`).
    - **Skema Database**:
        - Tabel `users` secara otomatis dikelola oleh Supabase Auth.
        - Perlu membuat tabel `profiles` untuk menyimpan data pengguna tambahan, yang ditautkan ke `users.id`.
    - **Halaman Profil**:
        - Menampilkan informasi pengguna (misalnya, email) dari sesi Supabase.
        - Menyediakan fungsionalitas logout.

### Tahap 2: Fungsionalitas Kreator
- **Tugas**:
    - Mendesain skema tabel `campaigns` di **Supabase**.
    - Halaman dashboard untuk Kreator (`/creator/campaigns`).
    - Formulir pembuatan kampanye baru (`/creator/campaigns/new`).
    - API Routes di Next.js untuk menyimpan data kampanye ke **Supabase DB** dan aset ke **Supabase Storage**.
    - Menampilkan daftar kampanye yang dibuat oleh kreator.

### Tahap 3: Fungsionalitas Promotor
- **Tugas**:
    - Mendesain skema tabel `submissions` dan `clicks` di **Supabase**.
    - Halaman untuk menampilkan semua kampanye yang tersedia.
    - Fungsionalitas bagi promotor untuk mengajukan diri (menyimpan ke `submissions`).
    - Logika di API Routes untuk membuat tautan pelacakan unik dan mencatat klik.

## 4. Deployment & Operasi

**Strategi**:
- **Platform**: **Vercel**.
- **Source**: Menghubungkan repositori Git ke Vercel.
- **Build Command**: `npm run build` (dideteksi otomatis oleh Vercel).
- **Output Directory**: `.next` (dideteksi otomatis oleh Vercel).
- **Variabel Lingkungan**: Mengonfigurasi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di dashboard Vercel.
- **CI/CD**: Deployment otomatis setiap kali ada push ke branch utama.

## 5. Langkah Selanjutnya (Pasca-MVP)

- Implementasi dashboard analitik menggunakan data dari **Supabase**.
- Integrasi sistem pembayaran (misalnya, Stripe).
- Sistem notifikasi (bisa menggunakan layanan email pihak ketiga yang dipicu oleh Supabase Functions atau API Routes).
- Penyempurnaan fitur deteksi fraud.
