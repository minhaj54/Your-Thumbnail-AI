export type CashfreeMode = 'sandbox' | 'production'

export interface CashfreeCallbacks {
  onSuccess: (data: any) => void
  onFailure: (error: any) => void
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
      if (launchType === 'redirect') {
        const result = launch({
          paymentSessionId,
          redirectTarget: '_self',
        })

        if (result && typeof result.then === 'function') {
          result.then(resolve).catch(reject)
        } else {
          resolve(result)
        }
        return
      }

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

