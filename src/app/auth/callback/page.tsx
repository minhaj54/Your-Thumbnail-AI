'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')
      
      // Check for OAuth errors from provider
      if (errorParam) {
        setError('Authentication failed. Please try again.')
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
        return
      }
      
      // First, check if we already have a session (Supabase might have set it via cookies)
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession()
        
        if (existingSession) {
          // Session already exists, redirect immediately
          const redirectTo = searchParams.get('redirectTo') || '/dashboard'
          window.location.href = redirectTo
          return
        }
      } catch (sessionError) {
        console.error('Error checking session:', sessionError)
        // Continue to try code exchange
      }
      
      if (code) {
        try {
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError)
            
            // Check if it's a network/DNS error
            if (exchangeError.message?.includes('ENOTFOUND') || exchangeError.message?.includes('fetch failed')) {
              setError('Cannot connect to authentication server. Please check your internet connection and Supabase configuration.')
            } else {
              setError('Failed to complete sign in. Please try again.')
            }
            
            setTimeout(() => {
              router.push('/auth/signin')
            }, 3000)
          } else if (data.session) {
            // Successfully exchanged code for session
            const redirectTo = searchParams.get('redirectTo') || '/dashboard'
            // Small delay to ensure session is fully set
            setTimeout(() => {
              window.location.href = redirectTo
            }, 500)
          } else {
            // No session returned, but no error - wait a bit and check again
            setTimeout(async () => {
              const { data: { session } } = await supabase.auth.getSession()
              if (session) {
                const redirectTo = searchParams.get('redirectTo') || '/dashboard'
                window.location.href = redirectTo
              } else {
                setError('Session not found. Please try signing in again.')
                setTimeout(() => {
                  router.push('/auth/signin')
                }, 3000)
              }
            }, 1000)
          }
        } catch (err: any) {
          console.error('Unexpected error during callback:', err)
          
          // Check for network/DNS errors
          if (err?.cause?.code === 'ENOTFOUND' || err?.message?.includes('fetch failed')) {
            setError('Cannot connect to authentication server. Please verify your Supabase URL is correct in your environment variables.')
          } else {
            setError('An unexpected error occurred. Please try again.')
          }
          
          setTimeout(() => {
            router.push('/auth/signin')
          }, 3000)
        }
      } else {
        // No code parameter, check if we have a session anyway
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const redirectTo = searchParams.get('redirectTo') || '/dashboard'
            window.location.href = redirectTo
          } else {
            router.push('/auth/signin')
          }
        } catch {
          router.push('/auth/signin')
        }
      }
    }

    handleCallback()
  }, [router, searchParams])

  // Verify Supabase URL is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasConfigError = !supabaseUrl || supabaseUrl.includes('REDACTED')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        {hasConfigError ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-md p-4 max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">Configuration Error</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Supabase URL is not configured. Please check your .env.local file.
                </p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-md p-4 max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-xs text-red-600 mt-1">Redirecting to sign in...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-blue-700">Completing sign in...</span>
          </div>
        )}
      </div>
    </div>
  )
}

