'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { User } from '@supabase/supabase-js'

interface RegisterFormProps {
  user: User
}

export default function RegisterForm({ user }: RegisterFormProps) {
  const [fullName, setFullName] = useState(user.user_metadata.full_name || '')
  const [role, setRole] = useState('promoter')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Update user metadata
      const { data: { user: updatedUser }, error: userError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          role: role,
        }
      })

      if (userError) throw userError
      if (!updatedUser) throw new Error("User not updated")

      // 2. Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: updatedUser.id,
        full_name: fullName,
        role: role,
        avatar_url: updatedUser.user_metadata.avatar_url
      })

      if (profileError) throw profileError

      alert('Pendaftaran berhasil diselesaikan!')
      router.push('/profile')
      router.refresh()

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred during registration.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Selesaikan Pendaftaran</CardTitle>
          <CardDescription>
            Pilih peran Anda dan konfirmasi nama Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegistration} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nama Lengkap Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Saya adalah seorang...</Label>
              <Select onValueChange={setRole} defaultValue={role}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promoter">Promotor</SelectItem>
                  <SelectItem value="creator">Kreator Konten</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Selesaikan Pendaftaran'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
