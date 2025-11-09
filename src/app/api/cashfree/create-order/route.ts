import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeInstance, getPlanDetails } from '@/lib/cashfree'
import { createServerSupabase } from '@/lib/supabase/server'

function toRupees(amountInPaise: number) {
  return Number((amountInPaise / 100).toFixed(2))
}

function getDefaultCustomerPhone() {
  return process.env.CASHFREE_DEFAULT_CUSTOMER_PHONE || '9999999999'
}

export async function POST(request: NextRequest) {
  try {
    const { planType, isPayAsYouGo, credits } = await request.json()

    const supabase = await createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let orderAmountPaise = 0
    let orderCredits = 0
    let notes: Record<string, string> = {}

    if (isPayAsYouGo && credits) {
      orderAmountPaise = credits * 1000
      orderCredits = credits
      notes = { type: 'pay_as_you_go', credits: credits.toString() }
    } else {
      const planDetails = getPlanDetails(planType)
      if (!planDetails) {
        return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
      }

      orderAmountPaise = planDetails.price * 100
      orderCredits = planDetails.credits
      notes = {
        type: 'subscription',
        plan: planType,
        credits: planDetails.credits.toString(),
      }
    }

    if (!orderAmountPaise || orderAmountPaise < 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 })
    }

    const cashfree = getCashfreeInstance()

    console.info('[Cashfree] Creating order', {
      mode: process.env.CASHFREE_ENVIRONMENT,
      planType,
      isPayAsYouGo,
      amount: toRupees(orderAmountPaise),
    })

    const orderId = `tai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const createOrderResponse = await cashfree.PGCreateOrder({
      order_id: orderId,
      order_amount: toRupees(orderAmountPaise),
      order_currency: 'INR',
      customer_details: {
        customer_id: user.id,
        customer_email: user.email || 'customer@example.com',
        customer_phone: getDefaultCustomerPhone(),
        customer_name: user.email?.split('@')[0] || 'Thumbnail AI User',
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.yourthumbnail.com'}/payments/cashfree-return?order_id={order_id}&cf_order_id={cf_order_id}`,
      },
      order_note: JSON.stringify(notes),
    })

    const order = createOrderResponse.data

    console.log('[Cashfree] Order creation response:', {
      hasOrder: !!order,
      hasPaymentSessionId: !!order?.payment_session_id,
      hasPaymentLink: !!order?.payment_link,
      paymentSessionIdPrefix: order?.payment_session_id?.substring(0, 20),
      paymentLink: order?.payment_link,
      orderId: order?.order_id,
      cfOrderId: order?.cf_order_id,
      fullResponse: JSON.stringify(order).substring(0, 500),
    })

    if (!order || !order.payment_session_id) {
      console.error('[Cashfree] Order creation failed - missing payment_session_id', {
        order,
        response: createOrderResponse,
      })
      return NextResponse.json(
        {
          error: 'Failed to create Cashfree order',
          details: 'payment_session_id not returned from Cashfree API',
          debug: {
            hasOrder: !!order,
            orderKeys: order ? Object.keys(order) : [],
            environment: process.env.CASHFREE_ENVIRONMENT,
          },
        },
        { status: 502 }
      )
    }

    const subscriptionData = {
      user_id: user.id,
      plan_type: isPayAsYouGo ? 'custom' : planType,
      credits: orderCredits,
      amount: orderAmountPaise,
      currency: 'INR',
      status: 'pending',
      razorpay_order_id: order.order_id,
    }

    const { error: subError } = await supabase.from('subscriptions').insert(subscriptionData)

    if (subError) {
      console.error('Cashfree subscription insert failed:', subError)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.order_id,
        cfOrderId: order.cf_order_id,
        amount: order.order_amount,
        currency: order.order_currency,
        paymentSessionId: order.payment_session_id,
        paymentLink: order.payment_link, // Direct checkout link from Cashfree
        environment: process.env.CASHFREE_ENVIRONMENT ?? 'sandbox',
      },
    })
  } catch (error: any) {
    console.error('Error creating Cashfree order:', error)
    
    // Extract detailed error information from Cashfree API
    const errorDetails: any = {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error.constructor?.name || 'Unknown',
    }

    if (error.response) {
      errorDetails.cashfreeResponse = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      }
    }

    if (error.config) {
      errorDetails.requestConfig = {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers ? 'SET' : 'NOT_SET',
      }
    }

    console.error('[Cashfree] Detailed error:', errorDetails)

    return NextResponse.json(
      {
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: errorDetails,
        environment: {
          CASHFREE_ENVIRONMENT: process.env.CASHFREE_ENVIRONMENT || 'NOT_SET',
          CASHFREE_APP_ID: process.env.CASHFREE_APP_ID ? 'SET' : 'NOT_SET',
          CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY ? 'SET' : 'NOT_SET',
        },
      },
      { status: 500 }
    )
  }
}


