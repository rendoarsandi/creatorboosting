"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Turnstile } from "@marsidev/react-turnstile"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
// import { supabase } from "@/lib/supabaseClient"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!turnstileToken) {
      toast({
        title: "Verification Failed",
        description: "Please complete the verification challenge.",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    
    // TODO: 1. Verify Turnstile token on backend worker
    // TODO: 2. Potentially create a user record in D1 if needed before redirect
    
    toast({
      title: "Redirecting to Login...",
      description: "You will be redirected to the secure login page.",
    })

    // In a real app, this would be the Cloudflare Access URL for your application
    const cloudflareAccessUrl = "https://<your-team-name>.cloudflareaccess.com/apps/<your-app-id>"
    
    // For now, we'll just simulate the redirect to the mock login page
    // window.location.href = cloudflareAccessUrl;
    router.push('/auth/login');

    // setLoading(false) // This line might not be reached if redirection is fast
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Enter your email and password to sign up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-center">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onSuccess={setTurnstileToken}
                  options={{
                    theme: "light", // or 'dark'
                  }}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !turnstileToken}>
                {loading ? "Processing..." : "Sign Up / Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Button variant="link" onClick={() => router.push("/auth/login")} disabled={loading}>
              Log In
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
