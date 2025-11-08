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

  return new Promise((resolve, reject) => {
    if (!window.Cashfree) {
      reject(new Error('Cashfree SDK not available'))
      return
    }

    const sdkMode = getCashfreeMode() === 'production' ? 'PROD' : 'TEST'

    Promise.resolve(window.Cashfree({ mode: sdkMode }))
      .then((instance: any) => {
        if (!instance) {
          throw new Error('Cashfree checkout instance could not be initialized')
        }

        const launch =
          typeof instance.checkout === 'function'
            ? instance.checkout.bind(instance)
            : typeof instance.doPayment === 'function'
              ? instance.doPayment.bind(instance)
              : null

        if (!launch) {
          throw new Error('Cashfree checkout function not available')
        }

        launch(
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
      })
      .catch((error) => {
        reject(error)
      })
  })
}

