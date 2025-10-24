'use client'

import { useState } from 'react'
import { X, Zap, CreditCard, Star } from 'lucide-react'
import Link from 'next/link'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentCredits: number
}

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 415,
    credits: 40,
    currency: 'INR',
    popular: false,
    description: 'Perfect for getting started'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1660,
    credits: 160,
    currency: 'INR',
    popular: true,
    description: 'Best value for creators'
  },
  {
    id: 'custom',
    name: 'Custom',
    price: null,
    credits: null,
    currency: 'INR',
    popular: false,
    description: 'Enterprise solutions'
  }
]

export function UpgradeModal({ isOpen, onClose, currentCredits }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  if (!isOpen) return null

  const handlePlanSelect = (planId: string) => {
    if (planId === 'custom') {
      // Redirect to contact form or custom pricing
      window.open('/contact', '_blank')
      return
    }
    
    setSelectedPlan(planId)
    // Redirect to payment page
    window.location.href = `/pricing?plan=${planId}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Zap className="h-6 w-6 text-primary-600 mr-2" />
                Upgrade Your Plan
              </h2>
              <p className="text-gray-600 mt-1">
                You have {currentCredits} credits remaining. Choose a plan to continue generating thumbnails.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  plan.popular
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  {plan.price ? (
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{plan.price}
                      </span>
                      <span className="text-gray-600 ml-1">/one-time</span>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        Contact Sales
                      </span>
                    </div>
                  )}

                  {plan.credits && (
                    <div className="mb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <CreditCard className="h-5 w-5 text-primary-600" />
                        <span className="text-lg font-semibold text-primary-600">
                          {plan.credits} Credits
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {plan.credits} thumbnail generations
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mb-4">
                    {plan.description}
                  </p>

                  <button
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.id === 'custom' ? 'Contact Sales' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What's Included
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">All Plans Include:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• AI-powered thumbnail generation</li>
                  <li>• Face preservation technology</li>
                  <li>• All aspect ratios (16:9, 1:1, 4:3, 9:16, 21:9)</li>
                  <li>• Multiple styles (Professional, Artistic, etc.)</li>
                  <li>• High-quality image output</li>
                  <li>• No watermarks</li>
                  <li>• Download in multiple formats</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pro Plan Benefits:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Priority support</li>
                  <li>• Bulk generation discounts</li>
                  <li>• Advanced customization options</li>
                  <li>• API access (coming soon)</li>
                  <li>• Commercial usage rights</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 mt-6 text-center">
            <p className="text-sm text-gray-500">
              Credits never expire. Need help choosing?{' '}
              <Link href="/contact" className="text-primary-600 hover:text-primary-500">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
