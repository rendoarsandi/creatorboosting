"use client"

import { useState, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Rocket, Target, Sparkles } from 'lucide-react'

type UserRole = 'creator' | 'promotor' | null

interface AuthContextType {
  user: { role: UserRole; name: string } | null
  login: (role: UserRole, name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ role: UserRole; name: string } | null>(null)
  const router = useRouter()

  const login = (role: UserRole, name: string) => {
    setUser({ role, name })
    // Redirect to home page after login
    router.push('/')
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function MockLoginCard() {
  // URL ini harus diganti dengan URL aplikasi Cloudflare Access Anda
  const cloudflareAccessUrl = "https://<your-team-name>.cloudflareaccess.com/apps/<your-app-id>"

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-white/20 dark:border-slate-700/50 shadow-2xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          Login / Sign Up
        </CardTitle>
        <CardDescription className="text-lg">
          Lanjutkan dengan aman melalui Cloudflare.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <Link href={cloudflareAccessUrl}>
            <Rocket className="h-5 w-5 mr-3" />
            Lanjutkan sebagai Creator
          </Link>
        </Button>
        <Button asChild className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <Link href={cloudflareAccessUrl}>
            <Target className="h-5 w-5 mr-3" />
            Lanjutkan sebagai Promotor
          </Link>
        </Button>
        
        <div className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Anda akan diarahkan ke halaman login yang aman.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function UserProfile() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">
        {user.name} ({user.role})
      </span>
      <Button
        onClick={logout}
        variant="ghost"
        size="sm"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
