import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get payment history with subscription details
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        currency,
        razorpay_payment_id,
        status,
        created_at,
        subscription:subscription_id (
          plan_type,
          credits
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payment history:', error)
      return NextResponse.json({ error: 'Failed to fetch payment history' }, { status: 500 })
    }

    // Format the response
    const formattedPayments = payments?.map((payment: any) => ({
      id: payment.id,
      amount: payment.amount / 100, // Convert paise to rupees
      currency: payment.currency,
      payment_id: payment.razorpay_payment_id,
      status: payment.status,
      plan_type: payment.subscription?.plan_type || 'N/A',
      credits: payment.subscription?.credits || 0,
      created_at: payment.created_at
    })) || []

    return NextResponse.json({
      success: true,
      data: formattedPayments
    })
  } catch (error) {
    console.error('Error in payment history API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    )
  }
}

