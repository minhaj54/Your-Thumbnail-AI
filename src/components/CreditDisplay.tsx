'use client'

import { useState, useEffect } from 'react'
import { Coins, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface CreditDisplayProps {
  className?: string
  showIcon?: boolean
}

export function CreditDisplay({ className = '', showIcon = true }: CreditDisplayProps) {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCredits()
    }
  }, [user])

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits/balance')
      const data = await response.json()
      
      if (data.success) {
        setCredits(data.credits)
      }
    } catch (error) {
      console.error('Error fetching credits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && <Coins className="h-4 w-4 text-gray-400" />}
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    )
  }

  const isLowCredits = credits !== null && credits <= 1

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <Coins className={`h-4 w-4 ${isLowCredits ? 'text-orange-500' : 'text-primary-600'}`} />
      )}
      <span className={`text-sm font-medium ${isLowCredits ? 'text-orange-600' : 'text-gray-700'}`}>
        {credits !== null ? credits : 0} credits
      </span>
      {isLowCredits && (
        <Zap className="h-3 w-3 text-orange-500" title="Low credits - consider upgrading" />
      )}
    </div>
  )
}
