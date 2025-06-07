/* eslint-disable react/no-unescaped-entities */
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DemoSetupRequiredPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">Pengguna Demo Tidak Ditemukan</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Untuk mengaktifkan fitur "Coba Dashboard Demo", seorang admin harus menyiapkan akun demo terlebih dahulu.
      </p>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left mb-6">
        <h2 className="text-xl font-semibold mb-2">Instruksi untuk Admin</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Login sebagai pengguna dengan peran 'admin'.</li>
          <li>Buka Panel Admin Anda.</li>
          <li>Cari dan klik tombol "Setup Demo Account".</li>
          <li>Ini akan secara otomatis membuat pengguna demo dan mengisi data yang diperlukan.</li>
        </ol>
      </div>
      <Link href="/">
        <Button>Kembali ke Halaman Utama</Button>
      </Link>
    </div>
  )
}