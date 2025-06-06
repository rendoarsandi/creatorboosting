'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

type Profile = {
  full_name: string | null
  avatar_url: string | null
  role: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const router = useRouter()

  const getProfile = useCallback(async (currentUser: User) => {
    try {
      setLoading(true)
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, avatar_url, role`)
        .eq('id', currentUser.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await getProfile(user)
      } else {
        router.push('/login')
      }
    }
    fetchUserAndProfile()
  }, [router, getProfile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }
      alert('Profil berhasil diperbarui!')
      // Refresh profile data
      await getProfile(user)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Memuat...</div>
  }

  if (!user || !profile) {
    return <div className="flex items-center justify-center min-h-screen">Anda harus login untuk melihat halaman ini.</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profil Saya</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
        <div className="text-center">
          <p>Email: <span className="font-mono">{user.email}</span></p>
          <p>Peran: <span className="font-semibold capitalize">{profile.role}</span></p>
        </div>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
            />
          </div>
          {/* Avatar upload can be added here in the future */}
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}