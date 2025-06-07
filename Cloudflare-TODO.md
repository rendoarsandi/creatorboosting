# To-Do List Teknis: Migrasi Amplify ke Cloudflare

**Dokumen Terkait:** [Cloudflare-PRD.md](Cloudflare-PRD.md)
**Versi:** 1.0

---

## Fase 0: Migrasi & Penyiapan Fondasi

*Tujuan: Membersihkan dependensi lama, menyiapkan alat baru, dan mendeploy kerangka aplikasi kosong ke Cloudflare.*

- [x] **Pembersihan Proyek:**
    - [x] Hapus paket npm: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `@supabase/ssr`.
    - [x] Hapus semua file dan folder terkait Supabase (`src/lib/supabase`, `supabase/`).
    - [x] Hapus variabel lingkungan Supabase dari semua file `.env*`.
    - [x] Hapus file `Amplify-PRD.md` dan `Amplify-TODO.md` untuk menghindari kebingungan.
- [x] **Inisialisasi Cloudflare:**
    - [x] Login ke `wrangler` CLI: `npx wrangler login`.
    - [x] Inisialisasi `wrangler.toml` di root proyek.
- [x] **Penyiapan Clerk Auth:**
    - [x] Buat aplikasi baru di dashboard Clerk.
    - [x] Instal paket Clerk: `npm install @clerk/nextjs`.
    - [x] Tambahkan variabel lingkungan Clerk (`CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) ke file `.env.local`.
- [x] **Konfigurasi Next.js untuk Cloudflare:**
    - [x] Pastikan `next.config.ts` dikonfigurasi untuk runtime `edge`.
    - [x] Hubungkan repositori ke proyek baru di Cloudflare Pages.
    - [x] Tambahkan variabel lingkungan Clerk ke pengaturan di Cloudflare Pages.
- [x] **Deploy Awal:** Lakukan deploy pertama ke Cloudflare Pages untuk memastikan kerangka dasar berjalan.

---

## Fase 1: Otentikasi & Struktur Data

*Tujuan: Mengimplementasikan alur otentikasi penuh dan menyiapkan database D1.*

- [x] **Implementasi Clerk UI:**
    - [x] Ganti semua komponen UI otentikasi Supabase dengan komponen dari `@clerk/nextjs`.
    - [x] Buat file `src/app/layout.tsx` dan bungkus aplikasi dengan `<ClerkProvider>`.
    - [x] Buat halaman `/sign-in` dan `/sign-up` menggunakan komponen Clerk.
    - [x] Ganti `middleware.ts` untuk menggunakan `authMiddleware` dari Clerk.
- [x] **Penyiapan Database D1:**
    - [x] Buat database D1 baru: `npx wrangler d1 create amplify-db`.
    - [x] Tambahkan binding D1 ke `wrangler.toml`.
    - [x] Buat file migrasi pertama (`0000_initial_schema.sql`) untuk membuat tabel: `profiles`, `campaigns`, `submissions`, `wallets`, `transactions`.
    - [x] Jalankan migrasi: `npx wrangler d1 migrations apply amplify-db --local`.
- [x] **Arsitektur Pages Functions:**
    - [x] Pindahkan logika backend ke direktori `functions`.
    - [x] Buat file `functions/api/[[path]].ts` sebagai catch-all API handler.
    - [ ] Implementasikan logika sinkronisasi pengguna dari Clerk ke D1 (sebelumnya `user-sync-worker`).

---

## Fase 2: Fungsionalitas Inti (Kampanye & Marketplace)

*Tujuan: Menghidupkan kembali alur utama aplikasi menggunakan Workers dan D1.*

- [x] **API Kampanye dengan Pages Functions:**
    - [x] Implementasikan endpoint `GET /api/campaigns` di dalam `functions/api/[[path]].ts`.
    - [ ] Implementasikan endpoint `POST /api/campaigns`.
    - [ ] Implementasikan endpoint `GET /api/campaigns/:id`.
- [x] **Integrasi Frontend:**
    - [x] Ubah halaman marketplace untuk mengambil data dari `GET /api/campaigns`.
    - [ ] Hubungkan form pembuatan kampanye ke `POST /api/campaigns`.
- [ ] **Penyiapan Storage R2:**
    - [ ] Buat bucket R2 baru: `npx wrangler r2 bucket create amplify-assets`.
    - [ ] Tambahkan binding R2 ke `campaign-api-worker` di `wrangler.toml`.
    - [ ] Implementasikan logika di Worker untuk menghasilkan URL upload yang aman (presigned URL) agar frontend bisa mengunggah aset kampanye langsung ke R2.
- [ ] **Worker: API Submission:**
    - [ ] Buat Worker baru (`submission-api-worker`).
    - [ ] Implementasikan endpoint untuk `POST /submissions` untuk menangani partisipasi promotor.

---

## Fase 3: Sistem Otomatis (Pelacakan & Pembayaran)

*Tujuan: Mengimplementasikan fitur inti menggunakan Cron Triggers dan Queues.*

- [ ] **Penyiapan Queues:**
    - [ ] Buat Queue baru: `npx wrangler queues create payment-queue`.
- [ ] **Worker: View Scraper:**
    - [ ] Buat Worker baru (`view-scraper-worker`).
    - [ ] Tambahkan binding D1 dan Queue ke Worker ini di `wrangler.toml`.
    - [ ] Implementasikan logika scraping.
    - [ ] Setelah scraping, kirim pesan ke `payment-queue` dengan data yang relevan.
    - [ ] Konfigurasikan **Cron Trigger** di `wrangler.toml` untuk menjalankan Worker ini setiap jam.
- [ ] **Worker: Payment Calculator:**
    - [ ] Buat Worker baru (`payment-calculator-worker`).
    - [ ] Tambahkan binding D1 dan Queue ke Worker ini.
    - [ ] Konfigurasikan Worker untuk dipicu oleh pesan dari `payment-queue`.
    - [ ] Implementasikan logika untuk membaca pesan, menghitung pembayaran, dan melakukan transfer dana di D1 secara transaksional.
- [ ] **Pengujian End-to-End:** Lakukan pengujian menyeluruh dari pembuatan kampanye hingga pembayaran otomatis berhasil diproses.

---

## Fase 4: Finalisasi & Pembersihan

*Tujuan: Memastikan semua bagian terintegrasi dengan baik dan siap untuk produksi.*

- [x] **Manajemen Variabel Lingkungan:** Pastikan semua secret (Clerk, D1, R2, Queues) telah ditambahkan ke pengaturan di Cloudflare Pages untuk lingkungan produksi.
- [x] **Optimasi:**
    - [x] Tinjau query D1 dan tambahkan indeks jika diperlukan.
    - [ ] Pastikan semua Worker menggunakan sumber daya secara efisien.
- [x] **Deploy Produksi:** Jalankan semua migrasi D1 di lingkungan produksi dan deploy versi terbaru dari Pages dan Workers.