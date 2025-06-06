"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Shield, Zap, Menu, Star, CheckCircle, BarChart3, DollarSign, Target, Globe, Rocket, Award, Clock, MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth, UserProfile } from "@/components/mock-auth";
import { CreatorDashboard } from "@/components/creator-dashboard";
import { PromotorDashboard } from "@/components/promotor-dashboard";
import { useState } from "react";

function Navigation() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CreatorBoosting
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="#features" className="text-muted-foreground hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-blue-600 transition-colors">How It Works</Link>
          <Link href="/campaigns" className="text-muted-foreground hover:text-blue-600 transition-colors">Browse Campaigns</Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          ) : (
            <UserProfile />
          )}
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 space-y-2 px-4">
          <Link href="#features" className="block py-2 text-muted-foreground hover:text-blue-600">Features</Link>
          <Link href="#how-it-works" className="block py-2 text-muted-foreground hover:text-blue-600">How It Works</Link>
          <Link href="/campaigns" className="block py-2 text-muted-foreground hover:text-blue-600">Browse Campaigns</Link>
          {!user ? (
            <div className="space-y-2 pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          ) : (
            <div className="pt-4">
              <UserProfile />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background with patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1)_0%,transparent_50%)]" />
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-pulse delay-2000" />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="space-y-8">
            {/* Stats bar */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 dark:border-slate-700/50">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">10,000+</span>
                    <span className="text-muted-foreground">Creators</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">50,000+</span>
                    <span className="text-muted-foreground">Campaigns</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold">$2M+</span>
                    <span className="text-muted-foreground">Paid Out</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Connect <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Creators</span> with <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Promotors</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Platform pemasaran digital yang menghubungkan kreator dengan promotor untuk kampanye yang efektif. 
                Dapatkan hasil maksimal dengan sistem pelacakan dan pembayaran otomatis.
              </p>
              
              {/* Trust indicators */}
              <div className="flex justify-center items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Verified Creators</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link href="/auth/signup?role=creator">
                  <Rocket className="mr-2 h-5 w-5" />
                  Mulai sebagai Kreator <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm" asChild>
                <Link href="/auth/signup?role=promotor">
                  <Target className="mr-2 h-5 w-5" />
                  Bergabung sebagai Promotor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Fitur Unggulan Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Solusi lengkap untuk mengelola kampanye pemasaran digital dengan teknologi terdepan
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
              <CardHeader>
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Manajemen Kampanye</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Buat dan kelola kampanye pemasaran dengan mudah. Set budget, target, dan pantau performa real-time.
                </CardDescription>
                <div className="mt-4 flex justify-center space-x-4 text-sm text-muted-foreground">
                  <span>• Real-time Analytics</span>
                  <span>• Budget Control</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 dark:hover:border-green-800 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
              <CardHeader>
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Pelacakan Link</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Sistem pelacakan link unik untuk setiap promotor dengan analitik mendalam dan deteksi fraud.
                </CardDescription>
                <div className="mt-4 flex justify-center space-x-4 text-sm text-muted-foreground">
                  <span>• Unique Links</span>
                  <span>• Fraud Detection</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
              <CardHeader>
                <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Keamanan Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Sistem deteksi bot dan fraud untuk memastikan kualitas traffic dan melindungi investasi Anda.
                </CardDescription>
                <div className="mt-4 flex justify-center space-x-4 text-sm text-muted-foreground">
                  <span>• Bot Detection</span>
                  <span>• Secure Payments</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200 dark:hover:border-orange-800 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
              <CardHeader>
                <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Pembayaran Otomatis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Sistem pembayaran otomatis untuk promotor berdasarkan performa dengan berbagai metode payout.
                </CardDescription>
                <div className="mt-4 flex justify-center space-x-4 text-sm text-muted-foreground">
                  <span>• Auto Payout</span>
                  <span>• Multi Methods</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
                <h3 className="text-lg font-semibold">Global Reach</h3>
              </div>
              <p className="text-muted-foreground">Jangkauan global dengan dukungan multi-bahasa dan mata uang.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
                <h3 className="text-lg font-semibold">Quality Assurance</h3>
              </div>
              <p className="text-muted-foreground">Sistem verifikasi dan rating untuk menjamin kualitas creator dan promotor.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <h3 className="text-lg font-semibold">24/7 Support</h3>
              </div>
              <p className="text-muted-foreground">Tim support yang siap membantu Anda kapan saja dengan response time cepat.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Cara Kerja Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proses yang sederhana dan efisien untuk memulai kolaborasi yang menguntungkan
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Creators */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600">Untuk Kreator</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">1</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Buat Kampanye</h4>
                    <p className="text-muted-foreground">Daftarkan produk/layanan Anda dengan detail lengkap dan set budget.</p>
                    <div className="mt-2 text-sm text-blue-600">• Setup mudah • Target audience • Budget fleksibel</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">2</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Terima Aplikasi</h4>
                    <p className="text-muted-foreground">Review dan approve promotor yang ingin bergabung dengan kampanye Anda.</p>
                    <div className="mt-2 text-sm text-blue-600">• Profil lengkap • Rating system • Portfolio review</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">3</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Pantau Performa</h4>
                    <p className="text-muted-foreground">Lihat analytics real-time dan kelola pembayaran promotor.</p>
                    <div className="mt-2 text-sm text-blue-600">• Real-time data • Auto payments • ROI tracking</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* For Promotors */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-purple-600">Untuk Promotor</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">1</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Cari Kampanye</h4>
                    <p className="text-muted-foreground">Browse kampanye yang tersedia dan pilih yang sesuai dengan niche Anda.</p>
                    <div className="mt-2 text-sm text-purple-600">• Filter by niche • Commission rates • Campaign details</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">2</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Mulai Promosi</h4>
                    <p className="text-muted-foreground">Dapatkan link tracking unik dan mulai promosikan di platform Anda.</p>
                    <div className="mt-2 text-sm text-purple-600">• Unique tracking • Marketing materials • Performance tools</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">3</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Dapatkan Komisi</h4>
                    <p className="text-muted-foreground">Terima pembayaran otomatis berdasarkan performa promosi Anda.</p>
                    <div className="mt-2 text-sm text-purple-600">• Auto payouts • Multiple methods • Instant notifications</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Platform Terpercaya dengan Hasil Nyata
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan creator dan promotor yang telah merasakan kesuksesan
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-300">
                <Users className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-lg opacity-90">Active Creators</div>
                <div className="text-sm opacity-70 mt-2">Verified professionals</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-300">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-200" />
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-lg opacity-90">Campaigns Launched</div>
                <div className="text-sm opacity-70 mt-2">Successful collaborations</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-300">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-yellow-200" />
                <div className="text-4xl font-bold mb-2">$2M+</div>
                <div className="text-lg opacity-90">Total Payouts</div>
                <div className="text-sm opacity-70 mt-2">Paid to promotors</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-300">
                <Star className="h-12 w-12 mx-auto mb-4 text-purple-200" />
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-lg opacity-90">User Rating</div>
                <div className="text-sm opacity-70 mt-2">Based on 5000+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Apa Kata Mereka?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dengarkan pengalaman nyata dari creator dan promotor yang telah bergabung
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <h4 className="font-semibold">Ahmad Rizki</h4>
                  <p className="text-sm text-muted-foreground">Content Creator</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">
                &ldquo;Platform ini benar-benar mengubah cara saya mengelola kampanye. ROI meningkat 300% dalam 3 bulan!&rdquo;
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <h4 className="font-semibold">Sari Indah</h4>
                  <p className="text-sm text-muted-foreground">Digital Promotor</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">
                &ldquo;Sebagai promotor, saya sangat terbantu dengan sistem tracking yang akurat dan pembayaran yang tepat waktu.&rdquo;
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  B
                </div>
                <div>
                  <h4 className="font-semibold">Budi Santoso</h4>
                  <p className="text-sm text-muted-foreground">E-commerce Owner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">
                &ldquo;Interface yang user-friendly dan fitur analytics yang lengkap. Highly recommended untuk semua bisnis!&rdquo;
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Siap Memulai Perjalanan Anda?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Bergabunglah dengan ribuan kreator dan promotor yang sudah merasakan manfaatnya. 
              Mulai hari ini dan rasakan perbedaannya!
            </p>
            
            {/* Trust indicators */}
            <div className="flex justify-center items-center space-x-8 mb-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>No Setup Fee</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Free Trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Cancel Anytime</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/auth/signup">
                  <Rocket className="mr-2 h-5 w-5" />
                  Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm" asChild>
                <Link href="/campaigns">
                  <Target className="mr-2 h-5 w-5" />
                  Lihat Kampanye
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 text-sm opacity-70">
              <p>Sudah punya akun? <Link href="/auth/login" className="underline hover:no-underline">Login di sini</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-background to-muted/30 border-t py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CreatorBoosting</span>
              </div>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Platform pemasaran digital terdepan untuk menghubungkan kreator dengan promotor. 
                Wujudkan potensi maksimal bisnis Anda dengan teknologi terdepan.
              </p>
              <div className="flex space-x-4">
                <div className="bg-blue-600 hover:bg-blue-700 transition-colors w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="bg-blue-400 hover:bg-blue-500 transition-colors w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold">t</span>
                </div>
                <div className="bg-pink-600 hover:bg-pink-700 transition-colors w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold">i</span>
                </div>
                <div className="bg-blue-800 hover:bg-blue-900 transition-colors w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Platform</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/campaigns" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Browse Campaigns</span></Link></li>
                <li><Link href="/auth/signup?role=creator" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Join as Creator</span></Link></li>
                <li><Link href="/auth/signup?role=promotor" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Join as Promotor</span></Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Pricing</span></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Resources</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/help" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Help Center</span></Link></li>
                <li><Link href="/blog" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Blog</span></Link></li>
                <li><Link href="/docs" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Documentation</span></Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Contact Us</span></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Legal</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Privacy Policy</span></Link></li>
                <li><Link href="/terms" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Terms of Service</span></Link></li>
                <li><Link href="/security" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Security</span></Link></li>
                <li><Link href="/cookies" className="hover:text-blue-600 transition-colors flex items-center space-x-2"><ArrowRight className="h-4 w-4" /><span>Cookie Policy</span></Link></li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter signup */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">Dapatkan tips, update fitur, dan insight terbaru langsung ke email Anda</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Button className="px-6 py-3">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p>&copy; 2024 CreatorBoosting. All rights reserved.</p>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>SSL Secured</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span>Made with ❤️ in Indonesia</span>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Available Worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MainApp() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {user.role === 'creator' ? <CreatorDashboard /> : <PromotorDashboard />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <LandingPage />
    </div>
  );
}

export default function Home() {
  return <MainApp />;
}
