"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MockLoginCard } from "@/components/mock-auth"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-primary">CreatorBoosting</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Login Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          <MockLoginCard />
        </div>
      </div>
    </div>
  )
}
