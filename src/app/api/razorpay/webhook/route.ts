import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = createServerSupabase()

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload, supabase)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload, supabase)
        break
      
      case 'order.paid':
        await handleOrderPaid(event.payload, supabase)
        break
      
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payload: any, supabase: any) {
  const { payment } = payload
  
  // Update payment status
  await supabase
    .from('payments')
    .update({ status: 'completed' })
    .eq('razorpay_payment_id', payment.id)
}

async function handlePaymentFailed(payload: any, supabase: any) {
  const { payment } = payload
  
  // Update payment status
  await supabase
    .from('payments')
    .update({ status: 'failed' })
    .eq('razorpay_payment_id', payment.id)
  
  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({ status: 'failed' })
    .eq('razorpay_order_id', payment.order_id)
}

async function handleOrderPaid(payload: any, supabase: any) {
  const { order } = payload
  
  // Get subscription details
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('razorpay_order_id', order.id)
    .single()

  if (subscription) {
    // Add credits to user
    await supabase
      .from('users')
      .update({
        credits: supabase.raw('credits + ?', [subscription.credits]),
        subscription_tier: subscription.plan_type
      })
      .eq('id', subscription.user_id)
  }
}
