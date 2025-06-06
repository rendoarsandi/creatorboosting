import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    // Aktifkan penghapusan console.log di lingkungan produksi
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    // Tambahkan domain gambar Anda di sini untuk optimasi
    // domains: ['example.com'],
  },
};

export default nextConfig;
