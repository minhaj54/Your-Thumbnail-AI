'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { useToast } from '@/components/Toast'
import { Copy, Search, Clock, TrendingUp, Sparkles, Eye, Maximize2, X, FileText, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface PromptLibraryItem {
  id: string
  thumbnail_url: string
  thumbnail_base64?: string
  extracted_prompt: string
  source_type: 'url' | 'upload'
  view_count: number
  created_at: string
}

type SortType = 'recent' | 'popular'

export default function PromptLibraryPage() {
  const [prompts, setPrompts] = useState<PromptLibraryItem[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<PromptLibraryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedSort, setSelectedSort] = useState<SortType>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptLibraryItem | null>(null)
  const { showToast, ToastContainer } = useToast()

  useEffect(() => {
    loadPrompts()
  }, [selectedSort])

  useEffect(() => {
    filterPrompts()
  }, [prompts, searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !hasMore) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.offsetHeight

      // Load more when user is 200px from bottom
      if (scrollTop + windowHeight >= docHeight - 200) {
        loadMorePrompts()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoadingMore, hasMore, currentPage])

  const loadPrompts = async (reset = true) => {
    if (reset) {
      setIsLoading(true)
      setCurrentPage(1)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const response = await fetch(`/api/prompt-library/list?page=${reset ? 1 : currentPage + 1}&limit=20&sort=${selectedSort}`)
      const data = await response.json()

      if (data.success) {
        if (reset) {
          setPrompts(data.data.prompts)
        } else {
          setPrompts(prev => [...prev, ...data.data.prompts])
        }
        setHasMore(data.data.pagination.hasMore)
        setCurrentPage(data.data.pagination.page)
      } else {
        console.error('Failed to load prompts:', data.error)
      }
    } catch (error) {
      console.error('Error loading prompts:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const loadMorePrompts = () => {
    if (!isLoadingMore && hasMore) {
      loadPrompts(false)
    }
  }

  const filterPrompts = () => {
    if (!searchQuery.trim()) {
      setFilteredPrompts(prompts)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = prompts.filter(prompt =>
      prompt.extracted_prompt.toLowerCase().includes(query)
    )
    setFilteredPrompts(filtered)
  }

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      showToast('Prompt copied to clipboard!', 'success')
    } catch (error) {
      console.error('Failed to copy:', error)
      showToast('Failed to copy prompt', 'error')
    }
  }

  const usePrompt = (prompt: string) => {
    // Navigate to generate page with prompt pre-filled
    // Store in sessionStorage or pass as query param
    sessionStorage.setItem('savedPrompt', prompt)
    window.location.href = '/generate?mode=create'
  }

  const getThumbnailUrl = (item: PromptLibraryItem) => {
    if (item.thumbnail_url) {
      return item.thumbnail_url
    }
    if (item.thumbnail_base64) {
      return `data:image/jpeg;base64,${item.thumbnail_base64}`
    }
    return ''
  }

  const truncatePrompt = (prompt: string, maxLength: number = 150) => {
    if (prompt.length <= maxLength) return prompt
    return prompt.substring(0, maxLength) + '...'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Prompt <span className="gradient-text">Library</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse and copy reusable prompts extracted from thumbnails. Find inspiration and use them to generate your own designs.
          </p>
        </div>

        {/* Search and Sort */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedSort('recent')
                  loadPrompts(true)
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  selectedSort === 'recent'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500'
                }`}
              >
                <Clock className="h-4 w-4" />
                Recent
              </button>
              <button
                onClick={() => {
                  setSelectedSort('popular')
                  loadPrompts(true)
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  selectedSort === 'popular'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Popular
              </button>
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                <div className="bg-gray-200 rounded h-4 mb-2"></div>
                <div className="bg-gray-200 rounded h-4 w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No prompts found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try a different search term' : 'Be the first to add a prompt to the library!'}
            </p>
            {!searchQuery && (
              <Link href="/generate?mode=extract" className="btn btn-primary">
                Extract Your First Prompt
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="card-gradient p-6 hover:shadow-xl transition-all duration-300 group animate-fade-in"
                >
                  {/* Thumbnail */}
                  <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={getThumbnailUrl(prompt)}
                      alt="Thumbnail"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23e5e7eb" width="400" height="300"/><text x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="24">Image not available</text></svg>'
                      }}
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs">
                      <Eye className="h-3 w-3" />
                      <span>{prompt.view_count}</span>
                    </div>
                    <button
                      onClick={() => setSelectedPrompt(prompt)}
                      className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <Maximize2 className="h-8 w-8 text-white" />
                    </button>
                  </div>

                  {/* Prompt Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap line-clamp-4">
                      {truncatePrompt(prompt.extracted_prompt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyPrompt(prompt.extracted_prompt)}
                      className="flex-1 btn btn-outline btn-sm flex items-center justify-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPrompt(prompt)
                      }}
                      className="btn btn-outline btn-sm flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {isLoadingMore && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading more prompts...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Prompt Details</h2>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Thumbnail */}
              <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={getThumbnailUrl(selectedPrompt)}
                  alt="Thumbnail"
                  className="w-full max-w-full h-auto object-contain"
                  style={{ maxHeight: '500px' }}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23e5e7eb" width="400" height="300"/><text x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="24">Image not available</text></svg>'
                  }}
                />
              </div>

              {/* Full Prompt */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-4 border-primary-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Extracted Prompt</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>{selectedPrompt.view_count} views</span>
                  </div>
                </div>
                <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {selectedPrompt.extracted_prompt}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => copyPrompt(selectedPrompt.extracted_prompt)}
                  className="flex-1 btn btn-outline btn-lg flex items-center justify-center gap-3 py-4 text-base font-semibold"
                >
                  <Copy className="h-6 w-6" />
                  Copy Prompt
                </button>
                <Link
                  href="/generate?mode=create"
                  onClick={() => {
                    sessionStorage.setItem('savedPrompt', selectedPrompt.extracted_prompt)
                  }}
                  className="flex-1 btn btn-primary btn-lg flex items-center justify-center gap-3 py-4 text-base font-semibold"
                >
                  <Sparkles className="h-6 w-6" />
                  Use This Prompt
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

