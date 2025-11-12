'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { useToast } from '@/components/Toast'
import { Download, Trash2, Image as ImageIcon, Grid3x3, LayoutGrid, Filter, Search, Clock, Sparkles, Heart, Eye, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface GeneratedImage {
  id: string
  image_url: string
  prompt: string
  style: string
  aspect_ratio: string
  size: string
  created_at: string
}

type FilterType = 'all' | 'recent' | 'favorites'
type LayoutType = 'grid' | 'masonry'

export default function GalleryPage() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [layout, setLayout] = useState<LayoutType>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null)
  const { user, loading: authLoading } = useAuth()
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirectTo=/gallery')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadImages()
    }
  }, [user])

  useEffect(() => {
    filterImages()
  }, [images, selectedFilter, searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !hasMore) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.offsetHeight

      // Load more when user is 200px from bottom
      if (scrollTop + windowHeight >= docHeight - 200) {
        loadMoreImages()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoadingMore, hasMore])

  const loadImages = async (reset = true) => {
    if (reset) {
      setIsLoading(true)
      setCurrentPage(1)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const response = await fetch(`/api/images/list?page=${reset ? 1 : currentPage + 1}&limit=12`)
      const data = await response.json()

      if (data.success) {
        if (reset) {
          setImages(data.data)
        } else {
          setImages(prev => [...prev, ...data.data])
        }
        setCurrentPage(data.pagination.page)
        setHasMore(data.pagination.hasMore)
      }
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const loadMoreImages = () => {
    if (!isLoadingMore && hasMore) {
      loadImages(false)
    }
  }

  const filterImages = () => {
    let filtered = [...images]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(img => 
        img.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.style.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedFilter === 'recent') {
      filtered = filtered.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 20)
    }

    setFilteredImages(filtered)
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
        setImages(images.filter(img => img.id !== imageId))
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

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading gallery...</p>
        </div>
      </div>
    )
  }

  // Don't render gallery if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My <span className="gradient-text">Gallery</span>
              </h1>
              <p className="text-gray-600">Browse and manage all your created thumbnails</p>
            </div>
            <Link href="/generate" className="btn btn-primary btn-md">
              <Sparkles className="mr-2 h-4 w-4" />
              Create New
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search thumbnails by prompt or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('recent')}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  selectedFilter === 'recent'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500'
                }`}
              >
                <Clock className="h-4 w-4" />
                Recent
              </button>
            </div>

            {/* Layout Toggle */}
            <div className="flex gap-2 bg-white border-2 border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-lg transition-all ${
                  layout === 'grid'
                    ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setLayout('masonry')}
                className={`p-2 rounded-lg transition-all ${
                  layout === 'masonry'
                    ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <div className="card-gradient max-w-md mx-auto p-12">
              <ImageIcon className="h-20 w-20 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchQuery ? 'No results found' : 'No thumbnails yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start creating amazing thumbnails with AI'
                }
              </p>
              {!searchQuery && (
                <Link href="/generate" className="btn btn-primary btn-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Your First Thumbnail
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 text-gray-600 font-medium">
              Showing {filteredImages.length} thumbnail{filteredImages.length !== 1 ? 's' : ''}
            </div>

            {/* Grid Layout */}
            <div className={`grid gap-6 ${
              layout === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative">
                    <img
                      src={image.image_url}
                      alt={image.prompt}
                      className="w-full h-56 object-cover"
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

                    {/* Aspect Ratio Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
                      {image.aspect_ratio}
                    </div>

                    {/* Style Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-semibold capitalize">
                      {image.style}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
                      {image.prompt}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 capitalize flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-gray-500 capitalize">{image.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading More Indicator */}
            {isLoadingMore && (
              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div>
                  <span className="text-gray-600 font-medium">Loading more thumbnails...</span>
                </div>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && filteredImages.length > 0 && (
              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                  <Sparkles className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-600 font-medium">You've reached the end!</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}

