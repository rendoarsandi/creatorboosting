"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { supabase } from "@/lib/supabaseClient"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        toast({
          title: "Error Signing Up",
          description: error.message,
          variant: "destructive",
        })
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        // This can happen if email confirmation is required but the user already exists without confirming.
        // Supabase might return a user object but with an empty identities array.
        toast({
          title: "Confirmation Required",
          description: "A user with this email already exists but is not confirmed. Please check your email to confirm.",
          variant: "default",
        })
         // Optionally, redirect to login or a specific info page
        router.push("/auth/login")
      } else if (data.user) {
        toast({
          title: "Sign Up Successful!",
          description: "Please check your email to confirm your registration.",
        })
        // Redirect to login page or a page that tells them to check their email
        router.push("/auth/login")
      } else {
        // Fallback for unexpected scenarios
         toast({
          title: "Sign Up Issue",
          description: "An unexpected issue occurred during sign up. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Sign Up Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
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
