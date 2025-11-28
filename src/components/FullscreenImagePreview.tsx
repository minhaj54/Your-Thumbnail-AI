'use client'

import { useEffect } from 'react'
import { X, Download, Trash2, Maximize2, Minimize2 } from 'lucide-react'

interface FullscreenImagePreviewProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageAlt?: string
  onDownload?: () => void
  onDelete?: () => void
  showActions?: boolean
  metadata?: {
    prompt?: string
    style?: string
    aspect_ratio?: string
    size?: string
    created_at?: string
  }
}

export function FullscreenImagePreview({
  isOpen,
  onClose,
  imageUrl,
  imageAlt = 'Thumbnail preview',
  onDownload,
  onDelete,
  showActions = true,
  metadata
}: FullscreenImagePreviewProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
        aria-label="Close preview"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image Container */}
      <div 
        className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
        />

        {/* Metadata Badges */}
        {metadata && (
          <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
            {metadata.style && (
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-semibold capitalize backdrop-blur-sm">
                {metadata.style}
              </div>
            )}
            {metadata.aspect_ratio && (
              <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
                {metadata.aspect_ratio}
              </div>
            )}
            {metadata.size && (
              <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold capitalize">
                {metadata.size}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (onDownload || onDelete) && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {onDownload && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload()
                }}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </button>
            )}
          </div>
        )}

        {/* Prompt Display (if available) */}
        {metadata?.prompt && (
          <div className="absolute bottom-6 right-6 max-w-md z-10 hidden lg:block">
            <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white">
              <p className="text-sm font-semibold mb-2">Prompt:</p>
              <p className="text-xs leading-relaxed line-clamp-4">{metadata.prompt}</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm z-10">
        Press ESC to close
      </div>
    </div>
  )
}

