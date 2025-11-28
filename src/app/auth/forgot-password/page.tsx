'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const { resetPassword } = useAuth()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      // Try API route first
      const response = await fetch('/api/user/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If API route fails, try client-side as fallback
        console.log('[Password Reset] API route failed, trying client-side method...')
        const { error } = await resetPassword(email)
        
        if (error) {
          const errorMsg = data.error || error.message || 'Unable to send reset email'
          const details = data.details ? ` ${data.details}` : ''
          const hint = data.hint ? `\n\n${data.hint}` : ''
          throw new Error(errorMsg + details + hint)
        }
        
        // Client-side method succeeded
        setStatus('sent')
        setMessage('If an account exists with this email, you will receive password reset instructions.')
        return
      }

      setStatus('sent')
      setMessage(data.message || 'If an account exists with this email, you will receive password reset instructions.')
    } catch (error) {
      console.error('Password reset error:', error)
      setStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'We could not send a reset email. Please try again or contact support.'
      setMessage(errorMessage)
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
              disabled={status === 'submitting' || status === 'sent'}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending reset link...
                </>
              ) : status === 'sent' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Sent
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Send reset link
                </>
              )}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 rounded-lg p-4 text-sm animate-fade-in ${
                status === 'sent' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {status === 'sent' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  {status === 'sent' ? (
                    <>
                      <p className="font-semibold text-green-900">Email sent successfully!</p>
                      <p className="mt-1 text-green-700">{message}</p>
                    </>
                  ) : (
                    <p>{message}</p>
                  )}
                </div>
              </div>
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


