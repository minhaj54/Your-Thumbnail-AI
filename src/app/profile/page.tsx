'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Navbar } from '@/components/Navbar'
import { User, Calendar, CreditCard, Image as ImageIcon, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  email: string
  created_at: string
  credits: number
  subscription_tier: string
  thumbnails_created: number
  credits_used: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { error: showError } = useToast()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile')
  
  // Form states
  const [showEmail, setShowEmail] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }
    loadProfile()
  }, [user, router])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      
      console.log('Profile API response:', data)
      
      if (data.success) {
        setProfile(data.data)
      } else if (data.error) {
        console.error('Profile API error:', data.error)
        showError(data.error)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      showError('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  // Get plan details based on subscription tier
  const getPlanDetails = (tier: string | null | undefined) => {
    const tierName = tier?.toLowerCase() || 'free'
    
    const plans: Record<string, { name: string; price: number; credits: number; features: string[]; description: string }> = {
      free: {
        name: 'Free',
        price: 0,
        credits: 5,
        description: 'Perfect for trying out',
        features: [
          '5 credits per month',
          '1 thumbnail = 1 credit',
          'Basic AI features',
          'Standard quality exports',
          'Community support',
        ],
      },
      basic: {
        name: 'Basic',
        price: 499,
        credits: 40,
        description: 'Great for regular creators',
        features: [
          '40 credits per month',
          '1 thumbnail = 1 credit',
          'Advanced AI features',
          'High quality exports',
          'Priority support',
          'Custom templates',
        ],
      },
      pro: {
        name: 'Pro',
        price: 1499,
        credits: 150,
        description: 'For serious content creators',
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
      custom: {
        name: 'Business',
        price: 3999,
        credits: 350,
        description: 'For agencies and teams',
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
    }
    
    return plans[tierName] || plans.free
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My <span className="gradient-text">Profile</span>
              </h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
            <button
              onClick={loadProfile}
              disabled={isLoading}
              className="btn btn-outline btn-sm gap-2"
              title="Refresh profile data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="card p-6 space-y-4 sticky top-24">
              {/* User Avatar */}
              <div className="text-center pb-4 border-b border-gray-200">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <h3 className="font-semibold text-gray-900">{profile?.email?.split('@')[0] || 'User'}</h3>
                <p className="text-sm text-gray-500">{profile?.email || user?.email}</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile?.subscription_tier === 'pro' 
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                      : profile?.subscription_tier === 'basic'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {profile?.subscription_tier?.toUpperCase() || 'FREE'}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'billing'
                      ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  Billing
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="h-6 w-6 text-primary-600" />
                    Personal Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="label mb-2">Email</label>
                      <div className="relative">
                        <input
                          type={showEmail ? 'text' : 'password'}
                          value={profile?.email || user?.email || ''}
                          disabled
                          className="input pr-12 bg-gray-50"
                        />
                        <button
                          onClick={() => setShowEmail(!showEmail)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showEmail ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="label mb-2">Subscription Plan</label>
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100">
                        <CreditCard className="h-5 w-5 text-primary-600" />
                        <span className="font-medium text-gray-900 capitalize">
                          {profile?.subscription_tier || 'Free'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="label mb-2">Available Credits</label>
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-secondary-50 to-accent-50 border border-secondary-100">
                        <CreditCard className="h-5 w-5 text-secondary-600" />
                        <span className="font-bold text-gray-900 text-xl">
                          {profile?.credits || 0}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="label mb-2">Member Since</label>
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <span className="font-medium text-gray-900">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="card-gradient p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ImageIcon className="h-6 w-6 text-secondary-600" />
                    Your Statistics
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-primary-100">
                      <div className="text-3xl font-bold gradient-text mb-2">
                        {profile?.thumbnails_created || 0}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Thumbnails Created</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-secondary-100">
                      <div className="text-3xl font-bold gradient-text mb-2">
                        {profile?.credits_used || 0}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Credits Used</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-accent-100">
                      <div className="text-3xl font-bold gradient-text mb-2">
                        {profile?.created_at ? Math.floor((new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Days Active</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-fade-in">
                <div className="card-gradient p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-accent-600" />
                    Current Plan
                  </h2>
                  
                  {(() => {
                    const plan = getPlanDetails(profile?.subscription_tier)
                    const isFree = plan.price === 0
                    
                    return (
                      <>
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-primary-100 mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold gradient-text">{plan.name} Plan</h3>
                              <p className="text-gray-600">{plan.description}</p>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                              ₹{plan.price}
                              {plan.price > 0 && <span className="text-lg text-gray-500">/mo</span>}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm mb-4">
                            {plan.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                                {feature}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-primary-200">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-medium">Monthly Credits:</span>
                              <span className="text-xl font-bold text-gray-900">{plan.credits}</span>
                            </div>
                          </div>
                        </div>

                        {!isFree && (
                          <button 
                            onClick={() => router.push('/pricing')}
                            className="btn btn-outline btn-md w-full"
                          >
                            Change Plan
                          </button>
                        )}
                        
                        {isFree && (
                          <button 
                            onClick={() => router.push('/pricing')}
                            className="btn btn-primary btn-md w-full"
                          >
                            Upgrade Plan
                          </button>
                        )}
                      </>
                    )
                  })()}
                </div>

                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing History</h2>
                  <div className="text-center py-12 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No billing history yet</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

