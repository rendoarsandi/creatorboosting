'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

type Profile = {
  full_name: string | null
  avatar_url: string | null
  role: string | null
}

interface ProfileFormProps {
  user: User
  profile: Profile | null
}

export default function ProfileForm({ user, profile: initialProfile }: ProfileFormProps) {
  const [profile] = useState<Profile | null>(initialProfile)
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (initialProfile) {
      setFullName(initialProfile.full_name || '')
    }
  }, [initialProfile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

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
      // Refresh the page to show the updated data
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred while updating profile.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Profil tidak ditemukan.</div>
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
