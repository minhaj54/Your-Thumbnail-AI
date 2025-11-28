'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Navbar } from '@/components/Navbar'
import { useToast } from '@/components/Toast'
import { Download, Trash2, Plus, Image as ImageIcon, Calendar, Sparkles, TrendingUp, Clock, Zap, Eye, X, User, CreditCard, RefreshCw, EyeOff, LogOut, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserProfile, useGeneratedImages, usePaymentHistory } from '@/hooks/useCache'
import { FullscreenImagePreview } from '@/components/FullscreenImagePreview'

interface GeneratedImage {
  id: string
  image_url: string
  prompt: string
  style: string
  aspect_ratio: string
  size: string
  created_at: string
}

interface UserProfile {
  email?: string
  created_at: string
  credits?: number
  credits_used?: number
  subscription_tier?: string
  thumbnails_created?: number
}

interface PaymentHistory {
  id: string
  amount: number
  currency: string
  payment_id: string
  status: string
  plan_type: string
  credits: number
  created_at: string
}

export default function DashboardPage() {
  // Use cached data hooks
  const { profile: userProfile, isLoading: isLoadingProfile, mutate: mutateProfile } = useUserProfile()
  const { images: cachedImages, isLoading: isLoadingImages, mutate: mutateImages } = useGeneratedImages(1, 5)
  const { payments: paymentHistory, isLoading: isLoadingBilling, mutate: mutatePayments } = usePaymentHistory()
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week'>('all')
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null)
  const [fullscreenImage, setFullscreenImage] = useState<GeneratedImage | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile')
  const [showEmail, setShowEmail] = useState(true)
  const { user, signOut } = useAuth()
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()
  
  const images = cachedImages || []
  const isLoading = isLoadingProfile || isLoadingImages

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Refresh functions using SWR mutate
  const loadDashboardData = async () => {
    try {
      await Promise.all([mutateProfile(), mutateImages()])
      showToast('Dashboard refreshed successfully', 'success')
    } catch (error) {
      console.error('Error refreshing dashboard:', error)
      showToast('Failed to refresh dashboard', 'error')
    }
  }

  const loadBillingHistory = async () => {
    try {
      await mutatePayments()
    } catch (error) {
      console.error('Error loading billing history:', error)
      showToast('Failed to load billing history', 'error')
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this thumbnail?')) return

    try {
      const response = await fetch(`/api/images/list`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Invalidate cache to refresh the images list
        mutateImages()
        showToast('Thumbnail deleted successfully!', 'success')
      } else {
        showToast('Failed to delete thumbnail: ' + (data.error || 'Unknown error'), 'error')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      showToast('Failed to delete thumbnail', 'error')
    }
  }

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      // Fetch the image as blob to handle CORS
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `thumbnail-${prompt.slice(0, 20).replace(/\s+/g, '-')}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url)
      showToast('Image downloaded successfully!', 'success')
    } catch (error) {
      console.error('Error downloading image:', error)
      showToast('Failed to download image', 'error')
    }
  }

  const handlePreview = (image: GeneratedImage) => {
    setPreviewImage(image)
  }

  const closePreview = () => {
    setPreviewImage(null)
  }

  const handleFullscreenPreview = (image: GeneratedImage) => {
    setFullscreenImage(image)
  }

  const closeFullscreenPreview = () => {
    setFullscreenImage(null)
  }

  const getFilteredImages = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    if (activeFilter === 'today') {
      return images.filter((img: any) => new Date(img.created_at) >= today)
    } else if (activeFilter === 'week') {
      return images.filter((img: any) => new Date(img.created_at) >= weekAgo)
    }
    return images
  }

  const filteredImages = getFilteredImages()

  // Get plan details based on subscription tier
  const getPlanDetails = (tier: string | null | undefined) => {
    const tierName = tier?.toLowerCase() || 'free'
    
    const plans: Record<string, { name: string; price: number; credits: number; features: string[]; description: string }> = {
      free: {
        name: 'Free',
        price: 0,
        credits: 3,
        description: 'Perfect for trying out',
        features: [
          '3 credits per month',
          '1 thumbnail = 1 credit',
          'AI-powered generation',
          'High quality exports',
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
          'AI-powered generation',
          'High quality exports',
          'Priority support',
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
          'AI-powered generation',
          'High quality exports',
          'Priority support',
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
          'AI-powered generation',
          'High quality exports',
          'Priority support',
        ],
      },
    }
    
    return plans[tierName] || plans.free
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-600">Track your creative journey and manage your thumbnails</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-gradient p-6 group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Generated</p>
            <p className="text-3xl font-bold gradient-text">{images.length}</p>
          </div>
          
          <div className="card-gradient p-6 group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Member Since</p>
            <p className="text-lg font-bold text-gray-900">
              {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('en-US', { 
                month: 'short',
                year: 'numeric' 
              }) : 'N/A'}
            </p>
          </div>

          <div className="card-gradient p-6 group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Credits Used</p>
            <p className="text-3xl font-bold gradient-text">{userProfile?.credits_used || 0}</p>
          </div>

          <div className="card-gradient p-6 group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
            <p className="text-3xl font-bold gradient-text">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="card-gradient p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-gray-600">Create and manage your thumbnails</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/generate" className="btn btn-primary btn-md">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate New
                </Link>
                <Link href="/gallery" className="btn btn-outline btn-md">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Thumbnails Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Thumbnails</h2>
            <p className="text-gray-600">Your latest AI-generated thumbnails</p>
          </div>
          <Link href="/gallery" className="btn btn-outline btn-md">
            <ImageIcon className="mr-2 h-4 w-4" />
            View All Thumbnails
          </Link>
        </div>

        {/* Recent Thumbnails Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="bg-gray-200 rounded-xl h-56 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <div className="card-gradient max-w-md mx-auto p-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No thumbnails yet</h3>
              <p className="text-gray-600 mb-6">Start creating amazing thumbnails with AI</p>
              <Link href="/generate" className="btn btn-primary btn-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your First Thumbnail
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image: any, index: number) => (
              <div 
                key={image.id} 
                className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative">
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="w-full h-56 object-cover cursor-pointer"
                    onClick={() => handleFullscreenPreview(image)}
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="w-full p-4 flex gap-2">
                      <button
                        onClick={() => handlePreview(image)}
                        className="flex-1 btn bg-blue-600 hover:bg-blue-700 text-white btn-sm"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(image.image_url, image.prompt)}
                        className="flex-1 btn btn-primary btn-sm"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="btn bg-red-600 hover:bg-red-700 text-white btn-sm"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
                    {image.aspect_ratio}
                  </div>
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-semibold capitalize">
                    {image.style}
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
                    {image.prompt}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(image.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-gray-500 capitalize">{image.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {previewImage && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={closePreview}
          >
            <div 
              className="relative max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 z-10 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all duration-200 hover:scale-110"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center p-8">
                  <img
                    src={previewImage.image_url}
                    alt={previewImage.prompt}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-6 left-6 flex gap-2">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-semibold capitalize">
                      {previewImage.style}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
                      {previewImage.aspect_ratio}
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-8 flex flex-col justify-between max-h-[70vh] overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Thumbnail Details
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {new Date(previewImage.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Prompt
                        </label>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                          <p className="text-gray-800 leading-relaxed">
                            {previewImage.prompt}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Style
                          </label>
                          <p className="text-gray-900 capitalize bg-gray-50 px-3 py-2 rounded-lg">
                            {previewImage.style}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Size
                          </label>
                          <p className="text-gray-900 capitalize bg-gray-50 px-3 py-2 rounded-lg">
                            {previewImage.size}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-8 pt-6 border-t-2 border-gray-100">
                    <button
                      onClick={() => handleDownload(previewImage.image_url, previewImage.prompt)}
                      className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                    >
                      <Download className="h-5 w-5" />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(previewImage.id)
                        closePreview()
                      }}
                      className="btn bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="mt-12 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
            <p className="text-gray-600">Manage your account settings and preferences</p>
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
                  <h3 className="font-semibold text-gray-900">{userProfile?.email?.split('@')[0] || 'User'}</h3>
                  <p className="text-sm text-gray-500">{userProfile?.email || user?.email}</p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      userProfile?.subscription_tier === 'pro' 
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                        : userProfile?.subscription_tier === 'basic'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {userProfile?.subscription_tier?.toUpperCase() || 'FREE'}
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

                {/* Sign Out Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="card p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <User className="h-6 w-6 text-primary-600" />
                        Personal Information
                      </h2>
                      <button
                        onClick={loadDashboardData}
                        disabled={isLoading}
                        className="btn btn-outline btn-sm gap-2"
                        title="Refresh profile data"
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="label mb-2">Email</label>
                        <div className="relative">
                          <input
                            type={showEmail ? 'text' : 'password'}
                            value={userProfile?.email || user?.email || ''}
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
                            {userProfile?.subscription_tier || 'Free'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="label mb-2">Available Credits</label>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-secondary-50 to-accent-50 border border-secondary-100">
                          <CreditCard className="h-5 w-5 text-secondary-600" />
                          <span className="font-bold text-gray-900 text-xl">
                            {userProfile?.credits || 0}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="label mb-2">Member Since</label>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100">
                          <Calendar className="h-5 w-5 text-primary-600" />
                          <span className="font-medium text-gray-900">
                            {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('en-US', { 
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
                          {userProfile?.thumbnails_created || 0}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Thumbnails Created</div>
                      </div>
                      <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-secondary-100">
                        <div className="text-3xl font-bold gradient-text mb-2">
                          {userProfile?.credits_used || 0}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Credits Used</div>
                      </div>
                      <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-accent-100">
                        <div className="text-3xl font-bold gradient-text mb-2">
                          {userProfile?.created_at ? Math.floor((new Date().getTime() - new Date(userProfile.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
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
                      const plan = getPlanDetails(userProfile?.subscription_tier)
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

                  {/* Payment History */}
                  <div className="card p-4 sm:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment History</h2>
                      <button
                        onClick={loadBillingHistory}
                        disabled={isLoadingBilling}
                        className="btn btn-outline btn-sm gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoadingBilling ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                      </button>
                    </div>
                    
                    {isLoadingBilling ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading payments...</p>
                      </div>
                    ) : paymentHistory.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b-2 border-gray-200">
                              <th className="text-left p-3 text-xs sm:text-sm font-semibold text-gray-700">Date</th>
                              <th className="text-left p-3 text-xs sm:text-sm font-semibold text-gray-700">Plan</th>
                              <th className="text-left p-3 text-xs sm:text-sm font-semibold text-gray-700">Amount</th>
                              <th className="text-left p-3 text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Credits</th>
                              <th className="text-left p-3 text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentHistory.map((payment: any) => (
                              <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-3 text-xs sm:text-sm text-gray-900">
                                  {new Date(payment.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </td>
                                <td className="p-3 text-xs sm:text-sm text-gray-900 capitalize">
                                  {payment.plan_type}
                                </td>
                                <td className="p-3 text-xs sm:text-sm font-semibold text-gray-900">
                                  ₹{payment.amount}
                                </td>
                                <td className="p-3 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                                  {payment.credits}
                                </td>
                                <td className="p-3">
                                  {payment.status === 'completed' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                      <CheckCircle className="h-3 w-3" />
                                      <span className="hidden sm:inline">Paid</span>
                                    </span>
                                  )}
                                  {payment.status === 'pending' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                      <Clock className="h-3 w-3" />
                                      <span className="hidden sm:inline">Pending</span>
                                    </span>
                                  )}
                                  {payment.status === 'failed' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                      <XCircle className="h-3 w-3" />
                                      <span className="hidden sm:inline">Failed</span>
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="font-medium mb-1">No payment history yet</p>
                        <p className="text-sm">Your payment transactions will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fullscreen Preview */}
        {fullscreenImage && (
          <FullscreenImagePreview
            isOpen={!!fullscreenImage}
            onClose={closeFullscreenPreview}
            imageUrl={fullscreenImage.image_url}
            imageAlt={fullscreenImage.prompt}
            onDownload={() => {
              handleDownload(fullscreenImage.image_url, fullscreenImage.prompt)
            }}
            onDelete={() => {
              handleDelete(fullscreenImage.id)
              closeFullscreenPreview()
            }}
            metadata={{
              prompt: fullscreenImage.prompt,
              style: fullscreenImage.style,
              aspect_ratio: fullscreenImage.aspect_ratio,
              size: fullscreenImage.size,
              created_at: fullscreenImage.created_at
            }}
          />
        )}

        {/* Toast Container */}
        <ToastContainer />
      </div>
      </div>
    </AuthGuard>
  )
}
