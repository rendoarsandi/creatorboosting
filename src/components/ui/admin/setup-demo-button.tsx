'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SetupDemoButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSetup = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/setup-demo', {
        method: 'POST',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyiapkan akun demo.')
      }
      setMessage(`Sukses! Email: ${data.demo_user.email}, Password: ${data.demo_user.password}`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setMessage(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-start">
      <Button onClick={handleSetup} disabled={loading}>
        {loading ? 'Menyiapkan...' : 'Setup Demo Account'}
      </Button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  )
}