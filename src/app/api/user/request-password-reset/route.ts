import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Determine the base URL for redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    
    if (!baseUrl) {
      console.error('[Password Reset] No base URL available for redirect. Please set NEXT_PUBLIC_APP_URL environment variable.')
      return NextResponse.json({ 
        error: 'Configuration error: NEXT_PUBLIC_APP_URL is not set',
        details: 'Please set NEXT_PUBLIC_APP_URL in your environment variables'
      }, { status: 500 })
    }

    const supabase = createServerSupabase()
    const redirectTo = `${baseUrl}/auth/reset-password`

    // Log for debugging (remove sensitive info in production)
    console.log('[Password Reset] Attempting to send reset email:', {
      email: email.substring(0, 3) + '***', // Partial email for logging
      redirectTo,
      baseUrl,
    })

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      console.error('[Password Reset] Supabase error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        redirectTo,
      })
      
      // In development, return more details
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ 
          error: 'Unable to send reset email',
          details: error.message,
          hint: 'Check: 1) Redirect URL is whitelisted in Supabase Dashboard > Authentication > URL Configuration, 2) Email provider is configured in Supabase Dashboard > Authentication > Email Templates'
        }, { status: 500 })
      }
      
      // In production, generic error
      return NextResponse.json({ 
        error: 'Unable to send reset email. Please try again later.' 
      }, { status: 500 })
    }

    console.log('[Password Reset] Email sent successfully')

    // Always return success to prevent email enumeration
    return NextResponse.json({ 
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions.'
    })
  } catch (error: any) {
    console.error('[Password Reset] Unexpected error:', {
      message: error?.message,
      stack: error?.stack,
    })
    return NextResponse.json({ 
      error: 'Unable to process request',
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status: 500 })
  }
}


