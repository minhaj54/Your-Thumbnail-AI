import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export { razorpay }

export const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 41500, // Price in paise (₹415)
    credits: 40,
    currency: 'INR',
    description: 'Perfect for getting started'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 166000, // Price in paise (₹1,660)
    credits: 160,
    currency: 'INR',
    description: 'Best value for creators'
  }
] as const

export type PlanId = typeof PLANS[number]['id']

export function getPlanById(planId: string) {
  return PLANS.find(plan => plan.id === planId)
}

export function formatPrice(priceInPaise: number): string {
  return `₹${(priceInPaise / 100).toLocaleString('en-IN')}`
}
