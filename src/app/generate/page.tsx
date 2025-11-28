'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Download, RefreshCw, Wand2, Upload, X, Image as ImageIcon, Zap, Copy, Link as LinkIcon, Palette, Clock, CheckCircle2, Maximize2, Loader2, FileText, LogIn, CreditCard, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { useToast } from '@/components/Toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ImageGenerationOptions = {
  style?: 'realistic' | 'artistic' | 'minimalist' | 'vibrant' | 'professional'
  aspectRatio?: '16:9' | '1:1' | '4:3' | '9:16' | '21:9'
  size?: 'small' | 'medium' | 'large'
  quality?: 'standard' | 'high'
}

type GenerationMode = 'create' | 'clone' | 'analyzer' | 'extract'

export default function GeneratePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { showToast, ToastContainer } = useToast()
  const [mode, setMode] = useState<GenerationMode>('create')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<ImageGenerationOptions['style']>('professional')
  const [aspectRatio, setAspectRatio] = useState<ImageGenerationOptions['aspectRatio']>('16:9')
  const [size, setSize] = useState<ImageGenerationOptions['size']>('medium')
  const [quality, setQuality] = useState<ImageGenerationOptions['quality']>('high')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  const [error, setError] = useState('')
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [cloneUrl, setCloneUrl] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [generateVariants, setGenerateVariants] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [analyzerUrl, setAnalyzerUrl] = useState('')
  const [analyzerFile, setAnalyzerFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzerUploadMethod, setAnalyzerUploadMethod] = useState<'url' | 'upload'>('url')
  const [extractUrl, setExtractUrl] = useState('')
  const [extractFile, setExtractFile] = useState<File | null>(null)
  const [extractUploadMethod, setExtractUploadMethod] = useState<'url' | 'upload'>('url')
  const [extractedPrompt, setExtractedPrompt] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [saveToLibrary, setSaveToLibrary] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const analyzerFileInputRef = useRef<HTMLInputElement>(null)
  const extractFileInputRef = useRef<HTMLInputElement>(null)
  const pendingPromptRef = useRef<string | null>(null)
  const insufficientCreditsRef = useRef<HTMLDivElement>(null)

  // Check for saved prompt from library on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlMode = urlParams.get('mode')
    
    // Check URL params for mode
    if (urlMode && ['create', 'clone', 'analyzer', 'extract'].includes(urlMode)) {
      setMode(urlMode as GenerationMode)
    } else {
      // Check if we have a saved prompt and need to switch to create mode
      const savedPrompt = sessionStorage.getItem('savedPrompt')
      if (savedPrompt) {
        setMode('create')
      }
    }
    // Don't remove sessionStorage here - let the clear effect handle it
  }, [])
  
  // Set pending prompt after mode changes to create
  useEffect(() => {
    if (mode === 'create' && pendingPromptRef.current) {
      // Use a longer timeout to ensure clear effect has run
      const timeoutId = setTimeout(() => {
        const promptToSet = pendingPromptRef.current
        if (promptToSet) {
          pendingPromptRef.current = null
          setPrompt(promptToSet)
        }
      }, 500)
      
      return () => clearTimeout(timeoutId)
    }
  }, [mode])

  // Track previous mode to detect mode changes
  const prevModeRef = useRef<GenerationMode | null>(null)
  const isInitialMountRef = useRef(true)
  
  // Clear all fields when switching between modes
  useEffect(() => {
    // Check for saved prompt in sessionStorage before clearing
    const savedPrompt = sessionStorage.getItem('savedPrompt')
    if (savedPrompt && mode === 'create') {
      sessionStorage.removeItem('savedPrompt')
      // Don't clear, and set the prompt after a short delay
      setTimeout(() => {
        setPrompt(savedPrompt)
      }, 100)
      prevModeRef.current = mode
      return
    }
    
    // On initial mount, don't clear if we have a pending prompt
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      if (pendingPromptRef.current) {
        prevModeRef.current = mode
        return
      }
    }
    
    // Don't clear prompt if:
    // 1. We have a pending prompt to set
    // 2. We're switching TO create mode (not FROM create mode)
    const isSwitchingToCreate = mode === 'create' && prevModeRef.current !== 'create' && prevModeRef.current !== null
    const shouldPreservePrompt = pendingPromptRef.current || isSwitchingToCreate
    
    // Clear all form fields
    if (!shouldPreservePrompt) {
      setPrompt('')
    }
    setUploadedImages([])
    setCloneUrl('')
    setGeneratedImages([])
    setError('')
    setShowInsufficientCredits(false)
    setLoadingProgress(0)
    setLoadingMessage('')
    setPreviewImage(null)
    setAnalyzerUrl('')
    setAnalyzerFile(null)
    setAnalysisResult(null)
    setAnalyzerUploadMethod('url')
    setExtractUrl('')
    setExtractFile(null)
    setExtractedPrompt(null)
    setExtractUploadMethod('url')
    setSaveToLibrary(true)
    
    // Reset to default settings
    setStyle('professional')
    setAspectRatio('16:9')
    setSize('medium')
    setQuality('high')
    setGenerateVariants(false)
    
    // Update previous mode
    prevModeRef.current = mode
  }, [mode]) // Run this effect whenever mode changes

  // Scroll to insufficient credits message when it appears
  useEffect(() => {
    if (showInsufficientCredits && insufficientCreditsRef.current) {
      // Small delay to ensure the element is rendered
      setTimeout(() => {
        insufficientCreditsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 100)
    }
  }, [showInsufficientCredits])

  // Image upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      setUploadedImages(prev => [...prev, ...files].slice(0, 5))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      setUploadedImages(prev => [...prev, ...files].slice(0, 5))
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleGenerate = async () => {
    // Check if user is logged in
    if (!user) {
      setShowAuthPrompt(true)
      return
    }

    // Validation based on mode
    if (mode === 'create' && !prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    if (mode === 'clone') {
      if (!cloneUrl.trim()) {
        setError('Please enter a YouTube video URL or thumbnail URL to clone')
        return
      }
      if (!prompt.trim()) {
        setError('Please describe how you want to modify the cloned thumbnail')
        return
      }
    }

    setIsGenerating(true)
    setError('')
    setShowInsufficientCredits(false)
    setGeneratedImages([])
    setLoadingProgress(0)
    
    // Set initial loading message based on mode
    if (mode === 'clone') {
      setLoadingMessage('Analyzing the thumbnail to clone...')
    } else {
      setLoadingMessage('Preparing your thumbnail...')
    }

    try {
      // Clone mode - single generation only
      if (mode === 'clone') {
        setLoadingProgress(20)
        setLoadingMessage('Extracting thumbnail design...')
        
        // Extract video ID from YouTube URL if needed
        let thumbnailUrl = cloneUrl.trim()
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
        const match = cloneUrl.match(youtubeRegex)
        
        if (match && match[1]) {
          // Convert YouTube video URL to thumbnail URL (try maxresdefault first, fallback to hqdefault)
          const videoId = match[1]
          thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
          setLoadingProgress(30)
          setLoadingMessage('Found the thumbnail! Downloading...')
        }

        // Fetch the thumbnail image and convert to File with retry logic
        setLoadingProgress(40)
        setLoadingMessage('Downloading the thumbnail to clone...')
        
        let clonedThumbnailFile: File | null = null
        
        // Retry function with exponential backoff
        const fetchWithRetry = async (url: string, maxRetries = 3, retryDelay = 1000): Promise<Response> => {
          let lastError: Error | null = null
          
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              if (attempt > 1) {
                setLoadingMessage(`Retrying thumbnail download... (Attempt ${attempt}/${maxRetries})`)
                await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
              }
              
              const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                  'Accept': 'image/*',
                }
              })
              
              if (response.ok) {
                return response
              }
              
              // If it's the last attempt, throw the error
              if (attempt === maxRetries) {
                throw new Error(`Failed to fetch thumbnail: ${response.status} ${response.statusText}`)
              }
              
              lastError = new Error(`Attempt ${attempt} failed: ${response.status} ${response.statusText}`)
            } catch (error) {
              lastError = error instanceof Error ? error : new Error('Unknown fetch error')
              
              // If it's the last attempt, throw the error
              if (attempt === maxRetries) {
                throw lastError
              }
            }
          }
          
          throw lastError || new Error('Failed to fetch thumbnail after all retries')
        }
        
        try {
          let thumbnailResponse: Response | null = null
          
          // For YouTube thumbnails, try maxresdefault first, then fallback to hqdefault
          try {
            thumbnailResponse = await fetchWithRetry(thumbnailUrl)
          } catch (firstError) {
            // If maxresdefault fails for YouTube, try hqdefault
            if (match && match[1]) {
              const videoId = match[1]
              const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
              setLoadingMessage('Trying alternative thumbnail quality...')
              try {
                thumbnailResponse = await fetchWithRetry(fallbackUrl)
              } catch (fallbackError) {
                // If both fail, try sddefault as last resort
                const sdDefaultUrl = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`
                setLoadingMessage('Trying standard quality thumbnail...')
                thumbnailResponse = await fetchWithRetry(sdDefaultUrl)
              }
            } else {
              throw firstError
            }
          }
          
          if (!thumbnailResponse || !thumbnailResponse.ok) {
            throw new Error(`Failed to fetch thumbnail: ${thumbnailResponse?.status || 'Unknown error'}`)
          }
          
          // Check if the response is actually an image
          const contentType = thumbnailResponse.headers.get('content-type')
          if (!contentType || !contentType.startsWith('image/')) {
            throw new Error('URL does not point to a valid image')
          }
          
          // Ensure response body is fully loaded
          const thumbnailBlob = await thumbnailResponse.blob()
          
          // Validate blob is not empty and has reasonable size
          if (thumbnailBlob.size === 0) {
            throw new Error('Thumbnail file is empty')
          }
          
          // Validate blob size is reasonable (at least 1KB, max 50MB)
          if (thumbnailBlob.size < 1024) {
            throw new Error('Thumbnail file is too small to be valid')
          }
          if (thumbnailBlob.size > 50 * 1024 * 1024) {
            throw new Error('Thumbnail file is too large')
          }
          
          // Convert blob to File with proper MIME type
          const mimeType = thumbnailBlob.type || contentType || 'image/jpeg'
          clonedThumbnailFile = new File(
            [thumbnailBlob], 
            'cloned-thumbnail.jpg', 
            { type: mimeType }
          )
          
          setLoadingProgress(50)
          setLoadingMessage('Thumbnail downloaded! Preparing to modify...')
        } catch (fetchError) {
          console.error('Error fetching thumbnail:', fetchError)
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch the thumbnail. Please check the URL and try again.')
          setIsGenerating(false)
          return
        }

        // Validate that we have a valid thumbnail file
        if (!clonedThumbnailFile) {
          setError('Failed to process thumbnail file. Please try again.')
          setIsGenerating(false)
          return
        }

        // Prepare form data with the cloned thumbnail
        const formData = new FormData()
        
        // Create a comprehensive prompt for cloning and modification
        const clonePrompt = `🎯 THUMBNAIL CLONING & MODIFICATION TASK 🎯

REFERENCE THUMBNAIL: I have provided the original thumbnail image that needs to be cloned and modified.

MODIFICATION INSTRUCTIONS:
${prompt}

🚨 CRITICAL REQUIREMENTS:
1. Use the EXACT visual style, layout, and composition from the reference thumbnail
2. Maintain the same color scheme, typography style, and overall aesthetic
3. Keep the same aspect ratio and general structure
4. Apply the modifications specified above while preserving the original thumbnail's core design
5. If additional images are provided, integrate them seamlessly into the cloned thumbnail
6. The final result should look like a natural evolution/modification of the original thumbnail, not a completely new design
7. Preserve any text styling, effects, and positioning from the original
8. Match the lighting, shadows, and visual effects of the original thumbnail

The reference thumbnail is provided as the FIRST image. ${uploadedImages.length > 0 ? `Additional images for integration are also provided (${uploadedImages.length} image(s)).` : 'No additional images were provided.'}`

        formData.append('prompt', clonePrompt)
        formData.append('style', style || 'professional')
        formData.append('aspectRatio', aspectRatio || '16:9')
        formData.append('size', size || 'medium')
        formData.append('quality', quality || 'high')
        formData.append('cloneReferenceCount', '1')
        
        // Add the cloned thumbnail as the first image (most important reference)
        formData.append('images', clonedThumbnailFile)
        
        // Add any additional uploaded images
        uploadedImages.forEach((file) => {
          formData.append('images', file)
        })

        setLoadingProgress(60)
        setLoadingMessage('Cloning and modifying with AI... 🎨')

        // Always use the face-preservation endpoint since we have images
        const apiEndpoint = '/api/generate/face-preservation'

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData
        })

        setLoadingProgress(90)
        setLoadingMessage('Finalizing your cloned thumbnail...')

        // Check for insufficient credits (402 status)
        if (response.status === 402) {
          const data = await response.json()
          setShowInsufficientCredits(true)
          setError('')
          setIsGenerating(false)
          return
        }

        // Check if response is ok before parsing
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status} ${response.statusText}` }))
          throw new Error(errorData.error || `Failed to clone thumbnail: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.data && data.data.url) {
          setLoadingProgress(100)
          setLoadingMessage('Your cloned thumbnail is ready! ✨')
          setGeneratedImages([data.data])
        } else {
          throw new Error(data.error || 'Failed to clone thumbnail: Invalid response from server')
        }
      } else if (generateVariants && mode === 'create') {
        // Generate 3 variants with different styles
        const styles: Array<'realistic' | 'artistic' | 'professional'> = ['realistic', 'artistic', 'professional']
        const variants = []

        for (let i = 0; i < styles.length; i++) {
          const variantStyle = styles[i]
          setLoadingProgress(Math.floor((i / styles.length) * 100))
          setLoadingMessage(`Generating ${variantStyle} variant... (${i + 1}/3)`)
          const formData = new FormData()
          formData.append('prompt', prompt)
          formData.append('style', variantStyle)
          formData.append('aspectRatio', aspectRatio || '16:9')
          formData.append('size', size || 'medium')
          formData.append('quality', quality || 'high')
          
          uploadedImages.forEach((file) => {
            formData.append(`images`, file)
          })

          const apiEndpoint = uploadedImages.length > 0
            ? '/api/generate/face-preservation'
            : '/api/generate/image'

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
            variants.push({
              ...data.data,
              variantStyle
            })
          }
        }

        setLoadingProgress(100)
        setLoadingMessage('All variants generated! ✨')
        setGeneratedImages(variants)
      } else {
        // Generate single image
        setLoadingProgress(30)
        setLoadingMessage('Analyzing your prompt...')
        
      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('style', style || 'professional')
      formData.append('aspectRatio', aspectRatio || '16:9')
      formData.append('size', size || 'medium')
      formData.append('quality', quality || 'high')
      
        uploadedImages.forEach((file) => {
        formData.append(`images`, file)
      })

        const apiEndpoint = uploadedImages.length > 0
          ? '/api/generate/face-preservation'
          : '/api/generate/image'

        setLoadingProgress(60)
        setLoadingMessage('Creating your masterpiece with AI... 🎨')

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData
        })

        setLoadingProgress(90)
        setLoadingMessage('Finalizing your thumbnail...')

        // Check for insufficient credits (402 status)
        if (response.status === 402) {
          const data = await response.json()
          setShowInsufficientCredits(true)
          setError('')
          setIsGenerating(false)
          return
        }

        const data = await response.json()

        if (data.success) {
          setLoadingProgress(100)
          setLoadingMessage('Your thumbnail is ready! ✨')
          setGeneratedImages([data.data])
          setShowInsufficientCredits(false)
      } else {
        setError(data.error || 'Failed to generate image')
        setShowInsufficientCredits(false)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image')
      setShowInsufficientCredits(false)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      // Fetch the image as a blob to handle CORS
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // Create a local URL for the blob
      const blobUrl = window.URL.createObjectURL(blob)
      
      // Create and trigger download
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `thumbnail-variant-${index + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback to direct download
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `thumbnail-variant-${index + 1}.jpg`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl)
  }

  const closePreview = () => {
    setPreviewImage(null)
  }

  const handleAnalyze = async () => {
    // Check if user is logged in
    if (!user) {
      setShowAuthPrompt(true)
      return
    }

    setIsAnalyzing(true)
    setError('')
    setAnalysisResult(null)

    try {
      let thumbnailFile: File | null = null

      // Handle URL method
      if (analyzerUploadMethod === 'url') {
        // Extract video ID from YouTube URL if needed
        let thumbnailUrl = analyzerUrl
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
        const match = analyzerUrl.match(youtubeRegex)
        
        if (match && match[1]) {
          // Convert YouTube video URL to thumbnail URL
          thumbnailUrl = `https://i.ytimg.com/vi/${match[1]}/maxresdefault.jpg`
        }

        // Fetch the thumbnail
        const thumbnailResponse = await fetch(thumbnailUrl)
        if (!thumbnailResponse.ok) {
          throw new Error('Failed to fetch thumbnail')
        }
        
        const thumbnailBlob = await thumbnailResponse.blob()
        thumbnailFile = new File([thumbnailBlob], 'thumbnail.jpg', { type: thumbnailBlob.type || 'image/jpeg' })
      } else {
        // Use uploaded file
        thumbnailFile = analyzerFile
      }

      if (!thumbnailFile) {
        setError('No thumbnail to analyze')
        return
      }

      // Send to API for analysis
      const formData = new FormData()
      formData.append('thumbnail', thumbnailFile)

      console.log('Sending thumbnail for analysis...')
      const response = await fetch('/api/analyze-thumbnail', {
        method: 'POST',
        body: formData
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        setAnalysisResult(data.data)
      } else {
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}`
          : data.error || 'Failed to analyze thumbnail'
        console.error('API error:', errorMessage)
        setError(errorMessage)
      }
    } catch (err) {
      console.error('Analysis error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze thumbnail'
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleExtractPrompt = async () => {
    // Check if user is logged in
    if (!user) {
      setShowAuthPrompt(true)
      return
    }

    setIsExtracting(true)
    setError('')
    setExtractedPrompt(null)

    try {
      let thumbnailFile: File | null = null

      // Handle URL method
      if (extractUploadMethod === 'url') {
        // Extract video ID from YouTube URL if needed
        let thumbnailUrl = extractUrl
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
        const match = extractUrl.match(youtubeRegex)
        
        if (match && match[1]) {
          // Convert YouTube video URL to thumbnail URL
          thumbnailUrl = `https://i.ytimg.com/vi/${match[1]}/maxresdefault.jpg`
        }

        // Fetch the thumbnail
        const thumbnailResponse = await fetch(thumbnailUrl)
        if (!thumbnailResponse.ok) {
          throw new Error('Failed to fetch thumbnail')
        }
        
        const thumbnailBlob = await thumbnailResponse.blob()
        thumbnailFile = new File([thumbnailBlob], 'thumbnail.jpg', { type: thumbnailBlob.type || 'image/jpeg' })
      } else {
        // Use uploaded file
        thumbnailFile = extractFile
      }

      if (!thumbnailFile) {
        setError('No thumbnail to extract prompt from')
        return
      }

      // Send to API for prompt extraction
      const formData = new FormData()
      formData.append('thumbnail', thumbnailFile)
      formData.append('saveToLibrary', saveToLibrary.toString())
      formData.append('sourceType', extractUploadMethod)

      console.log('Sending thumbnail for prompt extraction...', { saveToLibrary, sourceType: extractUploadMethod })
      const response = await fetch('/api/extract-prompt', {
        method: 'POST',
        body: formData
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        setExtractedPrompt(data.data.extractedPrompt)
        if (data.data.savedToLibrary) {
          // Show success message (you could use toast here)
          console.log('Prompt saved to library successfully!')
        }
      } else {
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}`
          : data.error || 'Failed to extract prompt'
        console.error('API error:', errorMessage)
        setError(errorMessage)
      }
    } catch (err) {
      console.error('Extraction error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract prompt'
      setError(errorMessage)
    } finally {
      setIsExtracting(false)
    }
  }

  const copyPromptToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('Prompt copied to clipboard!', 'success')
    } catch (err) {
      console.error('Failed to copy:', err)
      showToast('Failed to copy prompt to clipboard', 'error')
    }
  }

  const useExtractedPrompt = () => {
    if (extractedPrompt) {
      const promptToUse = extractedPrompt
      // Set pending prompt before mode change
      pendingPromptRef.current = promptToUse
      setMode('create')
      // Update URL to reflect create mode
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('mode', 'create')
      window.history.pushState({}, '', newUrl.toString())
      // Scroll to prompt input area after a delay
      setTimeout(() => {
        const promptInput = document.querySelector('textarea[placeholder*="Describe your thumbnail"]')
        promptInput?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }

  const enhancePrompt = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first')
      return
    }

    setIsEnhancing(true)
    setError('')

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: uploadedImages.length > 0 
            ? `${prompt} (CRITICAL: User has uploaded ${uploadedImages.length} reference image(s) containing faces that MUST be preserved and featured prominently in the thumbnail.)`
            : prompt,
          style,
          aspectRatio
        })
      })

      const data = await response.json()

      if (data.success) {
        setPrompt(data.data.enhancedPrompt)
      } else {
        setError(data.error || 'Failed to enhance prompt')
      }
    } catch (err) {
      console.error('Error enhancing prompt:', err)
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center animate-fade-in px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            Create <span className="gradient-text">Viral Thumbnails</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600">Generate 3 unique variants in seconds with AI magic</p>
        </div>

        {/* Mode Selector - Responsive Grid on Mobile, Inline on Desktop */}
        <div className="mb-6 sm:mb-8 px-4">
          {/* Desktop View - Horizontal Tabs */}
          <div className="hidden lg:flex justify-center">
            <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => setMode('create')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'create'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="h-5 w-5" />
                Create from Scratch
              </button>
              <button
                onClick={() => setMode('clone')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'clone'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Copy className="h-5 w-5" />
                Clone Thumbnail
              </button>
              <button
                onClick={() => setMode('analyzer')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'analyzer'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Zap className="h-5 w-5" />
                Analyzer
              </button>
              <button
                onClick={() => setMode('extract')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'extract'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="h-5 w-5" />
                Extract Prompt
              </button>
            </div>
          </div>

          {/* Mobile/Tablet View - 2x2 Grid */}
          <div className="lg:hidden grid grid-cols-2 gap-3 max-w-2xl mx-auto">
            <button
              onClick={() => setMode('create')}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold transition-all ${
                mode === 'create'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-500'
              }`}
            >
              <Sparkles className="h-6 w-6" />
              <span className="text-sm">Create</span>
            </button>
            <button
              onClick={() => setMode('clone')}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold transition-all ${
                mode === 'clone'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-500'
              }`}
            >
              <Copy className="h-6 w-6" />
              <span className="text-sm">Clone</span>
            </button>
            <button
              onClick={() => setMode('analyzer')}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold transition-all ${
                mode === 'analyzer'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-500'
              }`}
            >
              <Zap className="h-6 w-6" />
              <span className="text-sm">Analyzer</span>
            </button>
            <button
              onClick={() => setMode('extract')}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold transition-all ${
                mode === 'extract'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-500'
              }`}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Extract</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Generation Form */}
          <div className="space-y-4 sm:space-y-6">
            {/* Mode-specific inputs */}
            {mode === 'clone' && (
              <div className="space-y-4 sm:space-y-6 animate-fade-in">
                <div className="card-gradient p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Clone a Thumbnail</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="label mb-2 text-sm sm:text-base">YouTube Video URL or Thumbnail URL</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <input
                          type="url"
                          value={cloneUrl}
                          onChange={(e) => setCloneUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="input pl-9 sm:pl-10 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      💡 Paste a YouTube video URL or direct thumbnail URL. We'll clone the design and let you customize it!
                    </p>
                  </div>
                </div>

                {/* Image Upload for Clone Mode */}
                <div className="card-gradient p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Upload Your Images</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Replace elements in the cloned thumbnail with your own images
                  </p>
                  
                  {/* Drag & Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
                      isDragOver
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400 bg-white/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        <button
                          type="button"
                          onClick={openFileDialog}
                          className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          Click to upload
                        </button>
                        {' '}<span className="hidden sm:inline">or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB <span className="hidden sm:inline">each </span>(max 5)
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-semibold text-gray-700">
                          Uploaded ({uploadedImages.length}/5)
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 sm:h-24 object-cover rounded-lg sm:rounded-xl border-2 border-gray-200"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 sm:p-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Prompt for Clone Mode */}
                <div className="card-gradient p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize the Clone</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="label">Describe modifications you want</label>
                      <div className="flex items-center space-x-2 text-xs text-blue-600">
                        <Wand2 className="h-3 w-3" />
                        <span>AI Enhancement</span>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g., Replace the person with my image, change text to 'MY NEW TITLE', make it more vibrant..."
                        className="input min-h-[120px] resize-none pr-12"
                        rows={5}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      ✨ Describe what you want to change in the cloned thumbnail. AI will help modify it while keeping the original style.
                    </p>
                  </div>
                </div>

                {/* Options for Clone Mode */}
                <div className="card-gradient p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Options</h3>
                  
                  <div className="space-y-4">
                    {/* Aspect Ratio */}
                    <div>
                      <label className="label mb-3">Aspect Ratio</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['16:9', '1:1', '4:3', '9:16'].map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio as ImageGenerationOptions['aspectRatio'])}
                            className={`px-4 py-3 rounded-xl font-medium transition-all ${
                              aspectRatio === ratio
                                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500'
                            }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size and Quality */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label mb-2">Size</label>
                        <select
                          value={size}
                          onChange={(e) => setSize(e.target.value as ImageGenerationOptions['size'])}
                          className="input"
                        >
                          <option value="small">Small (512px)</option>
                          <option value="medium">Medium (1024px)</option>
                          <option value="large">Large (2048px)</option>
                        </select>
                      </div>
                      <div>
                        <label className="label mb-2">Quality</label>
                        <select
                          value={quality}
                          onChange={(e) => setQuality(e.target.value as ImageGenerationOptions['quality'])}
                          className="input"
                        >
                          <option value="standard">Standard</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button for Clone Mode */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !cloneUrl.trim() || !prompt.trim()}
                    className="btn btn-primary btn-md sm:btn-lg w-full mt-4 sm:mt-6"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span className="text-sm sm:text-base">Cloning...</span>
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">Clone & Modify</span>
                      </>
                    )}
                  </button>

                  {showInsufficientCredits ? (
                    <div ref={insufficientCreditsRef} className="mt-4 animate-fade-in">
                      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8 shadow-lg">
                        <div className="flex flex-col items-center text-center space-y-4">
                          {/* Icon */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                            <CreditCard className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                          </div>
                          
                          {/* Message */}
                          <div className="space-y-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                              Out of Credits! 🎨
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 max-w-md">
                              You've used all your credits. Purchase more credits to continue generating amazing thumbnails!
                            </p>
                          </div>
                          
                          {/* Upgrade Button */}
                          <Link
                            href="/pricing"
                            className="btn btn-primary btn-md sm:btn-lg mt-2 group"
                          >
                            <span>Upgrade Now</span>
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 mt-4">
                      {error}
                    </div>
                  )}
                </div>

                {/* Analysis Results Section */}
                {analysisResult && (
                  <div className="card-gradient p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h3>
                      <p className="text-gray-600">Here's what AI found in your thumbnail</p>
                    </div>
                    
                    <div className="space-y-8 animate-fade-in">
                      {/* Header with New Analysis Button */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">
                          Analysis Results
                        </h3>
                        <button
                          onClick={() => {
                            setAnalysisResult(null)
                            setAnalyzerUrl('')
                            setAnalyzerFile(null)
                            setError('')
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          New Analysis
                        </button>
                      </div>

                      {/* Thumbnail Preview */}
                      {analysisResult.thumbnailUrl && (
                        <div className="relative group">
                          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gradient-to-r from-primary-200 to-secondary-200 bg-gradient-to-r from-primary-50 to-secondary-50 p-2">
                            <img
                              src={analysisResult.thumbnailUrl}
                              alt="Analyzed thumbnail"
                              className="w-full rounded-xl"
                            />
                          </div>
                          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                            Analyzed
                          </div>
                        </div>
                      )}

                      {/* Analysis Sections */}
                      <div className="space-y-6">
                        {/* Overall Score - Enhanced */}
                        {analysisResult.overallScore && (
                          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 border-4 border-primary-200 shadow-2xl">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 pr-8">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                  </div>
                                  <h4 className="text-2xl font-bold text-gray-900">Overall Score</h4>
                                </div>
                                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                  {analysisResult.overallScore >= 8 ? '🎉 Excellent thumbnail design! This will definitely grab attention.' : 
                                   analysisResult.overallScore >= 6 ? '👍 Good design with room for improvement. Some tweaks could make it even better.' : 
                                   '🔧 Needs significant improvements. Let\'s work on enhancing the visual impact.'}
                                </p>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                                    <span>Thumbnail Quality</span>
                                    <span>{analysisResult.overallScore}/10</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                    <div 
                                      className={`h-4 rounded-full transition-all duration-1500 ease-out ${
                                        analysisResult.overallScore >= 8 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                        analysisResult.overallScore >= 6 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                        'bg-gradient-to-r from-red-500 to-red-600'
                                      }`}
                                      style={{ width: `${(analysisResult.overallScore / 10) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl animate-pulse">
                                  <div className="text-center">
                                    <div className="text-4xl font-bold text-white">{analysisResult.overallScore}</div>
                                    <div className="text-sm text-white/80 font-semibold">/10</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quick Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 text-center hover:shadow-lg transition-all duration-300 group">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎨</div>
                            <div className="text-sm font-bold text-gray-800">Colors</div>
                            <div className="text-xs text-blue-600 font-semibold">Analyzed</div>
                          </div>
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 text-center hover:shadow-lg transition-all duration-300 group">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📐</div>
                            <div className="text-sm font-bold text-gray-800">Composition</div>
                            <div className="text-xs text-purple-600 font-semibold">Reviewed</div>
                          </div>
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 text-center hover:shadow-lg transition-all duration-300 group">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                            <div className="text-sm font-bold text-gray-800">Text</div>
                            <div className="text-xs text-green-600 font-semibold">Evaluated</div>
                          </div>
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 text-center hover:shadow-lg transition-all duration-300 group">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💫</div>
                            <div className="text-sm font-bold text-gray-800">Impact</div>
                            <div className="text-xs text-orange-600 font-semibold">Assessed</div>
                          </div>
                        </div>

                        {/* Main Analysis Grid */}
                        <div className="space-y-6">
                          {/* Color Analysis */}
                          {analysisResult.colors && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                  <Palette className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Color Analysis</h4>
                              </div>
                              <div className="space-y-6">
                                <p className="text-gray-700 leading-relaxed">{analysisResult.colors.description}</p>
                                {analysisResult.colors.dominantColors && (
                                  <div className="space-y-4">
                                    <h5 className="font-bold text-gray-800 text-lg">Dominant Colors</h5>
                                    <div className="flex gap-3 flex-wrap">
                                      {analysisResult.colors.dominantColors.map((color: string, idx: number) => (
                                        <div key={idx} className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                          <div 
                                            className="w-6 h-6 rounded-full border-3 border-white shadow-lg group-hover:scale-110 transition-transform" 
                                            style={{ backgroundColor: color }}
                                          />
                                          <span className="text-sm font-bold text-gray-700 font-mono">{color}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Composition */}
                          {analysisResult.composition && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Composition</h4>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-lg">{analysisResult.composition}</p>
                            </div>
                          )}

                          {/* Text Elements */}
                          {analysisResult.textElements && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                  <span className="text-2xl">📝</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Text Elements</h4>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-lg">{analysisResult.textElements}</p>
                            </div>
                          )}

                          {/* Emotion & Impact */}
                          {analysisResult.emotion && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 border-4 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                                  <span className="text-2xl">💫</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Emotional Impact</h4>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-lg">{analysisResult.emotion}</p>
                            </div>
                          )}
                        </div>

                        {/* Strengths and Improvements Row */}
                        <div className="space-y-6">
                          {/* Strengths */}
                          {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                  <CheckCircle2 className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-green-900">What's Working Well</h4>
                              </div>
                              <ul className="space-y-4">
                                {analysisResult.strengths.map((strength: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 hover:bg-white/90 transition-all duration-300 hover:scale-105">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    <span className="text-green-800 font-semibold text-base leading-relaxed">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Improvements */}
                          {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                                  <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-amber-900">Areas for Improvement</h4>
                              </div>
                              <ul className="space-y-4">
                                {analysisResult.improvements.map((improvement: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 hover:bg-white/90 transition-all duration-300 hover:scale-105">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                                      <Sparkles className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <span className="text-amber-800 font-semibold text-base leading-relaxed">{improvement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* Create Mode Form */}
            {mode === 'create' && (
              <div className="card-gradient p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Create Your Thumbnail
                </h2>

                  {/* Image Upload Section */}
                  <div className="space-y-4 mb-6">
                  <label className="label">Upload Reference Images (Optional)</label>
                    
                    {/* Drag & Drop Area */}
                    <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        isDragOver
                          ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400 bg-white/50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-primary-600" />
                      </div>
                        <div className="text-sm text-gray-600">
                          <button
                            type="button"
                            onClick={openFileDialog}
                          className="text-primary-600 hover:text-primary-700 font-semibold"
                          >
                            Click to upload
                          </button>
                          {' '}or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB each (max 5 images)
                        </p>
                      </div>
                    </div>

                    {/* Uploaded Images Preview */}
                    {uploadedImages.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">
                            Uploaded Images ({uploadedImages.length}/5)
                          </p>
                        </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-xl border-2 border-gray-200"
                              />
                              <button
                                onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                              <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prompt Input */}
              <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between">
                      <label className="label">Describe your thumbnail</label>
                  <div className="flex items-center space-x-2 text-xs text-primary-600">
                        <Wand2 className="h-3 w-3" />
                    <span>AI Enhancement</span>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A professional tech review thumbnail with bold text space, vibrant colors, and modern design..."
                    className="input min-h-[120px] resize-none pr-12"
                    rows={5}
                      />
                      <button
                        onClick={enhancePrompt}
                        disabled={isEnhancing || !prompt.trim()}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Enhance prompt with AI"
                      >
                        {isEnhancing ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                      <Wand2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

              {/* Options */}
              <div className="space-y-4 mb-6">
              {/* Aspect Ratio */}
                <div>
                  <label className="label mb-3">Aspect Ratio</label>
                  <div className="grid grid-cols-4 gap-2">
                  {['16:9', '1:1', '4:3', '9:16'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio as ImageGenerationOptions['aspectRatio'])}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          aspectRatio === ratio
                            ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size and Quality */}
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label mb-2">Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as ImageGenerationOptions['size'])}
                    className="input"
                  >
                    <option value="small">Small (512px)</option>
                    <option value="medium">Medium (1024px)</option>
                    <option value="large">Large (2048px)</option>
                  </select>
                </div>
                  <div>
                    <label className="label mb-2">Quality</label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as ImageGenerationOptions['quality'])}
                    className="input"
                  >
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                  </select>
                </div>
                </div>

                {/* Generate Variants Toggle - Only show for Create mode */}
                {mode === 'create' && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100">
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary-600" />
                        Generate 3 Style Variants
                      </h3>
                      <p className="text-sm text-gray-600">Realistic, Artistic, Professional</p>
                    </div>
                    <button
                      onClick={() => setGenerateVariants(!generateVariants)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        generateVariants ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          generateVariants ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="btn btn-primary btn-md sm:btn-lg w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    <span className="text-sm sm:text-base">{`Generating${generateVariants ? ' 3...' : '...'}`}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">{`Generate${generateVariants ? ' 3 Variants' : ''}`}</span>
                  </>
                )}
              </button>

              {showInsufficientCredits ? (
                <div ref={insufficientCreditsRef} className="mt-4 animate-fade-in">
                  <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8 shadow-lg">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Icon */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <CreditCard className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      
                      {/* Message */}
                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          Out of Credits! 🎨
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 max-w-md">
                          You've used all your credits. Purchase more credits to continue generating amazing thumbnails!
                        </p>
                      </div>
                      
                      {/* Upgrade Button */}
                      <Link
                        href="/pricing"
                        className="btn btn-primary btn-md sm:btn-lg mt-2 group"
                      >
                        <span>Upgrade Now</span>
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 mt-4">
                  {error}
                </div>
              )}
              </div>
            )}

            {/* Analyzer Mode */}
            {mode === 'analyzer' && (
              <div className="space-y-8 animate-fade-in">
                {/* Analyzer Input Section */}
                <div className="card-gradient p-8">
                  {/* Header Section */}
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-100 to-primary-100 flex items-center justify-center animate-float">
                      <Zap className="h-10 w-10 text-accent-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Thumbnail Analyzer</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Get detailed insights on your thumbnail design, colors, composition, and optimization opportunities
                    </p>
                  </div>

                  {/* Upload Method Selector */}
                  <div className="flex gap-3 p-2 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 mb-8">
                    <button
                      onClick={() => setAnalyzerUploadMethod('url')}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        analyzerUploadMethod === 'url'
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg transform scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500 hover:shadow-md'
                      }`}
                    >
                      <LinkIcon className="h-5 w-5 inline mr-2" />
                      Paste URL
                    </button>
                    <button
                      onClick={() => setAnalyzerUploadMethod('upload')}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        analyzerUploadMethod === 'upload'
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg transform scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500 hover:shadow-md'
                      }`}
                    >
                      <Upload className="h-5 w-5 inline mr-2" />
                      Upload File
                    </button>
                  </div>

                  {/* URL Input */}
                  {analyzerUploadMethod === 'url' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <label className="text-lg font-semibold text-gray-800 mb-2 block">Paste Your Thumbnail URL</label>
                        <p className="text-sm text-gray-600">YouTube video URL or direct image URL</p>
                      </div>
                      <div className="relative group">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="url"
                          value={analyzerUrl}
                          onChange={(e) => setAnalyzerUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=... or https://i.ytimg.com/vi/..."
                          className="input pl-12 h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Supports YouTube URLs and direct image links</span>
                      </div>
                    </div>
                  )}

                  {/* File Upload */}
                  {analyzerUploadMethod === 'upload' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <label className="text-lg font-semibold text-gray-800 mb-2 block">Upload Your Thumbnail</label>
                        <p className="text-sm text-gray-600">Drag and drop or click to browse</p>
                      </div>
                      <div
                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                          isDragOver
                            ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-secondary-50 scale-105'
                            : 'border-gray-300 hover:border-primary-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-primary-50 bg-white/50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragOver(false)
                          const files = Array.from(e.dataTransfer.files).filter(file => 
                            file.type.startsWith('image/')
                          )
                          if (files.length > 0) {
                            setAnalyzerFile(files[0])
                          }
                        }}
                      >
                        <input
                          ref={analyzerFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files
                            if (files && files.length > 0) {
                              setAnalyzerFile(files[0])
                            }
                          }}
                          className="hidden"
                        />
                        
                        {analyzerFile ? (
                          <div className="space-y-4">
                            <div className="relative inline-block group">
                              <img
                                src={URL.createObjectURL(analyzerFile)}
                                alt="Selected thumbnail"
                                className="max-h-64 rounded-2xl border-4 border-primary-200 shadow-lg group-hover:shadow-xl transition-shadow"
                              />
                              <button
                                onClick={() => setAnalyzerFile(null)}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
                              <p className="text-sm font-semibold text-gray-700">{analyzerFile.name}</p>
                              <p className="text-xs text-gray-500">{(analyzerFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-accent-100 to-primary-100 flex items-center justify-center animate-float">
                              <Upload className="h-10 w-10 text-accent-600" />
                            </div>
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => analyzerFileInputRef.current?.click()}
                                className="text-primary-600 hover:text-primary-700 font-semibold text-lg transition-colors"
                              >
                                Click to upload
                              </button>
                              <p className="text-gray-600">or drag and drop your image here</p>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                PNG, JPG, GIF
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Up to 10MB
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Analyze Button */}
                  <div className="mt-8">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || (analyzerUploadMethod === 'url' && !analyzerUrl.trim()) || (analyzerUploadMethod === 'upload' && !analyzerFile)}
                      className="w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: isAnalyzing 
                          ? 'linear-gradient(135deg, #0ea5e9, #d946ef, #f97316)' 
                          : 'linear-gradient(135deg, #0284c7, #c026d3)'
                      }}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 opacity-75 animate-pulse"></div>
                          <div className="relative flex items-center justify-center text-white">
                            <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                            <span className="animate-pulse">AI is analyzing your thumbnail...</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                          <Zap className="mr-3 h-6 w-6" />
                          <span>Analyze Thumbnail with AI</span>
                        </div>
                      )}
                    </button>
                    
                    {/* Features List */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 rounded-xl bg-white/50 border border-gray-200">
                        <div className="text-lg mb-1">🎨</div>
                        <div className="text-xs font-semibold text-gray-700">Color Analysis</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/50 border border-gray-200">
                        <div className="text-lg mb-1">📐</div>
                        <div className="text-xs font-semibold text-gray-700">Composition</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/50 border border-gray-200">
                        <div className="text-lg mb-1">📝</div>
                        <div className="text-xs font-semibold text-gray-700">Text Review</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/50 border border-gray-200">
                        <div className="text-lg mb-1">💡</div>
                        <div className="text-xs font-semibold text-gray-700">Tips</div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 mt-4">
                      {error}
                    </div>
                  )}
                </div>

                {/* Analysis Results Section */}
                {analysisResult && (
                  <div className="card-gradient p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h3>
                      <p className="text-gray-600">Here's what AI found in your thumbnail</p>
                    </div>
                    
                    <div className="space-y-8 animate-fade-in">
                      {/* Header with New Analysis Button */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">
                          Analysis Results
                        </h3>
                        <button
                          onClick={() => {
                            setAnalysisResult(null)
                            setAnalyzerUrl('')
                            setAnalyzerFile(null)
                            setError('')
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          New Analysis
                        </button>
                      </div>

                      {/* Thumbnail Preview */}
                      {analysisResult.thumbnailUrl && (
                        <div className="relative group">
                          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gradient-to-r from-primary-200 to-secondary-200 bg-gradient-to-r from-primary-50 to-secondary-50 p-2">
                            <img
                              src={analysisResult.thumbnailUrl}
                              alt="Analyzed thumbnail"
                              className="w-full rounded-xl"
                            />
                          </div>
                          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                            Analyzed
                          </div>
                        </div>
                      )}

                      {/* Analysis Sections */}
                      <div className="space-y-6">
                        {/* Overall Score - Enhanced */}
                        {analysisResult.overallScore && (
                          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 border-4 border-primary-200 shadow-2xl">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 pr-8">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                  </div>
                                  <h4 className="text-2xl font-bold text-gray-900">Overall Score</h4>
                                </div>
                                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                  {analysisResult.overallScore >= 8 ? '🎉 Excellent thumbnail design! This will definitely grab attention.' : 
                                   analysisResult.overallScore >= 6 ? '👍 Good design with room for improvement. Some tweaks could make it even better.' : 
                                   '🔧 Needs significant improvements. Let\'s work on enhancing the visual impact.'}
                                </p>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                                    <span>Thumbnail Quality</span>
                                    <span>{analysisResult.overallScore}/10</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                    <div 
                                      className={`h-4 rounded-full transition-all duration-1500 ease-out ${
                                        analysisResult.overallScore >= 8 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                        analysisResult.overallScore >= 6 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                        'bg-gradient-to-r from-red-500 to-red-600'
                                      }`}
                                      style={{ width: `${(analysisResult.overallScore / 10) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl animate-pulse">
                                  <div className="text-center">
                                    <div className="text-4xl font-bold text-white">{analysisResult.overallScore}</div>
                                    <div className="text-sm text-white/80 font-semibold">/10</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quick Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 text-center hover:shadow-lg transition-all duration-300 group">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎨</div>
                            <div className="text-sm font-bold text-gray-800">Colors</div>
                            <div className="text-xs text-blue-600 font-semibold">Analyzed</div>
                          </div>
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 text-center hover:shadow-lg transition-all duration-300 group">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📐</div>
                            <div className="text-sm font-bold text-gray-800">Composition</div>
                            <div className="text-xs text-purple-600 font-semibold">Reviewed</div>
                          </div>
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 text-center hover:shadow-lg transition-all duration-300 group">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                            <div className="text-sm font-bold text-gray-800">Text</div>
                            <div className="text-xs text-green-600 font-semibold">Evaluated</div>
                          </div>
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 text-center hover:shadow-lg transition-all duration-300 group">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💫</div>
                            <div className="text-sm font-bold text-gray-800">Impact</div>
                            <div className="text-xs text-orange-600 font-semibold">Assessed</div>
                          </div>
                        </div>

                        {/* Main Analysis Grid */}
                        <div className="space-y-6">
                          {/* Color Analysis */}
                          {analysisResult.colors && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                  <Palette className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Color Analysis</h4>
                              </div>
                              <div className="space-y-6">
                                <p className="text-gray-700 leading-relaxed">{analysisResult.colors.description}</p>
                                {analysisResult.colors.dominantColors && (
                                  <div className="space-y-4">
                                    <h5 className="font-bold text-gray-800 text-lg">Dominant Colors</h5>
                                    <div className="flex gap-3 flex-wrap">
                                      {analysisResult.colors.dominantColors.map((color: string, idx: number) => (
                                        <div key={idx} className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                          <div 
                                            className="w-6 h-6 rounded-full border-3 border-white shadow-lg group-hover:scale-110 transition-transform" 
                                            style={{ backgroundColor: color }}
                                          />
                                          <span className="text-sm font-bold text-gray-700 font-mono">{color}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Composition */}
                          {analysisResult.composition && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Composition</h4>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-lg">{analysisResult.composition}</p>
                            </div>
                          )}

                          {/* Text Elements */}
                          {analysisResult.textElements && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                  <span className="text-2xl">📝</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Text Elements</h4>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-lg">{analysisResult.textElements}</p>
                            </div>
                          )}

                          {/* Emotion & Impact */}
                          {analysisResult.emotion && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 border-4 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                                  <span className="text-2xl">💫</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Emotional Impact</h4>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-lg">{analysisResult.emotion}</p>
                            </div>
                          )}
                        </div>

                        {/* Strengths and Improvements Row */}
                        <div className="space-y-6">
                          {/* Strengths */}
                          {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                  <CheckCircle2 className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-green-900">What's Working Well</h4>
                              </div>
                              <ul className="space-y-4">
                                {analysisResult.strengths.map((strength: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 hover:bg-white/90 transition-all duration-300 hover:scale-105">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    <span className="text-green-800 font-semibold text-base leading-relaxed">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Improvements */}
                          {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                                  <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-amber-900">Areas for Improvement</h4>
                              </div>
                              <ul className="space-y-4">
                                {analysisResult.improvements.map((improvement: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 hover:bg-white/90 transition-all duration-300 hover:scale-105">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                                      <Sparkles className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <span className="text-amber-800 font-semibold text-base leading-relaxed">{improvement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State for Analyzer */}
                {!analysisResult && (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gradient-to-br from-gray-50 to-white hover:border-primary-300 transition-colors">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-100 to-primary-100 flex items-center justify-center animate-float">
                      <Zap className="h-12 w-12 text-accent-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Ready to Analyze</h4>
                    <p className="text-gray-500 mb-4">Upload or provide a URL to analyze a thumbnail</p>
                    <p className="text-sm text-gray-400 mb-6">Get AI-powered insights on design, colors, and composition</p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Color Analysis</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Composition Review</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Text Evaluation</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Improvement Tips</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Extract Prompt Mode */}
            {mode === 'extract' && (
              <div className="space-y-8 animate-fade-in">
                {/* Extract Input Section */}
                <div className="card-gradient p-8">
                  {/* Header Section */}
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center animate-float">
                      <FileText className="h-10 w-10 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Prompt Extraction</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Upload a thumbnail and get a detailed, reusable prompt to generate similar designs
                    </p>
                  </div>

                  {/* Upload Method Selector */}
                  <div className="flex gap-3 p-2 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 mb-8">
                    <button
                      onClick={() => setExtractUploadMethod('url')}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        extractUploadMethod === 'url'
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg transform scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500 hover:shadow-md'
                      }`}
                    >
                      <LinkIcon className="h-5 w-5 inline mr-2" />
                      Paste URL
                    </button>
                    <button
                      onClick={() => setExtractUploadMethod('upload')}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        extractUploadMethod === 'upload'
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg transform scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500 hover:shadow-md'
                      }`}
                    >
                      <Upload className="h-5 w-5 inline mr-2" />
                      Upload File
                    </button>
                  </div>

                  {/* URL Input */}
                  {extractUploadMethod === 'url' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <label className="text-lg font-semibold text-gray-800 mb-2 block">Paste Your Thumbnail URL</label>
                        <p className="text-sm text-gray-600">YouTube video URL or direct image URL</p>
                      </div>
                      <div className="relative group">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="url"
                          value={extractUrl}
                          onChange={(e) => setExtractUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=... or https://i.ytimg.com/vi/..."
                          className="input pl-12 h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Supports YouTube URLs and direct image links</span>
                      </div>
                    </div>
                  )}

                  {/* File Upload */}
                  {extractUploadMethod === 'upload' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <label className="text-lg font-semibold text-gray-800 mb-2 block">Upload Your Thumbnail</label>
                        <p className="text-sm text-gray-600">Drag and drop or click to browse</p>
                      </div>
                      <div
                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                          isDragOver
                            ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-secondary-50 scale-105'
                            : 'border-gray-300 hover:border-primary-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-primary-50 bg-white/50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragOver(false)
                          const files = Array.from(e.dataTransfer.files).filter(file => 
                            file.type.startsWith('image/')
                          )
                          if (files.length > 0) {
                            setExtractFile(files[0])
                          }
                        }}
                      >
                        <input
                          ref={extractFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files
                            if (files && files.length > 0) {
                              setExtractFile(files[0])
                            }
                          }}
                          className="hidden"
                        />
                        
                        {extractFile ? (
                          <div className="space-y-4">
                            <div className="relative inline-block group">
                              <img
                                src={URL.createObjectURL(extractFile)}
                                alt="Selected thumbnail"
                                className="max-h-64 rounded-2xl border-4 border-primary-200 shadow-lg group-hover:shadow-xl transition-shadow"
                              />
                              <button
                                onClick={() => setExtractFile(null)}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
                              <p className="text-sm font-semibold text-gray-700">{extractFile.name}</p>
                              <p className="text-xs text-gray-500">{(extractFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center animate-float">
                              <Upload className="h-10 w-10 text-purple-600" />
                            </div>
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => extractFileInputRef.current?.click()}
                                className="text-primary-600 hover:text-primary-700 font-semibold text-lg transition-colors"
                              >
                                Click to upload
                              </button>
                              <p className="text-gray-600">or drag and drop your image here</p>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                PNG, JPG, GIF
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Up to 10MB
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Save to Library Toggle */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Save to Public Library</p>
                          <p className="text-sm text-gray-600">Share this prompt with the community</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSaveToLibrary(!saveToLibrary)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          saveToLibrary ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            saveToLibrary ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                  </div>

                  {/* Extract Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleExtractPrompt}
                      disabled={isExtracting || (extractUploadMethod === 'url' && !extractUrl.trim()) || (extractUploadMethod === 'upload' && !extractFile)}
                      className="w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: isExtracting 
                          ? 'linear-gradient(135deg, #0ea5e9, #d946ef, #f97316)' 
                          : 'linear-gradient(135deg, #7c3aed, #6366f1)'
                      }}
                    >
                      {isExtracting ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-75 animate-pulse"></div>
                          <div className="relative flex items-center justify-center text-white">
                            <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                            <span className="animate-pulse">AI is extracting prompt...</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                          <FileText className="mr-3 h-6 w-6" />
                          <span>Extract Prompt</span>
                        </div>
                      )}
                    </button>
                    
                    {/* Features List */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 rounded-xl bg-white/50 border border-gray-200">
                        <div className="text-lg mb-1">🎯</div>
                        <div className="text-xs font-semibold text-gray-700">Subject</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/50 border border-gray-200">
                        <div className="text-lg mb-1">🎨</div>
                        <div className="text-xs font-semibold text-gray-700">Style</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/50 border border-gray-200">
                        <div className="text-lg mb-1">📐</div>
                        <div className="text-xs font-semibold text-gray-700">Composition</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/50 border border-gray-200">
                        <div className="text-lg mb-1">✨</div>
                        <div className="text-xs font-semibold text-gray-700">Reusable</div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 mt-4">
                      {error}
                    </div>
                  )}
                </div>

                {/* Extracted Prompt Display */}
                {extractedPrompt && (
                  <div className="card-gradient p-8 animate-fade-in">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Prompt Extracted Successfully!</h3>
                      <p className="text-gray-600">Use this prompt to generate similar thumbnails</p>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <button
                          onClick={() => copyPromptToClipboard(extractedPrompt)}
                          className="flex-1 btn btn-outline"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Prompt
                        </button>
                        <button
                          onClick={useExtractedPrompt}
                          className="flex-1 btn btn-primary"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Use This Prompt
                        </button>
                      </div>

                      {/* Prompt Display */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-4 border-primary-200 shadow-xl">
                          <div className="prose max-w-none">
                            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                              {extractedPrompt}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border-2 border-primary-200">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Ready to generate?</p>
                          <p className="text-xs text-gray-600">Click "Use This Prompt" to start creating</p>
                        </div>
                        <button
                          onClick={() => {
                            setExtractedPrompt(null)
                            setExtractUrl('')
                            setExtractFile(null)
                            setError('')
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Extract Another
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!extractedPrompt && (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gradient-to-br from-gray-50 to-white hover:border-primary-300 transition-colors">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center animate-float">
                      <FileText className="h-12 w-12 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Ready to Extract Prompt</h4>
                    <p className="text-gray-500 mb-4">Upload or provide a URL to extract a generative prompt</p>
                    <p className="text-sm text-gray-400 mb-6">Get a detailed, reusable prompt that can generate similar thumbnails</p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Structured Format</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Detailed Analysis</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Reusable Prompt</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Copy & Use</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Generated Images Preview */}
          <div className="space-y-4 sm:space-y-6">
            {mode !== 'analyzer' && mode !== 'extract' && (
              /* Generated Images Preview */
              <div className="card-gradient p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {generateVariants ? 'Your 3 Variants' : 'Preview'}
                </h3>
                
                {generatedImages.length > 0 ? (
                <div className="space-y-4">
                  {generatedImages.map((image, index) => (
                    <div key={index} className="animate-fade-in">
                      <div className="relative rounded-xl overflow-hidden shadow-xl group">
                        <img
                          src={image.url}
                          alt={`Generated thumbnail ${index + 1}`}
                          className="w-full"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-2 sm:space-y-3">
                            {generateVariants && (
                              <div className="flex gap-2">
                                <span className="px-2 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold capitalize">
                                  {image.variantStyle || image.style}
                                </span>
                                <span className="px-2 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                                  {image.aspectRatio}
                                </span>
                          </div>
                        )}
                            <div className="flex gap-2">
                    <button
                                onClick={() => handleDownload(image.url, index)}
                                className="flex-1 btn btn-primary btn-sm flex items-center justify-center"
                    >
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Download</span>
                    </button>
                    <button
                                onClick={() => handlePreview(image.url)}
                                className="btn btn-outline btn-sm bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 px-2 sm:px-3"
                    >
                                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                            </div>
                          </div>
                  </div>
                  
                        {/* Top badges */}
                        {!generateVariants && (
                          <>
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-bold">
                              {image.aspectRatio}
                  </div>
                            {image.facePreservation?.active && (
                              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary-600 text-white text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Face Preserved
                              </div>
                            )}
                          </>
                        )}
                      </div>
                  </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-white/50">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-primary-600" />
                  </div>
                  <p className="text-gray-500 mb-2">Your generated thumbnails will appear here</p>
                  {generateVariants && (
                    <p className="text-sm text-gray-400">3 unique variants in different styles</p>
                  )}
                </div>
              )}
              </div>
            )}

            {/* Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-600" />
                Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Enable "Generate 3 Variants" to get multiple style options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Upload reference images for better face preservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Use AI Enhancement for better prompt quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Try different aspect ratios for various platforms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Extract Loading Overlay */}
      {isExtracting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md">
          <div className="max-w-md w-full mx-4 text-center space-y-8">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 animate-ping"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-30 animate-pulse"></div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl">
                  <FileText className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white animate-pulse">
                Extracting Prompt
              </h3>
              <p className="text-purple-200 text-sm">
                AI is analyzing the thumbnail and generating a detailed prompt...
              </p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-purple-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-purple-100 text-sm">
                Processing image and generating structured prompt...
              </p>
            </div>

            {/* Fun Facts */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-purple-100 text-sm leading-relaxed">
                📝 <strong>Pro Tip:</strong> The extracted prompt follows a structured format with Main Subject, Visual Style, Composition, Text Elements, and Mood - perfect for generating similar thumbnails!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analyzer Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-primary-900/95 to-secondary-900/95 backdrop-blur-md">
          <div className="max-w-md w-full mx-4 text-center space-y-8">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-accent-500 to-primary-500 opacity-20 animate-ping"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent-500 to-primary-500 opacity-30 animate-pulse"></div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent-600 to-primary-600 flex items-center justify-center shadow-2xl">
                  <Zap className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white animate-pulse">
                Analyzing Thumbnail
              </h3>
              <p className="text-accent-200 text-sm">
                AI is examining colors, composition, and design elements...
              </p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-accent-300">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-accent-100 text-sm">
                Processing image data and generating insights...
              </p>
            </div>

            {/* Fun Facts */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-accent-100 text-sm leading-relaxed">
                🔍 <strong>Pro Tip:</strong> Great thumbnails use high contrast colors, clear focal points, and bold text to grab attention in crowded feeds!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-primary-900/95 to-secondary-900/95 backdrop-blur-md">
          <div className="max-w-md w-full mx-4 text-center space-y-8">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-20 animate-ping"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-30 animate-pulse"></div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center shadow-2xl">
                  <Sparkles className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white animate-pulse">
                {loadingMessage}
              </h3>
              <p className="text-primary-200 text-sm">
                {mode === 'clone' 
                  ? 'Cloning the design and applying your modifications...'
                  : generateVariants 
                    ? 'Creating 3 unique style variants for you...' 
                    : 'AI is crafting your perfect thumbnail...'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${loadingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <p className="text-primary-300 text-sm font-medium">
                {loadingProgress}% Complete
              </p>
            </div>

            {/* Loading Spinner */}
            <div className="flex justify-center space-x-2">
              <Loader2 className="h-5 w-5 text-primary-400 animate-spin" />
              <Loader2 className="h-5 w-5 text-secondary-400 animate-spin" style={{ animationDelay: '0.15s' }} />
              <Loader2 className="h-5 w-5 text-accent-400 animate-spin" style={{ animationDelay: '0.3s' }} />
            </div>

            {/* Fun Facts */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-primary-100 text-sm leading-relaxed">
                {mode === 'clone' ? (
                  <>💡 <strong>Pro Tip:</strong> When cloning thumbnails, focus on maintaining the style while adding your unique branding and message!</>
                ) : (
                  <>💡 <strong>Pro Tip:</strong> Great thumbnails use high contrast colors and clear focal points to grab attention in crowded feeds!</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={closePreview}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={closePreview}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center shadow-lg z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const index = generatedImages.findIndex(img => img.url === previewImage)
                  handleDownload(previewImage, index)
                }}
                className="btn btn-primary btn-md"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </button>
              <button
                onClick={closePreview}
                className="btn btn-outline btn-md bg-white text-gray-900 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h3>
              <p className="text-gray-600 mb-6">
                Please sign in to start generating amazing thumbnails with AI. It's free to get started with 3 credits!
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/signup"
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Sign Up - Get 3 Free Credits
                </Link>
                <Link
                  href="/auth/signin"
                  className="btn btn-outline w-full"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
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
