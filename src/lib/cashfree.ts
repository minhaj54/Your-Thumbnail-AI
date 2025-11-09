import { Cashfree, CFEnvironment } from 'cashfree-pg'

export const PRICING_CONFIG = {
  free: { credits: 5, price: 0 },
  basic: { credits: 40, price: 499 },
  pro: { credits: 150, price: 1499 },
  business: { credits: 350, price: 3999 },
}

let cashfreeInstance: Cashfree | null = null

function resolveEnvironment(): CFEnvironment {
  const env = (process.env.CASHFREE_ENVIRONMENT ?? 'sandbox').trim().toLowerCase()
  return env === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX
}

export function getPlanDetails(planType: string) {
  return PRICING_CONFIG[planType as keyof typeof PRICING_CONFIG] || null
}

export function getCashfreeInstance() {
  if (!cashfreeInstance) {
    const appId = process.env.CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY

    if (!appId || !secretKey) {
      throw new Error('Cashfree credentials are not configured')
    }

    cashfreeInstance = new Cashfree(resolveEnvironment(), appId, secretKey, undefined, undefined, undefined, false)
  }

  return cashfreeInstance
}

export function resetCashfreeInstance() {
  cashfreeInstance = null
}


