import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'

import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  // const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      },
    )
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && session) {
      // Cek apakah profil sudah ada
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()

      // Abaikan error "no rows" karena itu berarti profil belum ada
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking for profile:', profileError)
        // Arahkan ke halaman error jika ada masalah lain
        return NextResponse.redirect(`${origin}/login?error=Database-check-failed`)
      }

      // Jika profil sudah ada, arahkan ke dasbor
      if (profile) {
        return NextResponse.redirect(`${origin}/dashboard/creator`) // atau /dashboard/promoter
      } else {
        // Jika tidak ada profil, pengguna baru via OAuth. Arahkan ke registrasi untuk memilih peran.
        return NextResponse.redirect(`${origin}/register`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
