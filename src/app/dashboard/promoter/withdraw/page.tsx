'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'

export default function WithdrawPage() {
  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Jumlah harus berupa angka positif.')
      setLoading(false)
      return
    }
    if (!bankName || !accountNumber || !accountName) {
        setError('Semua detail rekening bank harus diisi.')
        setLoading(false)
        return
    }

    try {
      // Di dunia nyata, ini akan memanggil API backend untuk:
      // 1. Memvalidasi apakah saldo promotor mencukupi.
      // 2. Membuat record transaksi baru dengan tipe 'withdrawal' dan status 'pending'.
      console.log(`Memulai permintaan penarikan sebesar Rp ${numericAmount} ke ${bankName} (${accountNumber}) a/n ${accountName}`)

      // --- SIMULASI INTERAKSI BACKEND ---
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`Permintaan penarikan berhasil diajukan! Dana akan diproses dalam 1-3 hari kerja.`)
      
      router.push('/dashboard/promoter')
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
        <form onSubmit={handleWithdraw}>
          <CardHeader>
            <CardTitle>Penarikan Dana (Withdrawal)</CardTitle>
            <CardDescription>Ajukan permintaan untuk menarik saldo Anda ke rekening bank.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <Label htmlFor="amount">Jumlah Penarikan (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 100000"
                  required
                  min="50000"
                />
            </div>
            <div>
                <Label htmlFor="bankName">Nama Bank</Label>
                <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="accountNumber">Nomor Rekening</Label>
                <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="accountName">Nama Pemilik Rekening</Label>
                <Input id="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Ajukan Penarikan'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
