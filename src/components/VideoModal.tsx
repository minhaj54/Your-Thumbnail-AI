'use client'

import { useState, useEffect } from 'react'
import { X, Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoId: string
  title?: string
}

export function VideoModal({ isOpen, onClose, videoId, title = "Tutorial Video" }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Close modal on Escape key
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

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const modal = document.getElementById('video-modal')
      if (modal?.requestFullscreen) {
        modal.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        id="video-modal"
        className="relative w-full max-w-5xl bg-white rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <h3 className="text-sm sm:text-lg font-semibold flex items-center gap-2">
            <Play className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&fs=1&cc_load_policy=1&iv_load_policy=3&start=0&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
              title={title}
              className="absolute top-0 left-0 w-full h-full rounded-b-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Footer with controls info */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Click to play/pause</span>
                <span className="sm:hidden">Play/Pause</span>
              </div>
              <div className="flex items-center gap-1">
                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Volume controls</span>
                <span className="sm:hidden">Volume</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Fullscreen</span>
                <span className="sm:hidden">Fullscreen</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Press ESC to close
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
