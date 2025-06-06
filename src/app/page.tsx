import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Shield, Zap, Menu, Star, CheckCircle, BarChart3, DollarSign, Target, Globe, Rocket, Award } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cookies } from "next/headers";
import { createServer } from "@/lib/supabase-server";

async function Navigation() {
  const cookieStore = await cookies();
  const supabase = createServer(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">
            CreatorBoosting
          </span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
          <Link href="/campaigns" className="text-muted-foreground hover:text-primary transition-colors">Campaigns</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <Button asChild>
              <Link href="/profile">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/20 shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-primary bg-primary/10 p-3 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 -z-10" />
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-200 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse animation-delay-400" />
          <div className="relative container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Amplify Your Reach. Boost Your Brand.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The ultimate platform connecting innovative creators with powerful promotors for campaigns that deliver results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow" asChild>
                <Link href="/auth/signup">
                  Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-background/50 backdrop-blur-sm" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-secondary/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Why CreatorBoosting?</h2>
              <p className="text-lg text-muted-foreground mt-4">Everything you need for successful collaborations.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Users className="h-8 w-8 text-primary" />}
                title="Seamless Campaign Management"
                description="Create, manage, and track your marketing campaigns with our intuitive dashboard."
              />
              <FeatureCard 
                icon={<BarChart3 className="h-8 w-8 text-primary" />}
                title="Advanced Link Tracking"
                description="Get unique tracking links for every promotor with in-depth analytics and fraud detection."
              />
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-primary" />}
                title="Secure & Automated Payments"
                description="Automated, performance-based payouts to promotors with multiple payout options."
              />
              <FeatureCard 
                icon={<Target className="h-8 w-8 text-primary" />}
                title="Find the Perfect Match"
                description="Browse a diverse marketplace of vetted creators and promotors to find your ideal partner."
              />
              <FeatureCard 
                icon={<Award className="h-8 w-8 text-primary" />}
                title="Quality Assurance"
                description="Our verification and rating system ensures high-quality, reliable participants."
              />
              <FeatureCard 
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="Real-Time Analytics"
                description="Monitor campaign performance with live data to make informed decisions and optimize ROI."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join thousands of creators and promotors growing their brands on CreatorBoosting.</p>
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 CreatorBoosting. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
