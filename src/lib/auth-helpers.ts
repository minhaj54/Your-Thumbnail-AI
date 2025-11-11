import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

/**
 * Protect API routes by checking authentication
 * Returns user if authenticated, or error response if not
 */
export async function requireAuth(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Unauthorized - Authentication required' },
          { status: 401 }
        )
      }
    }

    return { user, error: null }
  } catch (error) {
    console.error('Auth check error:', error)
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Authentication check failed' },
        { status: 500 }
      )
    }
  }
}

/**
 * Check if user is authenticated (optional auth)
 * Returns user if authenticated, null if not (no error response)
 */
export async function getOptionalAuth() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Optional auth check error:', error)
    return null
  }
}

/**
 * Client-side auth guard hook
 * Use this in components to protect content based on auth status
 */
export function useRequireAuth() {
  // This can be used with useAuth hook in components
  // The actual implementation is in AuthGuard component
}

