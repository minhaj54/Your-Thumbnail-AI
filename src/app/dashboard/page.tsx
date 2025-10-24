'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { CreditDisplay } from '@/components/CreditDisplay'
import { Download, Trash2, Plus, Image as ImageIcon, Settings, User, Calendar } from 'lucide-react'
import Link from 'next/link'

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
  credits: number
  subscription_tier: string
  created_at: string
}

export default function DashboardPage() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Load user profile and images in parallel
      const [profileResponse, imagesResponse] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/images/list')
      ])

      const profileData = await profileResponse.json()
      const imagesData = await imagesResponse.json()

      if (profileData.success) {
        setUserProfile(profileData.data)
      }

      if (imagesData.success) {
        setImages(imagesData.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      })

      if (response.ok) {
        setImages(images.filter(img => img.id !== imageId))
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `thumbnail-${prompt.slice(0, 20).replace(/\s+/g, '-')}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your generated thumbnails and account</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Generated</p>
                <p className="text-2xl font-bold text-gray-900">{images.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <CreditDisplay showIcon={true} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credits Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{userProfile?.credits || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Plan</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{userProfile?.subscription_tier || 'Free'}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-sm font-bold text-gray-900">
                  {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link href="/generate" className="btn btn-primary btn-md">
              <Plus className="mr-2 h-4 w-4" />
              Generate New Thumbnail
            </Link>
            <Link href="/pricing" className="btn btn-outline btn-md">
              Upgrade Plan
            </Link>
          </div>
        </div>

        {/* Images Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No thumbnails yet</h3>
            <p className="text-gray-600 mb-6">Start creating amazing thumbnails with AI</p>
            <Link href="/generate" className="btn btn-primary btn-lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Thumbnail
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="card p-6 group hover:shadow-lg transition-shadow">
                <div className="relative mb-4">
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {image.aspect_ratio}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleDownload(image.image_url, image.prompt)}
                      className="btn btn-primary btn-sm"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="btn bg-red-600 hover:bg-red-700 text-white btn-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {image.prompt}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="capitalize">{image.style}</span>
                    <span>{new Date(image.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {images.length > 0 && (
          <div className="text-center mt-8">
            <button className="btn btn-outline btn-lg">
              Load More Thumbnails
            </button>
          </div>
        )}
      </div>
    </div>
  )
}