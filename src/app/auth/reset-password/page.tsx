'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true)
      }
    })

    // Check if we're already in recovery mode
    const checkRecoveryMode = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsRecoveryMode(true)
      }
    }

    checkRecoveryMode()

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validation
    if (!password) {
      setError('Password is required')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message || 'Failed to update password. Please try again.')
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setIsLoading(false)

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push('/auth/signin')
      }, 2000)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  if (!isRecoveryMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full animate-scale-in">
          <div className="card p-8 sm:p-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Reset Password
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Waiting for password reset link...
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Please click the password reset link from your email to continue.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link 
                href="/auth/signin" 
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full animate-scale-in">
        <div className="card p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Set New Password
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your new password below
              </p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-md p-4 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">
                    Password updated successfully!
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Redirecting to sign in...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-md p-4 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* New Password Field */}
                <div>
                  <label htmlFor="password" className="label block mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError('')
                      }}
                      className="input pl-12 pr-12 focus:bg-white"
                      placeholder="Enter your new password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 6 characters
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="label block mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setError('')
                      }}
                      className="input pl-12 pr-12 focus:bg-white"
                      placeholder="Confirm your new password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating password...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Back to Sign In Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Remembered your password?{' '}
              <Link 
                href="/auth/signin" 
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

