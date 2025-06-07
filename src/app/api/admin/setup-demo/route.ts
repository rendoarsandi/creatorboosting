import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createClient as createAdminClient } from '@supabase/supabase-js'

// Gunakan Supabase Admin Client untuk membuat pengguna, karena ini memerlukan hak akses service_role
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  // 1. Verifikasi bahwa pengguna yang membuat permintaan adalah admin
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  // 2. Buat pengguna demo di auth.users
  const demoEmail = `demo-${Date.now()}@example.com`
  const demoPassword = 'password123'
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: demoEmail,
    password: demoPassword,
    email_confirm: true,
    user_metadata: {
      full_name: 'Demo User',
      avatar_url: `https://i.pravatar.cc/150?u=${demoEmail}`
    }
  })

  if (authError) {
    return NextResponse.json({ error: `Gagal membuat pengguna demo: ${authError.message}` }, { status: 500 })
  }
  const demoUserId = authData.user.id

  // Pemicu seharusnya sudah membuat profil dan dompet, sekarang kita update perannya
  await supabaseAdmin.from('profiles').update({ role: 'creator' }).eq('id', demoUserId)

  // 3. Masukkan produk demo
  const { data: products } = await supabaseAdmin.from('products').insert([
    { creator_id: demoUserId, name: 'Ikon Set Neo-Brutalist', description: 'Koleksi 100+ ikon vektor yang tajam dan modern.', price: 25.00, image_url: '/demo/product1.png' },
    { creator_id: demoUserId, name: 'UI Kit Dasbor SaaS', description: 'Template Figma lengkap untuk membangun aplikasi SaaS Anda.', price: 79.00, image_url: '/demo/product2.png' },
    { creator_id: demoUserId, name: 'Template Presentasi Minimalis', description: 'Template Keynote & PowerPoint yang bersih dan profesional.', price: 35.00, image_url: '/demo/product3.png' }
  ]).select('id, name')

  if (!products) {
    return NextResponse.json({ error: 'Gagal membuat produk demo' }, { status: 500 })
  }

  const productMap = new Map(products.map((p: { name: string, id: string }) => [p.name, p.id]))

  // 4. Masukkan data penjualan mock
  const salesData = []
  for (let i = 1; i <= 30; i++) {
    if (Math.random() > 0.5) salesData.push({ product_id: productMap.get('Ikon Set Neo-Brutalist'), sale_date: new Date(Date.now() - i * 86400000), amount: 25.00 })
    if (Math.random() > 0.3) salesData.push({ product_id: productMap.get('UI Kit Dasbor SaaS'), sale_date: new Date(Date.now() - i * 86400000), amount: 79.00 })
    if (Math.random() > 0.6) salesData.push({ product_id: productMap.get('Template Presentasi Minimalis'), sale_date: new Date(Date.now() - i * 86400000), amount: 35.00 })
  }
  await supabaseAdmin.from('sales').insert(salesData)

  // 5. Masukkan ulasan mock
  await supabaseAdmin.from('reviews').insert([
    { product_id: productMap.get('UI Kit Dasbor SaaS'), reviewer_name: 'Jane Doe', rating: 5, comment: 'UI kit ini menghemat waktu pengembangan saya selama berminggu-minggu. Sangat direkomendasikan!' },
    { product_id: productMap.get('Ikon Set Neo-Brutalist'), reviewer_name: 'John Smith', rating: 4, comment: 'Ikon yang bagus, gayanya sangat unik. Berharap ada lebih banyak variasi.' },
    { product_id: productMap.get('UI Kit Dasbor SaaS'), reviewer_name: 'Alex Ray', rating: 5, comment: 'Kualitas terbaik. Setiap komponen dipikirkan dengan matang.' }
  ])

  // 6. Simpan kredensial demo di app_meta
  await supabaseAdmin.from('app_meta').upsert({
    key: 'demo_credentials',
    value: { email: demoEmail, password: demoPassword }
  })

  return NextResponse.json({ message: 'Akun demo dan data mock berhasil dibuat.', demo_user: { email: demoEmail, password: demoPassword } })
}