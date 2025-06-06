'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Submission = {
  id: string
  submitted_url: string
  status: string
  tracked_views: number | null
  campaigns: {
    title: string | null
  } | null
}

export default function PromoterDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndSubmissions = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        fetchSubmissions(user.id)
      } else {
        window.location.href = '/login'
      }
    }
    fetchUserAndSubmissions()
  }, [])

  const fetchSubmissions = async (promoterId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          submitted_url,
          status,
          tracked_views,
          campaigns ( title )
        `)
        .eq('promoter_id', promoterId)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setSubmissions(data as Submission[])
    } catch (error: any) {
      console.error('Error fetching submissions:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Dasbor Promotor</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Submission Saya</h2>
        {loading ? (
          <p>Memuat submission...</p>
        ) : submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="p-4 border rounded-md">
                <p className="font-semibold text-lg">{submission.campaigns?.title || 'Kampanye Tanpa Judul'}</p>
                <a href={submission.submitted_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline truncate">
                  {submission.submitted_url}
                </a>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm">
                    Status: <span className="font-semibold capitalize">{submission.status}</span>
                  </p>
                  <p className="text-sm">
                    Views: <span className="font-bold">{submission.tracked_views?.toLocaleString('id-ID') || '0'}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Anda belum melakukan submission apa pun.</p>
        )}
      </div>
    </div>
  )
}