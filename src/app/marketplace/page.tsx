import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import Image from 'next/image'

// Helper untuk mendapatkan inisial
const getInitials = (name: string) => {
  const names = name.split(' ')
  return names.map((n) => n[0]).join('').toUpperCase()
}

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  }[] | null;
  reviews: {
    rating: number;
  }[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function MarketplacePage(props: any) {
  const { searchParams } = props;
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      image_url,
      profiles ( full_name, avatar_url ),
      reviews ( rating )
    `)

  // Logika Urutkan
  const sortBy = searchParams?.sort || 'created_at'
  const ascending = sortBy === 'price_asc'
  if (sortBy === 'price_asc' || sortBy === 'price_desc') {
    query = query.order('price', { ascending })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: products, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return <p className="text-center text-red-500">Gagal memuat produk.</p>
  }
  
  if (!products) {
    return <p className="text-center">Tidak ada produk yang ditemukan.</p>
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Marketplace Aset Digital</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Temukan aset berkualitas tinggi yang dibuat oleh kreator berbakat dari seluruh dunia.
        </p>
      </header>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <h2 className="text-xl font-semibold mb-4">Filter</h2>
          {/* Placeholder untuk filter */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Kategori</h3>
              <p className="text-sm text-muted-foreground">(Segera Hadir)</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Harga</h3>
              <p className="text-sm text-muted-foreground">(Segera Hadir)</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Rating</h3>
              <p className="text-sm text-muted-foreground">(Segera Hadir)</p>
            </div>
          </div>
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex justify-end mb-4">
            {/* Placeholder untuk dropdown urutkan */}
            <p className="text-sm text-muted-foreground">Urutkan: Terbaru</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(products as Product[]).map((product) => {
              const reviews = product.reviews as { rating: number }[]
              const avgRating = reviews.length > 0
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : 'Baru'
              
              const creatorProfile = Array.isArray(product.profiles) ? product.profiles[0] : product.profiles

              return (
                <Card key={product.id} className="overflow-hidden group">
                  <Link href={`/marketplace/${product.id}`}>
                    <div className="relative w-full h-48 bg-muted">
                      <Image
                        src={product.image_url || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={creatorProfile?.avatar_url || ''} />
                          <AvatarFallback>{getInitials(creatorProfile?.full_name || 'A')}</AvatarFallback>
                        </Avatar>
                        <span>{creatorProfile?.full_name || 'Anonim'}</span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-bold">${product.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          <Star className={`h-5 w-5 ${avgRating !== 'Baru' ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                          <span className="text-sm font-medium">{avgRating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
