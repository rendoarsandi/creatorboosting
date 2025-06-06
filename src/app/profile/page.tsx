"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/mock-auth"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Jika pengguna tidak ada setelah beberapa saat, arahkan ke halaman login
    const timer = setTimeout(() => {
      if (!user) {
        toast({ title: "Not Authenticated", description: "Please log in to view this page.", variant: "default" })
        router.push("/auth/login")
      }
    }, 500) // Beri waktu sejenak untuk memuat dari konteks

    return () => clearTimeout(timer)
  }, [user, router, toast])

  const handleLogout = () => {
    logout()
    toast({ title: "Signed Out", description: "You have been successfully logged out." })
    router.push("/auth/login")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile or redirecting...</p>
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
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" value={user.name || "Demo User"} readOnly disabled />
          </div>
          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Input id="role" type="text" value={user.role || "No role found"} readOnly disabled />
          </div>
          <Button onClick={handleLogout} className="w-full">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
