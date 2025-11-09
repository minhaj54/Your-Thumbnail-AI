'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function CashfreeReturnPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get('order_id')
      const cfOrderId = searchParams.get('cf_order_id')

      console.log('Payment return page - Order ID:', orderId)
      console.log('Payment return page - CF Order ID:', cfOrderId)

      if (!orderId) {
        setStatus('failed')
        setMessage('Invalid payment session. Missing order ID.')
        return
      }

      try {
        console.log('Verifying payment with backend...')
        
        const response = await fetch('/api/cashfree/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        })

        const data = await response.json()
        console.log('Payment verification response:', data)

        if (data.success && data.status === 'SUCCESS') {
          setStatus('success')
          setMessage(`Payment successful! ${data.credits} credits have been added to your account.`)
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard')
          }, 3000)
        } else {
          setStatus('failed')
          setMessage(data.message || 'Payment verification failed. Please contact support.')
          
          // Redirect to pricing after 5 seconds
          setTimeout(() => {
            router.push('/pricing')
          }, 5000)
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('failed')
        setMessage('Failed to verify payment. Please contact support with your order ID.')
      }
    }

    verifyPayment()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            {status === 'verifying' && (
              <div className="p-4 bg-blue-100 rounded-full">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            )}
            {status === 'failed' && (
              <div className="p-4 bg-red-100 rounded-full">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'verifying' && 'Verifying Payment'}
              {status === 'success' && 'Payment Successful!'}
              {status === 'failed' && 'Payment Failed'}
            </h1>
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Additional Info */}
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Redirecting to dashboard in 3 seconds...
              </p>
            </div>
          )}

          {status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-red-800">
                Redirecting to pricing page in 5 seconds...
              </p>
              {searchParams.get('order_id') && (
                <p className="text-xs text-red-600 font-mono">
                  Order ID: {searchParams.get('order_id')}
                </p>
              )}
            </div>
          )}

          {/* Manual Actions */}
          <div className="pt-4 space-y-2">
            {status === 'success' && (
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-primary w-full"
              >
                Go to Dashboard Now
              </button>
            )}
            {status === 'failed' && (
              <button
                onClick={() => router.push('/pricing')}
                className="btn btn-outline w-full"
              >
                Back to Pricing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

