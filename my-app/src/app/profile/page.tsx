"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          toast({ title: "Error fetching session", description: error.message, variant: "destructive" })
          router.push("/auth/login")
          return
        }
        if (session?.user) {
          setUser(session.user)
        } else {
          toast({ title: "Not Authenticated", description: "Please log in to view this page.", variant: "default" })
          router.push("/auth/login")
        }
      } catch (e: unknown) {
        toast({ title: "Unexpected Error", description: e instanceof Error ? e.message : "An unexpected error occurred.", variant: "destructive" })
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [router, toast])

  const handleLogout = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({ title: "Error Signing Out", description: error.message, variant: "destructive" })
      } else {
        toast({ title: "Signed Out", description: "You have been successfully logged out." })
        setUser(null)
        router.push("/auth/login")
        router.refresh()
      }
    } catch (e: unknown) {
       toast({ title: "Logout Error", description: e instanceof Error ? e.message : "An unexpected error occurred.", variant: "destructive"})
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>View your profile information below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email || "No email found"} readOnly disabled />
          </div>
          <p className="text-sm text-muted-foreground">
            User ID: {user.id}
          </p>
          <Button onClick={handleLogout} className="w-full" disabled={loading}>
            {loading ? "Logging Out..." : "Log Out"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}