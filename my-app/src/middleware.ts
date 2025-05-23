import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware' // Kita akan membuat ini

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Daftar rute publik yang tidak memerlukan autentikasi
  const publicRoutes = ['/auth/login', '/auth/signup']

  // Jika pengguna tidak login dan mencoba mengakses rute yang dilindungi
  if (!session && !publicRoutes.includes(pathname) && pathname.startsWith('/')) {
    // Izinkan akses ke halaman utama jika tidak ada sesi
    if (pathname === '/') {
      return response
    }
    // Arahkan ke halaman login untuk rute lain yang dilindungi
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname) // Opsional: tambahkan redirect setelah login
    return NextResponse.redirect(loginUrl)
  }

  // Jika pengguna sudah login dan mencoba mengakses halaman login/signup, arahkan ke profile atau halaman utama
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
