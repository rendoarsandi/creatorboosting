import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'

export default async function ProfilePage() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`full_name, avatar_url, role`)
    .eq('id', session.user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    // Handle the error appropriately
  }

  return <ProfileForm user={session.user} profile={profile} />
}
