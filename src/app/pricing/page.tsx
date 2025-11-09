'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Check, Zap, Crown, Briefcase, Sparkles, CreditCard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { loadCashfreeScript, openCashfreeCheckout } from '@/lib/payment-handler'
import { useToast } from '@/contexts/ToastContext'

interface PricingTier {
  name: string
  credits: number
  price: number
  icon: any
  popular?: boolean
  features: string[]
  description: string
  gradient: string
  borderGradient: string
}

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { success, error } = useToast()
  const [payAsYouGoCredits, setPayAsYouGoCredits] = useState(10)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingTier, setProcessingTier] = useState<string | null>(null)

  const pricingTiers: PricingTier[] = [
    {
      name: 'Free',
      credits: 5,
      price: 0,
      icon: Sparkles,
      description: 'Perfect for trying out',
      gradient: 'from-gray-500 to-gray-600',
      borderGradient: 'from-gray-200 to-gray-300',
      features: [
        '5 credits per month',
        '1 thumbnail = 1 credit',
        'Basic AI features',
        'Standard quality exports',
        'Community support',
      ],
    },
    {
      name: 'Basic',
      credits: 40,
      price: 499,
      icon: Zap,
      description: 'Great for regular creators',
      gradient: 'from-blue-500 to-cyan-500',
      borderGradient: 'from-blue-200 to-cyan-200',
      features: [
        '40 credits per month',
        '1 thumbnail = 1 credit',
        'Advanced AI features',
        'High quality exports',
        'Priority support',
        'Custom templates',
      ],
    },
    {
      name: 'Pro',
      credits: 150,
      price: 1499,
      icon: Crown,
      popular: true,
      description: 'For serious content creators',
      gradient: 'from-primary-600 to-secondary-600',
      borderGradient: 'from-primary-300 to-secondary-300',
      features: [
        '150 credits per month',
        '1 thumbnail = 1 credit',
        'Premium AI features',
        'Ultra HD exports',
        'Priority support 24/7',
        'Custom templates',
        'Brand kit',
        'API access',
      ],
    },
    {
      name: 'Business',
      credits: 350,
      price: 3999,
      icon: Briefcase,
      description: 'For agencies and teams',
      gradient: 'from-purple-600 to-pink-600',
      borderGradient: 'from-purple-300 to-pink-300',
      features: [
        '350 credits per month',
        '1 thumbnail = 1 credit',
        'All premium features',
        'Ultra HD exports',
        'Dedicated support',
        'Unlimited templates',
        'Full brand kit',
        'API access',
        'Team collaboration',
        'Analytics dashboard',
      ],
    },
  ]

  const handleSelectPlan = async (tierName: string) => {
    if (!user) {
      router.push('/auth/signup')
      return
    }
    
    if (tierName === 'Free') {
      router.push('/generate')
      return
    }

    setIsProcessing(true)
    setProcessingTier(tierName)
    
    try {
      console.log('Creating order for plan:', tierName.toLowerCase())
      
      // Create order
      const response = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: tierName.toLowerCase() }),
      })

      const data = await response.json()
      console.log('Order creation response:', data)

      if (data.order?.paymentSessionId?.startsWith('session_sandbox_') && process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'production') {
        throw new Error('Cashfree session generated in sandbox while frontend is in production mode. Check server env vars.')
      }

      if (!data.success || !data.order?.paymentSessionId) {
        throw new Error('Failed to create order')
      }

      await loadCashfreeScript()

      const handleVerification = async (paymentData: any) => {
        try {
          const resolvedOrderId =
            paymentData?.order?.order_id || paymentData?.order?.orderId || data.order.id

          if (!resolvedOrderId) {
            throw new Error('Missing order ID for verification')
          }

          const verifyResponse = await fetch('/api/cashfree/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: resolvedOrderId,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            success(`Payment successful! ${verifyData.credits} credits added to your account`)
            router.push('/dashboard')
          } else {
            throw new Error(verifyData.error || 'Payment verification failed')
          }
        } catch (verificationError) {
          console.error('Cashfree verification error:', verificationError)
          error(
            verificationError instanceof Error ? verificationError.message : 'Payment verification failed'
          )
        } finally {
          setIsProcessing(false)
          setProcessingTier(null)
        }
      }

      await openCashfreeCheckout(data.order.paymentSessionId, {
        onSuccess: async (paymentData: any) => {
          await handleVerification(paymentData)
        },
        onFailure: (paymentError: any) => {
          console.error('Cashfree payment failed:', paymentError)
          error('Payment failed. Please try again.')
          setIsProcessing(false)
          setProcessingTier(null)
        },
      })
    } catch (err) {
      console.error('Payment error:', err)
      error(err instanceof Error ? err.message : 'Payment failed. Please try again.')
      setIsProcessing(false)
      setProcessingTier(null)
    }
  }

  const handleBuyCredits = async () => {
    if (!user) {
      router.push('/auth/signup')
      return
    }

    setIsProcessing(true)

    try {
      // Create order for pay as you go
      const response = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPayAsYouGo: true,
          credits: payAsYouGoCredits,
        }),
      })

      const data = await response.json()

      if (!data.success || !data.order?.paymentSessionId) {
        throw new Error('Failed to create order')
      }

      await loadCashfreeScript()

      const handleVerification = async (paymentData: any) => {
        try {
          const resolvedOrderId =
            paymentData?.order?.order_id || paymentData?.order?.orderId || data.order.id

          if (!resolvedOrderId) {
            throw new Error('Missing order ID for verification')
          }

          const verifyResponse = await fetch('/api/cashfree/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: resolvedOrderId,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            success(`Payment successful! ${verifyData.credits} credits added to your account`)
            setPayAsYouGoCredits(10)
          } else {
            throw new Error(verifyData.error || 'Payment verification failed')
          }
        } catch (verificationError) {
          console.error('Cashfree verification error:', verificationError)
          error(
            verificationError instanceof Error ? verificationError.message : 'Payment verification failed'
          )
        } finally {
          setIsProcessing(false)
        }
      }

      await openCashfreeCheckout(data.order.paymentSessionId, {
        onSuccess: async (paymentData: any) => {
          await handleVerification(paymentData)
        },
        onFailure: (paymentError: any) => {
          console.error('Cashfree payment failed:', paymentError)
          error('Payment failed. Please try again.')
          setIsProcessing(false)
        },
      })
    } catch (err) {
      console.error('Payment error:', err)
      error('Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start creating stunning thumbnails with AI. Scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon

            return (
              <div
                key={tier.name}
                className={`relative group animate-scale-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      🔥 Most Popular
                    </div>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-2xl bg-white border-2 transition-all duration-300 hover:scale-105 lg:hover:scale-110 hover:shadow-2xl ${
                    tier.popular
                      ? 'border-primary-500 shadow-2xl'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {/* Gradient Background Effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tier.gradient} opacity-5 group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  <div className="relative p-6 lg:p-8">
                    {/* Icon */}
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tier.gradient} mb-4`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-sm text-gray-600 mb-6">{tier.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">
                          ₹{tier.price}
                        </span>
                        {tier.price > 0 && (
                          <span className="text-gray-600">/month</span>
                        )}
                      </div>
                    </div>

                    {/* Credits Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${tier.gradient} bg-opacity-10 border-2 border-gradient-to-r ${tier.borderGradient} mb-6`}>
                      <Zap className={`h-4 w-4 bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`} />
                      <span className="font-bold text-gray-900">{tier.credits} Credits</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={`mt-0.5 p-0.5 rounded-full bg-gradient-to-r ${tier.gradient}`}>
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(tier.name)}
                      disabled={processingTier === tier.name}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        tier.popular
                          ? `bg-gradient-to-r ${tier.gradient} text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`
                          : `border-2 border-gradient-to-r ${tier.borderGradient} hover:bg-gradient-to-r ${tier.gradient} hover:text-white hover:scale-105 active:scale-95`
                      }`}
                    >
                      {processingTier === tier.name ? 'Processing...' : tier.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pay As You Go Section */}
        <div className="max-w-4xl mx-auto mb-16 animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-1">
            <div className="bg-white rounded-3xl p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 mb-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Pay As You <span className="gradient-text">Go</span>
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  Need extra credits on top of your plan? Buy additional credits anytime.
                </p>
                <p className="text-base text-gray-500">
                  Example: Already have 100 credits? Buy 10 more for just ₹100!
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 mb-6 border-2 border-primary-200">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold gradient-text mb-2">
                      ₹10
                    </div>
                    <p className="text-gray-600 font-medium">per credit</p>
                  </div>

                  {/* Credit Calculator */}
                  <div className="space-y-4">
                    <div>
                      <label className="label mb-3 text-center block">
                        How many credits do you need?
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setPayAsYouGoCredits(Math.max(1, payAsYouGoCredits - 10))}
                          className="btn btn-outline btn-md"
                        >
                          -10
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={payAsYouGoCredits}
                          onChange={(e) => setPayAsYouGoCredits(Math.max(1, parseInt(e.target.value) || 1))}
                          className="input text-center text-2xl font-bold flex-1"
                        />
                        <button
                          onClick={() => setPayAsYouGoCredits(payAsYouGoCredits + 10)}
                          className="btn btn-outline btn-md"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-primary-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 font-medium">Credits:</span>
                        <span className="text-2xl font-bold text-gray-900">{payAsYouGoCredits}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600 font-medium">Total Price:</span>
                        <span className="text-3xl font-bold gradient-text">
                          ₹{payAsYouGoCredits * 10}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 text-center mb-4">
                        💡 These are additional credits on top of your plan. They never expire!
                      </div>
                      <button
                        onClick={handleBuyCredits}
                        disabled={isProcessing}
                        className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing 
                          ? 'Processing...' 
                          : `Buy ${payAsYouGoCredits} Credits for ₹${payAsYouGoCredits * 10}`
                        }
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Buy Options */}
                <div className="grid grid-cols-3 gap-4">
                  {[10, 50, 100].map((credits) => (
                    <button
                      key={credits}
                      onClick={() => setPayAsYouGoCredits(credits)}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-center group"
                    >
                      <div className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {credits}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">credits</div>
                      <div className="text-xs text-gray-500 mt-1">₹{credits * 10}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">What is a credit?</h3>
              <p className="text-gray-600">
                1 credit = 1 thumbnail generation. Each time you generate a thumbnail using AI, it consumes 1 credit from your account.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Do credits expire?</h3>
              <p className="text-gray-600">
                Monthly subscription credits reset at the start of each billing cycle. Pay-as-you-go credits never expire and carry over indefinitely.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, UPI, and net banking through our secure payment gateway.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white">
            <h3 className="text-2xl font-bold mb-3">Still not sure?</h3>
            <p className="text-white/90 mb-6 max-w-md">
              Start with our free plan and upgrade when you're ready. No credit card required.
            </p>
            <button
              onClick={() => user ? router.push('/generate') : router.push('/auth/signup')}
              className="btn btn-lg bg-white text-primary-600 hover:bg-gray-50 hover:scale-105"
            >
              {user ? 'Start Creating' : 'Try it Free'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

