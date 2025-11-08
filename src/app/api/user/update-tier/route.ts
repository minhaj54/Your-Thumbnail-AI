import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { subscription_tier } = await request.json()

    if (!subscription_tier) {
      return NextResponse.json({ error: 'Subscription tier is required' }, { status: 400 })
    }

    const validTiers = ['free', 'basic', 'pro', 'business', 'custom']
    if (!validTiers.includes(subscription_tier)) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 })
    }

    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update subscription tier
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_tier })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription tier:', error)
      return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error('Error updating subscription tier:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription tier' },
      { status: 500 }
    )
  }
}

