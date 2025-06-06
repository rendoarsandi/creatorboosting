import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export function createServer(cookieStore: ReadonlyRequestCookies) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // This is a server component, so we can't set cookies.
          // The middleware will handle setting cookies.
        },
        remove(name: string, options: CookieOptions) {
          // This is a server component, so we can't remove cookies.
          // The middleware will handle removing cookies.
        },
      },
    }
  )
}
