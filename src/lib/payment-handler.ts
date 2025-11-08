export type CashfreeMode = 'sandbox' | 'production'

export interface CashfreeCallbacks {
  onSuccess: (data: any) => void
  onFailure: (error: any) => void
}

export function getCashfreeMode(): CashfreeMode {
  const env = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ?? 'sandbox'
  return env.toLowerCase() === 'production' ? 'production' : 'sandbox'
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

export async function openCashfreeCheckout(paymentSessionId: string, callbacks?: CashfreeCallbacks) {
  await loadCashfreeScript()

  if (!window.Cashfree) {
    throw new Error('Cashfree SDK not available')
  }

  const sdkMode = getCashfreeMode()

  let instance: any
  const initializer: any = window.Cashfree

  try {
    instance = initializer({ mode: sdkMode })
  } catch (err) {
    try {
      instance = new initializer({ mode: sdkMode })
    } catch (innerErr) {
      throw innerErr
    }
  }

  if (instance && typeof instance.then === 'function') {
    instance = await instance
  }

  if (!instance) {
    throw new Error('Cashfree checkout instance could not be initialized')
  }

  const launch =
    typeof instance.checkout === 'function'
      ? instance.checkout.bind(instance)
    : typeof instance.doPayment === 'function'
      ? instance.doPayment.bind(instance)
      : typeof instance.makePayment === 'function'
        ? instance.makePayment.bind(instance)
        : typeof instance.redirect === 'function'
          ? instance.redirect.bind(instance)
          : typeof instance.drop === 'function'
            ? instance.drop.bind(instance)
            : typeof instance.elements === 'function'
              ? instance.elements.bind(instance)
              : null

  if (!launch) {
    console.error('Cashfree instance received:', instance)
    throw new Error('Cashfree checkout function not available on instance')
  }

  return new Promise((resolve, reject) => {
    try {
      const result = launch(
        {
          paymentSessionId,
          redirectTarget: '_self',
        },
        {
          onSuccess: (data: any) => {
            callbacks?.onSuccess(data)
            resolve(data)
          },
          onFailure: (error: any) => {
            callbacks?.onFailure(error)
            reject(error)
          },
        }
      )

      if (result && typeof result.then === 'function') {
        result.then(resolve).catch(reject)
      }
    } catch (error) {
      reject(error)
    }
  })
}

