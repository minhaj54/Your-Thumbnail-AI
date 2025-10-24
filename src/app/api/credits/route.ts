import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getUserCredits, deductCredits, addCredits } from '@/lib/credits'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userCredits = await getUserCredits(session.user.id)
    
    if (!userCredits) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      credits: userCredits.credits,
      subscription_tier: userCredits.subscription_tier
    })
  } catch (error) {
    console.error('Error fetching credits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, credits } = await request.json()
    
    if (action === 'deduct') {
      const success = await deductCredits(session.user.id, credits || 1)
      
      if (!success) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
      }
      
      return NextResponse.json({ success: true })
    }
    
    if (action === 'add') {
      const success = await addCredits(session.user.id, credits)
      
      if (!success) {
        return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
      }
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating credits:', error)
    return NextResponse.json(
      { error: 'Failed to update credits' },
      { status: 500 }
    )
  }
}
