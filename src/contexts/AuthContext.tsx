'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (typeof window !== 'undefined') {
        try {
          await fetch('/api/auth/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event, session }),
          })
        } catch (callbackError) {
          console.error('Auth callback sync failed:', callbackError)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signInWithGoogle = async () => {
    // Get the current redirect URL if available
    const redirectTo = typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get('redirectTo') || '/dashboard'
      : '/dashboard'
    
    // Determine the base URL for redirect
    // Priority: 1. window.location.origin (most reliable), 2. NEXT_PUBLIC_APP_URL, 3. fallback
    let baseUrl = ''
    if (typeof window !== 'undefined') {
      // Always use window.location.origin in browser - it's the actual current URL
      baseUrl = window.location.origin
      
      // Log for debugging (remove in production if needed)
      if (process.env.NODE_ENV === 'development') {
        console.log('OAuth redirect URL:', `${baseUrl}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`)
      }
    } else {
      // Server-side fallback
      baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    }
    
    if (!baseUrl) {
      console.error('No base URL available for OAuth redirect')
      return { error: { message: 'Configuration error: No base URL available' } }
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    })
    return { error }
  }

  const resetPassword = async (email: string) => {
    // Determine the base URL for redirect
    let baseUrl = ''
    if (typeof window !== 'undefined') {
      baseUrl = window.location.origin
    } else {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    }
    
    if (!baseUrl) {
      console.error('No base URL available for password reset redirect')
      return { error: { message: 'Configuration error: No base URL available' } }
    }
    
    const redirectTo = `${baseUrl}/auth/reset-password`
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
