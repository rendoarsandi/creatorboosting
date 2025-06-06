import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const campaignSchema = z.object({
  title: z.string().min(1, 'Judul tidak boleh kosong.'),
  description: z.string().optional(),
  total_budget: z.coerce.number().positive('Budget harus angka positif.'),
  rate_per_10k_views: z.coerce.number().positive('Tarif harus angka positif.'),
  terms: z.string().optional(),
})

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'creator') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya kreator yang bisa membuat kampanye.' }, { status: 403 })
    }

    const formData = await request.formData()
    const parsed = campaignSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      total_budget: formData.get('total_budget'),
      rate_per_10k_views: formData.get('rate_per_10k_views'),
      terms: formData.get('terms'),
    })

    if (!parsed.success) {
      return NextResponse.json({ error: 'Data tidak valid.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { title, description, total_budget, rate_per_10k_views, terms } = parsed.data
    const assetFile = formData.get('assetFile') as File | null

    let uploadedAssetUrl = ''
    if (assetFile && assetFile.size > 0) {
      const fileExt = assetFile.name.split('.').pop()
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`
      const filePath = `campaign-assets/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('campaigns')
        .upload(filePath, assetFile)

      if (uploadError) {
        throw new Error(`Gagal mengunggah aset: ${uploadError.message}`)
      }

      const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(filePath)
      if (!publicUrl) {
        throw new Error('Gagal mendapatkan URL publik untuk aset.')
      }
      uploadedAssetUrl = publicUrl
    }

    // Insert into campaigns table
    const { data: campaignData, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        creator_id: session.user.id,
        title,
        description,
        total_budget,
        rate_per_10k_views,
        terms,
        status: 'draft',
      })
      .select()
      .single()

    if (campaignError) throw campaignError
    if (!campaignData) throw new Error('Gagal membuat kampanye.')

    // Insert into campaign_assets table
    if (uploadedAssetUrl) {
      const { error: assetError } = await supabase
        .from('campaign_assets')
        .insert({
          campaign_id: campaignData.id,
          asset_url: uploadedAssetUrl,
          asset_type: assetFile?.type || 'file',
        })
      if (assetError) throw assetError
    }

    return NextResponse.json(campaignData, { status: 201 })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
