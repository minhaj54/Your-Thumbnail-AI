import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get subscription history
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscription history:', error)
      return NextResponse.json({ error: 'Failed to fetch subscription history' }, { status: 500 })
    }

    // Format the response
    const formattedSubscriptions = subscriptions?.map(sub => ({
      id: sub.id,
      plan_type: sub.plan_type,
      credits: sub.credits,
      amount: sub.amount / 100, // Convert paise to rupees
      currency: sub.currency,
      status: sub.status,
      order_id: sub.razorpay_order_id,
      payment_id: sub.razorpay_payment_id,
      created_at: sub.created_at,
      updated_at: sub.updated_at
    })) || []

    // Get current active subscription (most recent completed one)
    const activeSubscription = formattedSubscriptions.find(sub => sub.status === 'completed')

    return NextResponse.json({
      success: true,
      data: {
        subscriptions: formattedSubscriptions,
        active_subscription: activeSubscription || null,
        total_subscriptions: formattedSubscriptions.length
      }
    })
  } catch (error) {
    console.error('Error in subscription history API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription history' },
      { status: 500 }
    )
  }
}

