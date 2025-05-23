# Product Requirements Document: Platform Pemasaran Kreator & Promotor

## 1. Pendahuluan
    - Latar Belakang Proyek
    - Tujuan Produk
    - Ruang Lingkup
    - Pengguna Target (Kreator, Promotor)

## 2. Arsitektur Teknis yang Diusulkan
    - **Frontend**: Next.js (React Framework) dengan komponen UI dari Shadcn.
    - **Backend & API**: Next.js API Routes.
    - **Database**: Supabase Postgres Database.
    - **Autentikasi**: Supabase Auth.
    - **Penyimpanan File**: Supabase Storage (untuk aset kampanye, bukti performa).
    - **Fungsi Serverless (Opsional)**: Supabase Edge Functions (untuk logika backend tertentu, tugas terjadwal).
    - **Deployment**: Vercel (untuk hosting frontend Next.js dan API Routes).

## 3. Fitur Utama
    ### 3.1. Manajemen Pengguna
        - Registrasi & Login (Kreator, Promotor)
        - Manajemen Profil
    ### 3.2. Manajemen Kampanye (untuk Kreator)
        - Pembuatan Kampanye Baru (detail, budget, target, materi)
        - Pengelolaan Kampanye Aktif
        - Pemantauan Performa Kampanye
        - Pengelolaan Dana/Deposit
    ### 3.3. Partisipasi Kampanye (untuk Promotor)
        - Penemuan Kampanye
        - Pengajuan untuk Bergabung dengan Kampanye
        - Pembuatan Tautan Pelacakan Unik
        - Pelaporan Performa (misal: upload bukti screenshot)
        - Permintaan Pembayaran/Payout
    ### 3.4. Pelacakan Tautan & Analitik Dasar
        - Generasi tautan unik untuk promotor.
        - Pencatatan klik (IP, User Agent, Timestamp, Referrer) ke Supabase.
        - Dashboard analitik dasar untuk kreator dan promotor.
    ### 3.5. Mekanisme Deteksi Bot/Fraud (Non-ML)
        - Implementasi filter berbasis aturan (analisis IP, User-Agent).
        - Pembatasan frekuensi klik.
        - (Rincian metode non-ML lainnya yang disepakati).
    ### 3.6. Sistem Pembayaran
        - Integrasi dengan payment gateway untuk deposit kreator (jika diperlukan).
        - Proses payout ke promotor (mekanisme akan dirinci).
    ### 3.7. Penyimpanan File
        - Upload materi kampanye oleh kreator.
        - Upload bukti performa oleh promotor.
    ### 3.8. Notifikasi
        - Notifikasi dalam aplikasi atau email untuk aktivitas penting (misal: kampanye baru, persetujuan promotor, pembayaran).

## 4. Pertimbangan Non-Fungsional
    - Keamanan
    - Skalabilitas
    - Performa
    - Kemudahan Penggunaan (User Experience)

## 5. Strategi Deployment
    - Deployment berkelanjutan menggunakan Vercel dari repositori Git.
    - Pengelolaan layanan Supabase melalui dashboard Supabase.

## 6. Rencana Rilis (High-Level)
    - MVP (Minimum Viable Product): Fitur inti untuk menjalankan siklus kampanye.
    - Rilis Selanjutnya: Peningkatan fitur, optimasi.