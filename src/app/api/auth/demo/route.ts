import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// PENTING: Kredensial ini harus cocok dengan pengguna yang dibuat oleh endpoint setup-demo.
// Untuk produksi nyata, Anda akan mengambil ini dari variabel lingkungan atau layanan konfigurasi.
const DEMO_USER_EMAIL = process.env.DEMO_USER_EMAIL || 'demo@example.com'
const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD || 'password123'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  // 1. Logout dari sesi yang mungkin ada
  await supabase.auth.signOut()

  // 2. Login sebagai pengguna demo
  const { error } = await supabase.auth.signInWithPassword({
    email: DEMO_USER_EMAIL,
    password: DEMO_USER_PASSWORD,
  })

  if (error) {
    console.error('Gagal login sebagai pengguna demo:', error)
    // Mungkin pengguna demo belum dibuat. Arahkan ke halaman yang menjelaskan cara membuatnya.
    return NextResponse.redirect(new URL('/demo-setup-required', request.url))
  }

  // 3. Arahkan ke dasbor
  // Asumsikan dasbor kreator adalah tujuan utama
  return NextResponse.redirect(new URL('/dashboard/creator', request.url))
}