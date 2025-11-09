import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

const SYNC_EVENTS = new Set(['SIGNED_IN', 'SIGNED_UP', 'TOKEN_REFRESHED'])

export async function POST(request: NextRequest) {
  const supabase = createServerSupabase()

  try {
    const { event, session } = await request.json()

    if (!event) {
      return NextResponse.json({ success: false, error: 'Missing auth event' }, { status: 400 })
    }

    if (SYNC_EVENTS.has(event) && session) {
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })
    }

    if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      await supabase.auth.signOut()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}


