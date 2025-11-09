export type CashfreeMode = 'sandbox' | 'production'

export interface CashfreeCallbacks {
  onSuccess: (data: any) => void
  onFailure: (error: any) => void
}

export interface CashfreeCheckoutOptions {
  paymentSessionId: string
  paymentLink?: string // Optional direct payment link from Cashfree
}

export function getCashfreeMode(): CashfreeMode {
  const env = (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ?? 'sandbox').trim().toLowerCase()
  return env === 'production' ? 'production' : 'sandbox'
}

export function loadCashfreeScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('cashfree-checkout-js')) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.id = 'cashfree-checkout-js'
    // Use v3 SDK as per official documentation
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true

    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Cashfree script'))

    document.body.appendChild(script)
  })
}

declare global {
  interface Window {
    Cashfree: any
  }
}

export async function openCashfreeCheckout(
  paymentSessionIdOrOptions: string | CashfreeCheckoutOptions,
  callbacks?: CashfreeCallbacks
) {
  // Handle both old string format and new options object
  const paymentSessionId = typeof paymentSessionIdOrOptions === 'string' 
    ? paymentSessionIdOrOptions 
    : paymentSessionIdOrOptions.paymentSessionId
  
  const paymentLink = typeof paymentSessionIdOrOptions === 'object' 
    ? paymentSessionIdOrOptions.paymentLink 
    : undefined
  
  console.log('[Cashfree Checkout] Starting')
  console.log('[Cashfree Checkout] Session ID:', paymentSessionId)
  console.log('[Cashfree Checkout] Payment Link:', paymentLink || 'Not provided')
  
  // PRIORITY 1: Use payment_link from Cashfree if available (most reliable)
  if (paymentLink) {
    console.log('[Cashfree Checkout] Using direct payment link from Cashfree')
    console.log('[Cashfree Checkout] Redirecting to:', paymentLink)
    window.location.href = paymentLink
    return new Promise(() => {})
  }
  
  // PRIORITY 2: Use official Cashfree SDK v3 (as per documentation)
  // Reference: https://www.cashfree.com/docs/payments/online/web/redirect
  await loadCashfreeScript()

  if (!window.Cashfree) {
    throw new Error('Cashfree SDK not available')
  }

  const sdkMode = getCashfreeMode()
  console.log('[Cashfree Checkout] Mode:', sdkMode)
  console.log('[Cashfree Checkout] Payment Session ID:', paymentSessionId)

  try {
    // Initialize Cashfree SDK v3 as per official documentation
    // https://www.cashfree.com/docs/payments/online/web/redirect
    const cashfree = window.Cashfree({ mode: sdkMode })
    
    console.log('[Cashfree Checkout] SDK initialized successfully')

    // Checkout configuration for redirect flow
    const checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirectTarget: '_self', // Opens in same tab
    }

    console.log('[Cashfree Checkout] Opening checkout with options:', checkoutOptions)

    // Call checkout method - this will redirect to Cashfree payment page
    cashfree.checkout(checkoutOptions)

    // Return a promise that never resolves (since we're redirecting away)
    return new Promise(() => {})
  } catch (error) {
    console.error('[Cashfree Checkout] Error:', error)
    throw error
  }
}

