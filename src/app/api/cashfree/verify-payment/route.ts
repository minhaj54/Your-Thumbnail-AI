import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeInstance } from '@/lib/cashfree'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 })
    }

    const supabase = await createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cashfree = getCashfreeInstance()

    const orderResponse = await cashfree.PGFetchOrder(orderId)
    const order = orderResponse.data

    console.log('[Cashfree Verify] Order status:', order?.order_status)

    if (!order) {
      return NextResponse.json({ 
        success: false,
        status: 'FAILED',
        message: 'Order not found' 
      }, { status: 400 })
    }

    if (order.order_status !== 'PAID') {
      return NextResponse.json({ 
        success: false,
        status: order.order_status || 'PENDING',
        message: `Payment is ${order.order_status || 'pending'}. Please wait or try again.` 
      }, { status: 400 })
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    if (subscription.status === 'completed') {
      return NextResponse.json({ 
        success: true,
        status: 'SUCCESS',
        message: 'Payment already verified',
        credits: subscription.credits 
      }, { status: 200 })
    }

    const paymentsResponse = await cashfree.PGOrderFetchPayments(orderId)
    const payments = paymentsResponse.data
    const successfulPayment = payments?.find((payment: any) => payment.payment_status === 'SUCCESS')

    if (!successfulPayment) {
      return NextResponse.json({ error: 'Unable to confirm successful payment' }, { status: 400 })
    }

    const { error: updateSubError } = await supabase
      .from('subscriptions')
      .update({
        status: 'completed',
        razorpay_payment_id: successfulPayment.cf_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id)

    if (updateSubError) {
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    const { error: updateUserError } = await supabase.rpc('add_user_credits', {
      user_id: user.id,
      credits_to_add: subscription.credits,
    })

    if (updateUserError) {
      console.error('Error adding credits:', updateUserError)
    }

    if (subscription.plan_type !== 'custom') {
      const { error: updateTierError } = await supabase
        .from('users')
        .update({ subscription_tier: subscription.plan_type })
        .eq('id', user.id)

      if (updateTierError) {
        console.error('Error updating subscription tier:', updateTierError)
      }
    }

    const { error: paymentError } = await supabase.from('payments').insert({
      user_id: user.id,
      subscription_id: subscription.id,
      amount: subscription.amount,
      currency: subscription.currency,
      razorpay_payment_id: successfulPayment.cf_payment_id,
      status: 'completed',
    })

    if (paymentError) {
      console.error('Error inserting payment record:', paymentError)
    }

    return NextResponse.json({
      success: true,
      status: 'SUCCESS',
      message: 'Payment verified successfully',
      credits: subscription.credits,
    })
  } catch (error) {
    console.error('Error verifying Cashfree payment:', error)
    return NextResponse.json({ 
      success: false,
      status: 'FAILED',
      message: 'Failed to verify payment. Please contact support.' 
    }, { status: 500 })
  }
}


