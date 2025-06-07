import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// PENTING: Kredensial ini harus cocok dengan pengguna yang dibuat oleh endpoint setup-demo.
export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  // 1. Ambil kredensial demo dari app_meta
  const { data: demoCredentials, error: metaError } = await supabase
    .from('app_meta')
    .select('value')
    .eq('key', 'demo_credentials')
    .single()

  if (metaError || !demoCredentials) {
    console.error('Gagal mengambil kredensial demo:', metaError)
    return NextResponse.redirect(new URL('/demo-setup-required', request.url))
  }

  const { email, password } = demoCredentials.value as { email: string, password: string }

  // 2. Logout dari sesi yang mungkin ada
  await supabase.auth.signOut()

  // 3. Login sebagai pengguna demo
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
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