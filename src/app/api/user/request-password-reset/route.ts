import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // TODO: Wire up Supabase password reset email.
    console.log('[Password Reset] Requested for:', email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Password Reset] Error handling request:', error)
    return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
  }
}


