'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function TopUpPage() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Jumlah harus berupa angka positif.')
      setLoading(false)
      return
    }

    try {
      // Di dunia nyata, ini akan memanggil backend Anda untuk membuat sesi pembayaran
      // dengan payment gateway (misalnya, Midtrans, Xendit, Stripe).
      // Backend akan mengembalikan URL pembayaran.
      console.log(`Memulai proses top-up untuk Rp ${numericAmount}`)

      // --- SIMULASI INTERAKSI BACKEND ---
      // Untuk tujuan demo, kita akan berpura-pura berhasil dan hanya log ke konsol.
      // Di implementasi nyata, Anda akan redirect ke URL pembayaran yang diterima dari backend.
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasi latensi jaringan
      
      alert(`Permintaan top-up sebesar Rp ${numericAmount.toLocaleString('id-ID')} berhasil! Anda akan diarahkan kembali ke dasbor. Saldo akan diperbarui setelah pembayaran dikonfirmasi.`)
      
      router.push('/dashboard/creator')
      router.refresh()

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Terjadi kesalahan tidak diketahui.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-md">
      <Card>
        <form onSubmit={handleTopUp}>
          <CardHeader>
            <CardTitle>Top-Up Saldo</CardTitle>
            <CardDescription>Masukkan jumlah yang ingin Anda tambahkan ke dompet Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500000"
              required
              min="10000"
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
