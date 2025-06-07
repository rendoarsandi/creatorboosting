import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  // 1. Dapatkan sesi pengguna yang membuat permintaan
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // 2. Verifikasi bahwa pengguna adalah admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  // 3. Jika admin, ambil semua profil pengguna
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, full_name, username, role, created_at')
    .order('created_at', { ascending: false })

  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 })
  }

  return NextResponse.json(users)
}