import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Placeholder untuk secret webhook yang akan Anda dapatkan dari payment gateway
const WEBHOOK_SECRET = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  try {
    // 1. Validasi Signature (Sangat Penting untuk Keamanan)
    // Setiap payment gateway memiliki cara yang berbeda untuk ini.
    // Contoh ini menggunakan header 'X-Signature'. Ganti sesuai dokumentasi gateway Anda.
    const signature = req.headers.get('X-Signature')
    if (!signature || signature !== WEBHOOK_SECRET) {
      console.warn('Invalid webhook signature received.')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse Body Permintaan
    const payload = await req.json()

    // Asumsikan payload memiliki struktur seperti ini (sesuaikan dengan gateway Anda):
    // {
    //   event: 'payment.success',
    //   data: {
    //     amount: 50000,
    //     currency: 'IDR',
    //     metadata: {
    //       user_id: 'some-uuid-of-the-user'
    //     }
    //   }
    // }
    const { event, data } = payload
    const { amount, metadata } = data
    const { user_id } = metadata

    if (event === 'payment.success') {
      // 3. Dapatkan dompet pengguna
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user_id)
        .single()

      if (walletError || !wallet) {
        throw new Error(`Dompet untuk pengguna ${user_id} tidak ditemukan.`)
      }

      // 4. Update saldo dompet
      const newBalance = wallet.balance + amount
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', wallet.id)

      if (updateError) {
        throw new Error(`Gagal memperbarui dompet untuk pengguna ${user_id}: ${updateError.message}`)
      }

      // 5. (Opsional) Catat transaksi deposit
      await supabase.from('transactions').insert({
        wallet_id: wallet.id,
        amount: amount,
        type: 'deposit',
        status: 'completed',
      })

      console.log(`Successfully processed deposit of ${amount} for user ${user_id}.`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error processing payment webhook:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}