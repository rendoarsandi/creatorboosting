import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RegisterForm from './register-form'

export default async function RegisterPage() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Periksa apakah profil sudah ada, jika ya, alihkan ke profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', session.user.id)
    .single()

  if (profile) {
    redirect('/profile')
  }

  return <RegisterForm user={session.user} />
}
