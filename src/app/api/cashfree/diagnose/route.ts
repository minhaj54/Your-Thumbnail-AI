import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeInstance } from '@/lib/cashfree'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        CASHFREE_ENVIRONMENT: process.env.CASHFREE_ENVIRONMENT || 'NOT_SET',
        NEXT_PUBLIC_CASHFREE_ENVIRONMENT: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'NOT_SET',
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT_SET',
        CASHFREE_APP_ID: process.env.CASHFREE_APP_ID ? 'SET (length: ' + process.env.CASHFREE_APP_ID.length + ')' : 'NOT_SET',
        CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY ? 'SET (length: ' + process.env.CASHFREE_SECRET_KEY.length + ')' : 'NOT_SET',
        CASHFREE_DEFAULT_CUSTOMER_PHONE: process.env.CASHFREE_DEFAULT_CUSTOMER_PHONE || 'NOT_SET',
      },
      cashfreeInstanceTest: 'NOT_TESTED',
      orderCreationTest: 'NOT_TESTED',
    }

    // Test Cashfree instance creation
    try {
      const cashfree = getCashfreeInstance()
      diagnostics.cashfreeInstanceTest = 'SUCCESS'

      // Try creating a test order
      try {
        const testOrderId = `test_diag_${Date.now()}`
        const testOrderResponse = await cashfree.PGCreateOrder({
          order_id: testOrderId,
          order_amount: 1.00,
          order_currency: 'INR',
          customer_details: {
            customer_id: 'test_user',
            customer_email: 'test@example.com',
            customer_phone: process.env.CASHFREE_DEFAULT_CUSTOMER_PHONE || '9999999999',
            customer_name: 'Test User',
          },
          order_meta: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/test-return`,
          },
          order_note: 'Diagnostic test order',
        })

        const order = testOrderResponse.data

        if (order && order.payment_session_id) {
          diagnostics.orderCreationTest = 'SUCCESS'
          diagnostics.testOrder = {
            order_id: order.order_id,
            payment_session_id: order.payment_session_id ? 'PRESENT (prefix: ' + order.payment_session_id.substring(0, 20) + '...)' : 'MISSING',
            environment_detected: order.payment_session_id?.startsWith('session_sandbox_') ? 'SANDBOX' : 
                                 order.payment_session_id?.startsWith('session_') ? 'PRODUCTION' : 'UNKNOWN',
          }
        } else {
          diagnostics.orderCreationTest = 'FAILED - No payment_session_id in response'
          diagnostics.testOrderResponse = testOrderResponse.data
        }
      } catch (orderError: any) {
        diagnostics.orderCreationTest = 'FAILED'
        diagnostics.orderError = {
          message: orderError.message || 'Unknown error',
          response: orderError.response?.data || orderError.response || 'No response data',
          status: orderError.response?.status || 'No status',
        }
      }
    } catch (instanceError: any) {
      diagnostics.cashfreeInstanceTest = 'FAILED'
      diagnostics.instanceError = instanceError.message
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Diagnostic failed',
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}

