'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to sign-in with return URL
      const signInUrl = `/auth/signin?redirectTo=${encodeURIComponent(pathname)}`
      router.push(signInUrl)
    }
  }, [user, loading, router, pathname])

  // Show loading state while checking auth
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Don't render children if not authenticated
  if (!user) {
    return null
  }

  // Render children if authenticated
  return <>{children}</>
}

