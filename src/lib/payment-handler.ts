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
    script.src =
      getCashfreeMode() === 'production'
        ? 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js'
        : 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js'
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
  
  // PRIORITY 2: Use manual redirect with constructed URL
  const useManualRedirect = true // Set to false to try SDK approach
  
  if (useManualRedirect) {
    console.log('[Cashfree Checkout] Using manual redirect approach')
    const sdkMode = getCashfreeMode()
    
    // Cashfree checkout URL - using the payment page endpoint with session_id as query param
    // This is the most reliable format that works consistently
    const checkoutUrl = sdkMode === 'production' 
      ? `https://payments.cashfree.com/order?payment_session_id=${paymentSessionId}`
      : `https://sandbox.cashfree.com/order?payment_session_id=${paymentSessionId}`
    
    console.log('[Cashfree Checkout] Mode:', sdkMode)
    console.log('[Cashfree Checkout] Session ID:', paymentSessionId)
    console.log('[Cashfree Checkout] Constructed URL:', checkoutUrl)
    
    // Use window.location for full page redirect
    window.location.href = checkoutUrl
    
    // Return a promise that never resolves (since we're redirecting away)
    return new Promise(() => {})
  }
  
  // Original SDK approach below (if useManualRedirect is false)
  await loadCashfreeScript()

  if (!window.Cashfree) {
    throw new Error('Cashfree SDK not available')
  }

  const sdkMode = getCashfreeMode()
  console.log('[Cashfree Checkout] Mode:', sdkMode)

  let instance: any
  const initializer: any = window.Cashfree

  try {
    instance = initializer({ mode: sdkMode })
    console.log('[Cashfree Checkout] Instance created (method 1)')
  } catch (err) {
    try {
      instance = new initializer({ mode: sdkMode })
      console.log('[Cashfree Checkout] Instance created (method 2)')
    } catch (innerErr) {
      console.error('[Cashfree Checkout] Failed to create instance:', innerErr)
      throw innerErr
    }
  }

  if (instance && typeof instance.then === 'function') {
    instance = await instance
    console.log('[Cashfree Checkout] Instance resolved from promise')
  }

  if (!instance) {
    throw new Error('Cashfree checkout instance could not be initialized')
  }
  
  console.log('[Cashfree Checkout] Available methods:', Object.keys(instance))

  let launch: ((config: any, callbacks?: any) => any) | null = null
  let launchType: 'redirect' | 'checkout' | 'doPayment' | 'makePayment' | 'drop' | 'elements' | null = null

  if (typeof instance.redirect === 'function') {
    launch = instance.redirect.bind(instance)
    launchType = 'redirect'
  } else if (typeof instance.checkout === 'function') {
    launch = instance.checkout.bind(instance)
    launchType = 'checkout'
  } else if (typeof instance.doPayment === 'function') {
    launch = instance.doPayment.bind(instance)
    launchType = 'doPayment'
  } else if (typeof instance.makePayment === 'function') {
    launch = instance.makePayment.bind(instance)
    launchType = 'makePayment'
  } else if (typeof instance.redirect === 'function') {
    launch = instance.redirect.bind(instance)
    launchType = 'redirect'
  } else if (typeof instance.drop === 'function') {
    launch = instance.drop.bind(instance)
    launchType = 'drop'
  } else if (typeof instance.elements === 'function') {
    launch = instance.elements.bind(instance)
    launchType = 'elements'
  }

  if (!launch) {
    console.error('Cashfree instance received:', instance)
    throw new Error('Cashfree checkout function not available on instance')
  }

  if (launchType === 'drop' || launchType === 'elements') {
    throw new Error(
      'Cashfree drop-in/elements integration requires additional configuration. Switch to redirect or checkout integration.'
    )
  }

  return new Promise((resolve, reject) => {
    try {
      console.log('[Cashfree Checkout] Using launch type:', launchType)
      console.log('[Cashfree Checkout] Payment session ID to pass:', paymentSessionId)
      
      // Try both parameter name formats for compatibility
      const checkoutConfig = {
        paymentSessionId: paymentSessionId,
        session_id: paymentSessionId, // Some SDK versions use snake_case
        redirectTarget: '_self',
      }
      
      if (launchType === 'redirect') {
        console.log('[Cashfree Checkout] Calling redirect with config:', checkoutConfig)
        
        const result = launch(checkoutConfig)

        if (result && typeof result.then === 'function') {
          result.then(resolve).catch(reject)
        } else {
          resolve(result)
        }
        return
      }

      console.log('[Cashfree Checkout] Calling', launchType, 'with config:', checkoutConfig)

      const result = launch(
        checkoutConfig,
        {
          onSuccess: (data: any) => {
            console.log('[Cashfree Checkout] Success callback:', data)
            callbacks?.onSuccess(data)
            resolve(data)
          },
          onFailure: (error: any) => {
            console.error('[Cashfree Checkout] Failure callback:', error)
            callbacks?.onFailure(error)
            reject(error)
          },
        }
      )

      if (result && typeof result.then === 'function') {
        result.then(resolve).catch(reject)
      }
    } catch (error) {
      console.error('[Cashfree Checkout] Launch error:', error)
      reject(error)
    }
  })
}

