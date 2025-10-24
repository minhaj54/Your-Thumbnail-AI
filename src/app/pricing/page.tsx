'use client'

import { useState } from 'react'
import { Sparkles, CreditCard, Check, Zap } from 'lucide-react'
import { PLANS } from '@/lib/razorpay'

interface PricingCardProps {
  plan: typeof PLANS[0]
  isPopular?: boolean
  onSelect: (planId: string) => void
}

function PricingCard({ plan, isPopular = false, onSelect }: PricingCardProps) {
  const priceInRupees = plan.price / 100

  return (
    <div className={`relative border-2 rounded-lg p-6 ${
      isPopular 
        ? 'border-primary-500 bg-primary-50' 
        : 'border-gray-200 hover:border-gray-300'
    } transition-all hover:shadow-lg`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {plan.name}
        </h3>
        
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">
            ₹{priceInRupees.toLocaleString('en-IN')}
          </span>
          <span className="text-gray-600 ml-1">/one-time</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CreditCard className="h-6 w-6 text-primary-600" />
            <span className="text-2xl font-semibold text-primary-600">
              {plan.credits} Credits
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {plan.credits} thumbnail generations
          </p>
        </div>

        <p className="text-gray-600 mb-6">
          {plan.description}
        </p>

        <button
          onClick={() => onSelect(plan.id)}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isPopular
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          Choose {plan.name}
        </button>
      </div>
    </div>
  )
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlanSelect = async (planId: string) => {
    setIsProcessing(true)
    setSelectedPlan(planId)

    try {
      // Create Razorpay order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Initialize Razorpay
      const options = {
        key: data.order.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Thumbnail Builder',
        description: `Purchase ${planId} plan`,
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              alert(`Payment successful! ${verifyData.credits_added} credits added to your account.`)
              window.location.href = '/dashboard'
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#3B82F6',
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to process payment. Please try again.')
    } finally {
      setIsProcessing(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Thumbnail Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/generate" className="text-gray-600 hover:text-gray-900">Generate</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get more credits to create unlimited thumbnails with our AI-powered generator
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {PLANS.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={index === 1} // Pro plan is most popular
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What's Included in All Plans
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">AI-powered thumbnail generation</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Face preservation technology</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">All aspect ratios (16:9, 1:1, 4:3, 9:16, 21:9)</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Multiple styles (Professional, Artistic, etc.)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality & Support</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">High-quality image output</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">No watermarks</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Download in multiple formats</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Credits never expire</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Do credits expire?</h3>
              <p className="text-gray-600">No, your credits never expire. Use them whenever you need them.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
              <p className="text-gray-600">We offer refunds within 7 days of purchase if you're not satisfied.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, debit cards, UPI, and net banking.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Need more credits?</h3>
              <p className="text-gray-600">Contact our support team for custom plans and bulk discounts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
