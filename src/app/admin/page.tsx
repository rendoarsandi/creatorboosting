import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import UserTable from '@/components/ui/admin/user-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SetupDemoButton from '@/components/ui/admin/setup-demo-button'

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Meskipun middleware seharusnya sudah menangani ini,
  // ada baiknya untuk memiliki pemeriksaan keamanan tambahan di sisi server.
  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    // Alihkan ke halaman utama jika bukan admin
    redirect('/')
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dasbor Admin</h1>
        <nav className="flex gap-4 items-center">
          <SetupDemoButton />
          <Button variant="outline" asChild>
            <Link href="/admin">Pengguna</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/campaigns">Kampanye</Link>
          </Button>
        </nav>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold">Manajemen Pengguna</h2>
        <p className="text-muted-foreground">Lihat dan kelola semua pengguna di platform.</p>
        <UserTable />
      </div>
    </div>
  )
}