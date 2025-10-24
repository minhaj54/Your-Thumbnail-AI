import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { razorpay, getPlanById } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await request.json()
    
    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const plan = getPlanById(planId)
    
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.price,
      currency: plan.currency,
      receipt: `order_${Date.now()}_${session.user.id}`,
      notes: {
        user_id: session.user.id,
        plan_id: planId,
        credits: plan.credits.toString()
      }
    })

    // Store order in database
    const { error: dbError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: session.user.id,
        plan_type: planId,
        credits: plan.credits,
        amount: plan.price,
        currency: plan.currency,
        razorpay_order_id: order.id,
        status: 'pending'
      })

    if (dbError) {
      console.error('Error storing subscription:', dbError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      }
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
