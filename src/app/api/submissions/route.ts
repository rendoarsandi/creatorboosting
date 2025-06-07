import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const submissionSchema = z.object({
  campaign_id: z.string().uuid('ID kampanye tidak valid.'),
  submitted_url: z.string().url('URL yang dimasukkan tidak valid.'),
})

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

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

    if (!profile || profile.role !== 'promoter') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya promotor yang bisa membuat submission.' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = submissionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Data tidak valid.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { campaign_id, submitted_url } = parsed.data

    // Cek submission duplikat
    const { data: existingSubmission, error: checkError } = await supabase
      .from('submissions')
      .select('id')
      .eq('campaign_id', campaign_id)
      .eq('promoter_id', session.user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // Abaikan error 'no rows found'
      throw checkError
    }
    if (existingSubmission) {
      return NextResponse.json({ error: 'Anda sudah pernah submit untuk kampanye ini.' }, { status: 409 })
    }

    // Insert submission baru
    const { data: newSubmission, error: insertError } = await supabase
      .from('submissions')
      .insert({
        campaign_id,
        promoter_id: session.user.id,
        submitted_url,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json(newSubmission, { status: 201 })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
