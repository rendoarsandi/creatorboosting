import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CreatorBoosting</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-blue-600">Features</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</Link>
            <Link href="/campaigns" className="text-gray-600 hover:text-blue-600">Browse Campaigns</Link>
          </nav>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect <span className="text-blue-600">Creators</span> with <span className="text-purple-600">Promotors</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform pemasaran digital yang menghubungkan kreator dengan promotor untuk kampanye yang efektif. 
            Dapatkan hasil maksimal dengan sistem pelacakan dan pembayaran otomatis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="/auth/signup?role=creator">
                Mulai sebagai Kreator <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
              <Link href="/auth/signup?role=promotor">
                Bergabung sebagai Promotor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Fitur Unggulan Platform
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Manajemen Kampanye</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Buat dan kelola kampanye pemasaran dengan mudah. Set budget, target, dan pantau performa real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Pelacakan Link</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sistem pelacakan link unik untuk setiap promotor dengan analitik mendalam dan deteksi fraud.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Keamanan Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sistem deteksi bot dan fraud untuk memastikan kualitas traffic dan melindungi investasi Anda.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Pembayaran Otomatis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sistem pembayaran otomatis untuk promotor berdasarkan performa dengan berbagai metode payout.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Cara Kerja Platform
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Creators */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Untuk Kreator</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Buat Kampanye</h4>
                    <p className="text-gray-600">Daftarkan produk/layanan Anda dengan detail lengkap dan set budget.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Terima Aplikasi</h4>
                    <p className="text-gray-600">Review dan approve promotor yang ingin bergabung dengan kampanye Anda.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Pantau Performa</h4>
                    <p className="text-gray-600">Lihat analytics real-time dan kelola pembayaran promotor.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Promotors */}
            <div>
              <h3 className="text-2xl font-bold text-purple-600 mb-6">Untuk Promotor</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Cari Kampanye</h4>
                    <p className="text-gray-600">Browse kampanye yang tersedia dan pilih yang sesuai dengan niche Anda.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Mulai Promosi</h4>
                    <p className="text-gray-600">Dapatkan link tracking unik dan mulai promosikan di platform Anda.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Dapatkan Komisi</h4>
                    <p className="text-gray-600">Terima pembayaran otomatis berdasarkan performa promosi Anda.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Siap Memulai Perjalanan Anda?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan kreator dan promotor yang sudah merasakan manfaatnya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
              <Link href="/auth/signup">
                Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/campaigns">
                Lihat Kampanye
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6" />
                <span className="text-xl font-bold">CreatorBoosting</span>
              </div>
              <p className="text-gray-400">
                Platform pemasaran digital terdepan untuk menghubungkan kreator dengan promotor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/campaigns" className="hover:text-white">Browse Campaigns</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white">Join as Creator</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white">Join as Promotor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CreatorBoosting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
