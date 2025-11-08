import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeInstance } from '@/lib/cashfree'
import { createServerSupabase } from '@/lib/supabase/server'

function isSuccessfulPayment(payload: any) {
  const status =
    payload?.data?.payment?.payment_status ||
    payload?.data?.order?.order_status ||
    payload?.payment?.payment_status ||
    payload?.order_status

  return status === 'SUCCESS' || status === 'PAID'
}

function extractOrderId(payload: any) {
  return (
    payload?.data?.order?.order_id ||
    payload?.data?.order_id ||
    payload?.order_id ||
    payload?.data?.payment?.order_id ||
    null
  )
}

function extractPaymentId(payload: any) {
  return (
    payload?.data?.payment?.cf_payment_id || payload?.payment?.cf_payment_id || payload?.data?.cf_payment_id || null
  )
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-webhook-signature')
  const timestamp = request.headers.get('x-webhook-timestamp')

  if (!signature || !timestamp) {
    return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 })
  }

  const rawBody = await request.text()

  try {
    const cashfree = getCashfreeInstance()
    cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp)

    const payload = JSON.parse(rawBody)

    if (!isSuccessfulPayment(payload)) {
      return NextResponse.json({ received: true })
    }

    const orderId = extractOrderId(payload)
    const paymentId = extractPaymentId(payload)

    if (!orderId || !paymentId) {
      return NextResponse.json({ received: true })
    }

    const supabase = await createServerSupabase()

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single()

    if (subError || !subscription) {
      console.error('Cashfree webhook: subscription not found for order', orderId)
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    if (subscription.status === 'completed') {
      return NextResponse.json({ received: true })
    }

    const { error: updateSubError } = await supabase
      .from('subscriptions')
      .update({
        status: 'completed',
        razorpay_payment_id: paymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id)

    if (updateSubError) {
      console.error('Cashfree webhook: failed to update subscription', updateSubError)
    }

    const { error: updateUserError } = await supabase.rpc('add_user_credits', {
      user_id: subscription.user_id,
      credits_to_add: subscription.credits,
    })

    if (updateUserError) {
      console.error('Cashfree webhook: failed to add credits', updateUserError)
    }

    if (subscription.plan_type !== 'custom') {
      const { error: updateTierError } = await supabase
        .from('users')
        .update({ subscription_tier: subscription.plan_type })
        .eq('id', subscription.user_id)

      if (updateTierError) {
        console.error('Cashfree webhook: failed to update subscription tier', updateTierError)
      }
    }

    const { error: paymentError } = await supabase.from('payments').insert({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      amount: subscription.amount,
      currency: subscription.currency,
      razorpay_payment_id: paymentId,
      status: 'completed',
    })

    if (paymentError) {
      console.error('Cashfree webhook: failed to insert payment record', paymentError)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Cashfree webhook processing failed:', error)
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
  }
}


