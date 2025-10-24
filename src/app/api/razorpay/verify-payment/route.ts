import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { razorpay } from '@/lib/razorpay'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Get subscription details
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', session.user.id)
      .single()

    if (subError || !subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    // Update subscription status
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'completed',
        razorpay_payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    // Add credits to user account
    const { error: creditsError } = await supabase
      .from('users')
      .update({
        credits: supabase.raw('credits + ?', [subscription.credits]),
        subscription_tier: subscription.plan_type
      })
      .eq('id', session.user.id)

    if (creditsError) {
      console.error('Error adding credits:', creditsError)
      return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: session.user.id,
        subscription_id: subscription.id,
        amount: subscription.amount,
        currency: subscription.currency,
        razorpay_payment_id: razorpay_payment_id,
        status: 'completed'
      })

    if (paymentError) {
      console.error('Error creating payment record:', paymentError)
      // Don't fail the request as credits were already added
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      credits_added: subscription.credits
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
