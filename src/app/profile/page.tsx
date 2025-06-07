import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default async function ProfilePage() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile?.avatar_url || ''} />
          <AvatarFallback>{profile?.full_name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{profile?.full_name || 'User'}</h1>
          <p className="text-muted-foreground">{profile?.role}</p>
        </div>
      </div>
      <ProfileForm profile={profile} />
    </div>
  )
}
