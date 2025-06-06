# Rencana Implementasi: Platform Pemasaran (Full Cloudflare Stack)

Dokumen ini menguraikan langkah-langkah teknis untuk membangun dan mendeploy platform pemasaran berdasarkan PRD, menggunakan tumpukan teknologi penuh dari Cloudflare.

## 1. Arsitektur Teknis (Cloudflare Native)

- **Frontend**: Next.js (App Router), dihosting di **Cloudflare Pages**.
- **Backend/API**: **Cloudflare Workers** (dapat diintegrasikan dengan Next.js API Routes atau sebagai service terpisah).
- **Database**: **Cloudflare D1** (Database SQL).
- **Penyimpanan File**: **Cloudflare R2** (Untuk aset kampanye, bukti performa).
- **Autentikasi**: **Cloudflare Access** (Zero Trust) untuk mengamankan rute aplikasi.
- **Proteksi Bot**: **Cloudflare Turnstile** pada formulir publik (Login/Signup).
- **UI**: Shadcn UI, Tailwind CSS.
- **Bahasa**: TypeScript.

## 2. Penyiapan Infrastruktur & Keamanan Cloudflare

**Langkah-langkah:**
1.  **Setup Cloudflare D1 & R2**: Membuat database D1 dan bucket R2.
2.  **Konfigurasi Cloudflare Access**:
    - Membuat "Application" di Zero Trust Dashboard.
    - Mengonfigurasi "Identity Providers" (misal: Google, GitHub, atau One-Time Pin via Email).
    - Menentukan "Policies" untuk melindungi rute spesifik (misal: `/creator/*`, `/profile`). Rute publik seperti `/auth/login` akan dibiarkan tidak terlindungi.
3.  **Konfigurasi Cloudflare Turnstile**:
    - Membuat "Site" baru di dashboard Turnstile untuk mendapatkan `Site Key` dan `Secret Key`.
4.  **Binding & Variabel Lingkungan**:
    - Menghubungkan D1 dan R2 ke proyek Cloudflare Pages.
    - Menambahkan `TURNSTILE_SECRET_KEY` sebagai variabel lingkungan di proyek.

## 3. Rencana Pengembangan Fitur (MVP)

### Tahap 1: Fondasi & Otentikasi (Strategi Hybrid)
- **Tugas**:
    - **Halaman Login/Signup Kustom**:
        - Mempertahankan UI di `/auth/login` dan `/auth/signup`.
        - Mengintegrasikan widget **Cloudflare Turnstile** pada formulir ini untuk mencegah spam.
        - **Mengubah Tombol Login**: Tombol "Login" tidak lagi mengirimkan form, melainkan mengarahkan pengguna ke URL aplikasi yang disediakan oleh **Cloudflare Access**.
    - **Middleware (`src/middleware.ts`)**:
        - Middleware tidak lagi menangani logika login/logout secara langsung.
        - Tugasnya adalah memverifikasi JWT yang ada di cookie `CF_Authorization` setelah pengguna berhasil login melalui Cloudflare Access.
        - Informasi pengguna (misal: email) dari token JWT akan digunakan untuk personalisasi di dalam aplikasi.
    - **Skema Database**: Mendesain skema tabel `users` dan `profiles` di **D1** untuk menyimpan data aplikasi yang terkait dengan email pengguna dari token Access.
    - **Halaman Profil**: Menampilkan informasi pengguna yang didapat dari token JWT.

### Tahap 2: Fungsionalitas Kreator
- **Tugas**:
    - Mendesain skema tabel `campaigns` di **D1**.
    - Halaman dashboard untuk Kreator (`/creator/campaigns`).
    - Formulir pembuatan kampanye baru (`/creator/campaigns/new`).
    - API di **Workers** untuk menyimpan data kampanye ke **D1** dan aset ke **R2**.
    - Menampilkan daftar kampanye yang dibuat oleh kreator.

### Tahap 3: Fungsionalitas Promotor
- **Tugas**:
    - Mendesain skema tabel `submissions` dan `clicks` di **D1**.
    - Halaman untuk menampilkan semua kampanye yang tersedia.
    - Fungsionalitas bagi promotor untuk mengajukan diri (menyimpan ke `submissions`).
    - Logika di **Workers** untuk membuat tautan pelacakan unik dan mencatat klik.

## 4. Deployment & Operasi

**Strategi**:
- **Source**: Menghubungkan repositori Git ke **Cloudflare Pages**.
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (atau sesuai konfigurasi Pages).
- **Variabel Lingkungan**: Mengonfigurasi variabel rahasia (secrets) melalui dashboard Cloudflare untuk API keys atau token.
- **CI/CD**: Deployment otomatis setiap kali ada push ke branch utama.

## 5. Langkah Selanjutnya (Pasca-MVP)

- Implementasi dashboard analitik menggunakan data dari **D1**.
- Integrasi sistem pembayaran.
- Sistem notifikasi (bisa menggunakan layanan email pihak ketiga yang dipicu oleh Workers).
- Penyempurnaan fitur deteksi fraud.
