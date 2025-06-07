import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-4rem)] px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
        Amplify Your Content
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground mb-8">
        Platform marketplace yang menghubungkan kreator konten dengan promotor berbakat untuk memperluas jangkauan audiens Anda.
      </p>
      <Link href="/marketplace">
        <Button size="lg">Jelajahi Marketplace</Button>
      </Link>
    </div>
  );
}
