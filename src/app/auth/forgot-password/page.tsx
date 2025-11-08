'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch('/api/user/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Unable to send reset email')
      }

      setStatus('sent')
      setMessage('Check your inbox for reset instructions.')
    } catch (error) {
      console.error('Password reset error:', error)
      setStatus('error')
      setMessage('We could not send a reset email. Please try again or contact support.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Reset your password</h1>
          <p className="text-gray-600 mb-8">
            Enter the email address associated with your account and we will send you instructions to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full btn btn-primary"
            >
              {status === 'submitting' ? 'Sending reset link…' : 'Send reset link'}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 rounded-lg p-3 text-sm ${
                status === 'sent' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <p className="mt-6 text-sm text-gray-600">
            Remembered your password?{' '}
            <Link href="/auth/signin" className="text-primary-600 hover:text-primary-700">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


