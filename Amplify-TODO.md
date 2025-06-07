# To-Do List Teknis: Platform Amplify

**Dokumen Terkait:** [Amplify-PRD.md](Amplify-PRD.md)
**Versi:** 1.0

---

## Fase 0: Penyiapan Proyek & Fondasi

*Tujuan: Menyiapkan semua alat, layanan, dan struktur dasar proyek agar siap untuk pengembangan.*

- [ ] **Proyek Next.js:** Inisialisasi proyek Next.js baru menggunakan `create-next-app`.
- [ ] **Integrasi Vercel:** Hubungkan repositori Git ke Vercel untuk CI/CD (Continuous Integration/Continuous Deployment).
- [x] **Proyek Supabase:**
    - [x] Buat proyek baru di Supabase.
    - [x] Aktifkan layanan: Auth, Database (Postgres), Storage.
- [x] **Konfigurasi Environment:**
    - [x] Simpan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` sebagai environment variables di Next.js (file `.env.local`).
    - [x] Tambahkan variabel yang sama ke pengaturan environment di Vercel.
- [x] **Struktur Folder:**
    - [x] Buat struktur direktori awal: `src/app`, `src/components`, `src/lib`, `src/styles`.
    - [x] Setup `shadcn/ui` untuk komponen UI.
- [x] **Inisialisasi Database:**
    - [x] Buat skema awal menggunakan Supabase Studio SQL Editor.
    - [x] Buat tabel `profiles` dengan kolom: `id` (UUID, foreign key ke `auth.users`), `role` (ENUM: 'creator', 'promoter'), `full_name`, `avatar_url`.
    - [x] Atur RLS (Row Level Security) pada tabel `profiles` agar pengguna hanya bisa melihat dan mengedit profil mereka sendiri.

---

## Fase 1: MVP - Fungsionalitas Inti

*Tujuan: Meluncurkan fungsionalitas minimal agar siklus "Kreator membuat kampanye" dan "Promotor berpartisipasi" dapat berjalan dari awal hingga akhir (tanpa transaksi uang sungguhan).*

### Epic: Autentikasi & Profil
- [x] **Halaman Auth:** Buat halaman `/login` dan `/register`.
- [x] **Logika Auth:** Implementasikan fungsi `signInWithPassword` dan `signUp` dari `supabase-js`.
- [x] **Manajemen Sesi:** Gunakan Supabase Auth Helpers for Next.js (`@supabase/auth-helpers-nextjs`) untuk mengelola sesi pengguna.
- [x] **Middleware:** Buat middleware (`middleware.ts`) untuk melindungi rute-rute yang memerlukan autentikasi (misal: `/dashboard/*`).
- [x] **Pemicu Database:** Buat Postgres Function yang dipicu saat ada pengguna baru di `auth.users` untuk secara otomatis membuat entri baru di tabel `profiles`.
- [x] **Halaman Profil:** Buat halaman `/profile/edit` di mana pengguna dapat memperbarui `full_name` dan `avatar_url`.

### Epic: Manajemen Kampanye (Sisi Kreator)
- [x] **Skema Database:**
    - [x] Buat tabel `campaigns` (`id`, `creator_id`, `title`, `description`, `total_budget`, `rate_per_10k_views`, `terms`, `status`).
    - [x] Buat tabel `campaign_assets` (`id`, `campaign_id`, `asset_url`, `asset_type`).
- [x] **Form Pembuatan Kampanye:** Buat komponen React untuk form pembuatan/edit kampanye.
- [x] **API Route:** Buat API Route di Next.js (`/api/campaigns`) untuk menangani CRUD kampanye. Pastikan ada validasi di sisi server yang memeriksa apakah pengguna adalah 'creator'.
- [x] **Halaman Dashboard Kreator:** Buat halaman `/dashboard/creator` yang menampilkan daftar kampanye yang dimiliki oleh kreator yang sedang login.

### Epic: Partisipasi Kampanye (Sisi Promotor)
- [x] **Halaman Marketplace:** Buat halaman `/marketplace` yang menampilkan semua kampanye dengan status 'active'.
- [x] **Skema Database:**
    - [x] Buat tabel `submissions` (`id`, `campaign_id`, `promoter_id`, `submitted_url`, `status`, `tracked_views`, `last_checked_at`).
- [x] **Logika Partisipasi:**
    - [x] Implementasikan fungsionalitas "Join Campaign" yang membuat entri di tabel `submissions`.
    - [x] Buat form untuk submit URL di halaman detail kampanye.
- [x] **Halaman Dashboard Promotor:** Buat halaman `/dashboard/promoter` yang menampilkan daftar submission milik promotor.

---

## Fase 2: Sistem Finansial & Pelacakan Otomatis

*Tujuan: Mengaktifkan aliran uang dan mengimplementasikan fitur inti yang membedakan Amplify: pelacakan performa otomatis.*

### Epic: Dompet & Transaksi
- [x] **Skema Database:**
    - [x] Buat tabel `wallets` (`id` (user_id), `balance`).
    - [x] Buat tabel `transactions` (`id`, `from_wallet_id`, `to_wallet_id`, `amount`, `type`, `status`).
- [ ] **Integrasi Payment Gateway:**
    - [ ] Pilih dan daftar ke layanan Payment Gateway (Midtrans/Xendit).
    - [x] Implementasikan SDK mereka di sisi frontend untuk proses top-up. (UI/Kerangka dibuat)
    - [x] Buat webhook di Next.js API Route untuk menerima notifikasi status pembayaran dari payment gateway dan memperbarui saldo di tabel `wallets`. (Kerangka dibuat)
- [x] **Logika Withdrawal:**
    - [x] Buat halaman dan form untuk permintaan withdrawal. (UI/Kerangka dibuat)
    - [ ] Buat proses admin manual terlebih dahulu untuk mengirim uang, sebelum membangun sistem otomatis.
- [x] **Fungsi Transfer Internal:** Buat Postgres Function `create_transfer(from_id, to_id, amount)` yang secara transaksional mengurangi saldo pengirim dan menambah saldo penerima untuk memastikan atomicity. (Fungsi dibuat)

### Epic: Pelacakan Performa Otomatis
- [x] **Riset Scraping:** Lakukan riset teknis untuk metode scraping yang paling andal dan tidak mudah diblokir untuk TikTok, Instagram Reels, dan YouTube Shorts. Pertimbangkan penggunaan library seperti `puppeteer` atau `playwright` di dalam Edge Function. (Konsep divalidasi)
- [x] **Edge Function: View Scraper:**
    - [x] Buat Supabase Edge Function pertama (`view-scraper`) yang menerima satu `submitted_url` sebagai argumen. (Kerangka dibuat)
    - [x] Implementasikan logika scraping untuk mengambil jumlah views. (Implementasi dasar dengan Cheerio)
    - [ ] Atur cron job (Supabase Scheduled Functions) untuk menjalankan fungsi ini setiap 4-6 jam, mengambil batch `submissions` yang statusnya 'active'.
- [x] **Edge Function: Payment Calculator:**
    - [x] Buat Supabase Edge Function kedua (`payment-calculator`) yang dipicu setelah `view-scraper` selesai. (Kerangka dibuat)
    - [x] Fungsi ini akan:
        1.  Mengambil `submissions` yang baru diperbarui.
        2.  Menghitung selisih views (`new_views - tracked_views`).
        3.  Menghitung jumlah pembayaran.
        4.  Memanggil fungsi `create_transfer` untuk memindahkan dana. (Implementasi selesai)
        5.  Memperbarui `tracked_views` di tabel `submissions`. (Logika `views_paid_for` diimplementasikan)

---

## Fase 3: Peningkatan & Pengoptimalan

*Tujuan: Memperkaya pengalaman pengguna dengan data, notifikasi, dan memastikan platform siap untuk rilis publik.*

- [x] **Dashboard Analitik:**
    - [x] Integrasikan library charting (misal: Recharts, Chart.js).
    - [x] Bangun komponen visual untuk menampilkan data agregat bagi Kreator dan Promotor.
- [x] **Sistem Notifikasi:**
    - [x] Buat tabel `notifications` (`id`, `user_id`, `message`, `is_read`).
    - [x] Buat komponen UI untuk menampilkan notifikasi di dalam aplikasi.
    - [ ] (Opsional) Integrasikan dengan layanan email (misal: Resend) untuk notifikasi penting.
- [x] **Panel Admin:**
    - [x] Buat halaman-halaman khusus di bawah rute `/admin` yang hanya bisa diakses oleh peran 'admin'.
    - [x] Implementasikan fungsionalitas dasar untuk manajemen pengguna dan kampanye. (Manajemen Pengguna & Kampanye Selesai)
- [ ] **Optimasi & Keamanan:**
    - [ ] Lakukan peninjauan keamanan menyeluruh pada semua RLS policy dan API routes.
    - [ ] Optimalkan query database yang lambat.
    - [ ] Lakukan pengujian beban (load testing) pada Edge Function scraper.
    - [ ] Tambahkan indeks pada kolom-kolom tabel database yang sering di-query.

---

## Fase 4: Konsep Marketplace Aset Digital & Demo Interaktif

*Tujuan: Merancang dan mengimplementasikan pengalaman pengguna baru untuk menarik kreator dengan menyediakan dasbor demo interaktif.*

- [x] **Skema & Data Mock:**
   - [x] Buat tabel `products`, `sales`, dan `reviews`.
   - [x] Buat API route aman (`/api/admin/setup-demo`) untuk membuat pengguna demo dan mengisi data mock.
- [x] **Alur Demo Pengguna:**
   - [x] Buat API route (`/api/auth/demo`) untuk me-login pengguna sebagai akun demo.
   - [x] Tambahkan tombol "Coba Dashboard Demo" di halaman utama.
- [x] **Desain Dasbor Demo:**
   - [x] Buat fungsi-fungsi database (RPC) untuk mengambil statistik, penjualan, dan produk terlaris.
   - [x] Bangun komponen UI untuk dasbor: Widget Statistik, Grafik Penjualan, Tabel Produk Terlaris, Feed Aktivitas.
   - [x] Implementasikan halaman dasbor penjual yang lengkap dan berbasis data.
- [x] **Desain Ulang Halaman Marketplace:**
   - [x] Ubah halaman menjadi komponen sisi server.
   - [x] Implementasikan layout grid modern dengan kartu produk interaktif.
   - [x] Tambahkan kerangka untuk fungsionalitas filter dan urutkan.
