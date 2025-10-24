import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/generate', '/dashboard', '/pricing']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    const supabase = createServerSupabase()
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Redirect to signin if not authenticated
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(signInUrl)
      }
    } catch (error) {
      console.error('Auth middleware error:', error)
      const signInUrl = new URL('/auth/signin', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
