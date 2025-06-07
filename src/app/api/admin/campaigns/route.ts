import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  // 1. Verifikasi bahwa pengguna adalah admin (logika yang sama seperti di users route)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  // 2. Jika admin, ambil semua kampanye beserta nama kreatornya
  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select(`
      id,
      title,
      status,
      budget,
      target_clicks,
      created_at,
      profiles ( full_name )
    `)
    .order('created_at', { ascending: false })

  if (campaignsError) {
    return NextResponse.json({ error: campaignsError.message }, { status: 500 })
  }

  return NextResponse.json(campaigns)
}