import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Jika pengguna tidak login dan mencoba mengakses rute yang dilindungi
  if (!user && (request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika pengguna sudah login dan mencoba mengakses halaman login/register
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path permintaan kecuali untuk yang dimulai dengan:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico (file favicon)
     * Ini untuk menghindari menjalankan middleware pada aset yang tidak perlu.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}