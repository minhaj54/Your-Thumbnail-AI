'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Download, RefreshCw, Settings, Palette, Monitor, Wand2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { UpgradeModal } from '@/components/UpgradeModal'

type ImageGenerationOptions = {
  style?: 'realistic' | 'artistic' | 'minimalist' | 'vibrant' | 'professional'
  aspectRatio?: '16:9' | '1:1' | '4:3' | '9:16' | '21:9'
  size?: 'small' | 'medium' | 'large'
  quality?: 'standard' | 'high'
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<ImageGenerationOptions['style']>('professional')
  const [aspectRatio, setAspectRatio] = useState<ImageGenerationOptions['aspectRatio']>('16:9')
  const [size, setSize] = useState<ImageGenerationOptions['size']>('medium')
  const [quality, setQuality] = useState<ImageGenerationOptions['quality']>('high')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<any>(null)
  const [error, setError] = useState('')
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
    }
  }

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
      setUploadedImages(prev => [...prev, ...files].slice(0, 5)) // Max 5 images
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      setUploadedImages(prev => [...prev, ...files].slice(0, 5)) // Max 5 images
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    if (credits === null || credits <= 0) {
      setShowUpgradeModal(true)
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedImage(null)

    try {
      // Prepare form data for image upload
      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('style', style || 'professional')
      formData.append('aspectRatio', aspectRatio || '16:9')
      formData.append('size', size || 'medium')
      formData.append('quality', quality || 'high')
      
      // Add uploaded images
      uploadedImages.forEach((file, index) => {
        formData.append(`images`, file)
      })

      // Use face preservation API if images are uploaded, otherwise use regular API
      const apiEndpoint = uploadedImages.length > 0 
        ? '/api/generate/face-preservation'
        : '/api/generate/image'

      console.log(`🎭 Using ${uploadedImages.length > 0 ? 'face preservation' : 'regular'} API`)

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedImage(data.data)
        setCredits(data.credits_remaining)
        if (uploadedImages.length > 0) {
          console.log('🎭 Face preservation image generated successfully!')
        }
        // Clear any previous errors
        setError('')
      } else {
        if (data.upgradeRequired) {
          setShowUpgradeModal(true)
        } else {
          setError(data.error || 'Failed to generate image')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage?.url) {
      const link = document.createElement('a')
      link.href = generatedImage.url
      link.download = `thumbnail-${generatedImage.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
      // Use Gemini AI for intelligent prompt enhancement
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: uploadedImages.length > 0 
            ? `${prompt} (CRITICAL: User has uploaded ${uploadedImages.length} reference image(s) containing faces that MUST be preserved and featured prominently in the thumbnail. The face should be the primary focus and maintain the person's identity and facial features exactly as shown in the uploaded images.)`
            : prompt,
          style,
          aspectRatio
        })
      })

      const data = await response.json()

      if (data.success) {
        setPrompt(data.data.enhancedPrompt)
        if (data.data.fallback) {
          console.log('Using fallback enhancement due to API issues')
        }
      } else {
        setError(data.error || 'Failed to enhance prompt')
      }
    } catch (err) {
      console.error('Error enhancing prompt:', err)
      // Fallback to local enhancement
      const fallbackEnhanced = enhancePromptForThumbnail(prompt, style, aspectRatio)
      setPrompt(fallbackEnhanced)
    } finally {
      setIsEnhancing(false)
    }
  }

  const enhancePromptForThumbnail = (originalPrompt: string, style: string, aspectRatio: string): string => {
    const prompt = originalPrompt.trim().toLowerCase()
    
    // AI Prompt Enhancer - Transform simple prompts into powerful, detailed ones
    const enhancedPrompt = enhancePromptWithAI(originalPrompt, style, aspectRatio)
    
    return enhancedPrompt
  }

  const enhancePromptWithAI = (originalPrompt: string, style: string, aspectRatio: string): string => {
    const prompt = originalPrompt.trim()
    const lowerPrompt = prompt.toLowerCase()
    
    // Detect the type of content and enhance accordingly
    if (lowerPrompt.includes('thumbnail') || lowerPrompt.includes('youtube') || lowerPrompt.includes('video')) {
      return enhanceThumbnailPrompt(prompt, style, aspectRatio)
    }
    
    if (lowerPrompt.includes('logo') || lowerPrompt.includes('brand') || lowerPrompt.includes('design')) {
      return enhanceDesignPrompt(prompt, style, aspectRatio)
    }
    
    if (lowerPrompt.includes('portrait') || lowerPrompt.includes('person') || lowerPrompt.includes('face')) {
      return enhancePortraitPrompt(prompt, style, aspectRatio)
    }
    
    if (lowerPrompt.includes('landscape') || lowerPrompt.includes('nature') || lowerPrompt.includes('scenery')) {
      return enhanceLandscapePrompt(prompt, style, aspectRatio)
    }
    
    if (lowerPrompt.includes('abstract') || lowerPrompt.includes('art') || lowerPrompt.includes('creative')) {
      return enhanceAbstractPrompt(prompt, style, aspectRatio)
    }
    
    // Default enhancement for general prompts
    return enhanceGeneralPrompt(prompt, style, aspectRatio)
  }

  const enhanceThumbnailPrompt = (prompt: string, style: string, aspectRatio: string): string => {
    const styleDescriptors = {
      realistic: 'ultra-realistic photography with sharp focus and natural lighting',
      artistic: 'creative artistic composition with unique visual flair and dynamic elements',
      minimalist: 'clean minimalist design with elegant simplicity and strategic negative space',
      vibrant: 'vibrant high-contrast imagery with bold colors and energetic composition',
      professional: 'polished professional presentation with corporate-grade quality and clean aesthetics'
    }

    const aspectRatioContext = {
      '16:9': 'widescreen format perfect for YouTube thumbnails',
      '1:1': 'square format ideal for social media posts and Instagram',
      '4:3': 'traditional format great for presentations and web content',
      '9:16': 'vertical format perfect for mobile stories and TikTok',
      '21:9': 'ultra-wide cinematic format for premium displays'
    }

    const styleDesc = styleDescriptors[style as keyof typeof styleDescriptors] || styleDescriptors.professional
    const aspectDesc = aspectRatioContext[aspectRatio as keyof typeof aspectRatioContext] || aspectRatioContext['16:9']

    return `Create a high-impact ${aspectDesc} thumbnail featuring ${prompt} — designed with ${styleDesc}, bold typography space, vibrant contrast, and a clear focal point that demands attention and drives clicks.`
  }

  const enhanceDesignPrompt = (prompt: string, style: string, aspectRatio: string): string => {
    const styleDescriptors = {
      realistic: 'photorealistic rendering with precise details and natural lighting',
      artistic: 'creative artistic interpretation with unique visual elements and expressive style',
      minimalist: 'clean minimalist design with elegant simplicity and strategic composition',
      vibrant: 'bold vibrant design with dynamic colors and energetic visual impact',
      professional: 'polished professional design with corporate-grade quality and refined aesthetics'
    }

    const styleDesc = styleDescriptors[style as keyof typeof styleDescriptors] || styleDescriptors.professional

    return `Design a ${styleDesc} ${prompt} — featuring modern aesthetics, perfect typography, balanced composition, and visual elements that communicate clearly and effectively.`
  }

  const enhancePortraitPrompt = (prompt: string, style: string, aspectRatio: string): string => {
    const styleDescriptors = {
      realistic: 'ultra-realistic portrait photography with natural lighting and sharp focus',
      artistic: 'artistic portrait with creative composition and expressive visual style',
      minimalist: 'clean minimalist portrait with elegant simplicity and strategic lighting',
      vibrant: 'vibrant portrait with bold colors and dynamic visual impact',
      professional: 'polished professional portrait with corporate-grade quality and refined presentation'
    }

    const styleDesc = styleDescriptors[style as keyof typeof styleDescriptors] || styleDescriptors.realistic

    return `Create a ${styleDesc} portrait of ${prompt} — captured with perfect lighting, engaging expression, and composition that draws the viewer's attention and creates emotional connection.`
  }

  const enhanceLandscapePrompt = (prompt: string, style: string, aspectRatio: string): string => {
    const styleDescriptors = {
      realistic: 'ultra-realistic landscape photography with natural lighting and breathtaking detail',
      artistic: 'artistic landscape with creative composition and expressive visual interpretation',
      minimalist: 'clean minimalist landscape with elegant simplicity and strategic composition',
      vibrant: 'vibrant landscape with bold colors and dynamic natural lighting',
      professional: 'polished professional landscape with corporate-grade quality and refined presentation'
    }

    const styleDesc = styleDescriptors[style as keyof typeof styleDescriptors] || styleDescriptors.realistic

    return `Capture a ${styleDesc} landscape of ${prompt} — featuring dramatic lighting, perfect composition, and natural beauty that creates a sense of wonder and emotional impact.`
  }

  const enhanceAbstractPrompt = (prompt: string, style: string, aspectRatio: string): string => {
    const styleDescriptors = {
      realistic: 'ultra-realistic abstract art with precise details and natural lighting',
      artistic: 'creative abstract composition with unique visual elements and expressive style',
      minimalist: 'clean minimalist abstract design with elegant simplicity and strategic composition',
      vibrant: 'vibrant abstract art with bold colors and dynamic visual impact',
      professional: 'polished professional abstract design with corporate-grade quality and refined aesthetics'
    }

    const styleDesc = styleDescriptors[style as keyof typeof styleDescriptors] || styleDescriptors.artistic

    return `Create a ${styleDesc} abstract artwork of ${prompt} — featuring innovative composition, striking visual elements, and creative interpretation that challenges perception and inspires imagination.`
  }

  const enhanceGeneralPrompt = (prompt: string, style: string, aspectRatio: string): string => {
    const styleDescriptors = {
      realistic: 'ultra-realistic rendering with precise details and natural lighting',
      artistic: 'creative artistic composition with unique visual elements and expressive style',
      minimalist: 'clean minimalist design with elegant simplicity and strategic composition',
      vibrant: 'vibrant high-contrast imagery with bold colors and dynamic visual impact',
      professional: 'polished professional presentation with corporate-grade quality and refined aesthetics'
    }

    const styleDesc = styleDescriptors[style as keyof typeof styleDescriptors] || styleDescriptors.professional

    return `Create a ${styleDesc} ${prompt} — featuring perfect composition, engaging visual elements, and high-quality presentation that captures attention and delivers impact.`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Thumbnail</h2>

                  {/* Credit Display */}
                  {credits !== null && (
                    <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">
                          Credits Remaining: {credits}
                        </span>
                        {credits <= 1 && (
                          <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Upgrade Now
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image Upload Section */}
                  <div className="space-y-4 mb-6">
                    <label className="label">Upload Images (Optional)</label>
                    
                    {/* Drag & Drop Area */}
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragOver
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
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
                      
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                        <div className="text-sm text-gray-600">
                          <button
                            type="button"
                            onClick={openFileDialog}
                            className="text-primary-600 hover:text-primary-700 font-medium"
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
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-700">
                            Uploaded Images ({uploadedImages.length}/5)
                          </p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            🚨 FACE PRESERVATION MODE ACTIVE 🚨
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                                {file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prompt Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="label">Describe your thumbnail</label>
                      <div className="flex items-center space-x-2 text-xs text-blue-600">
                        <Wand2 className="h-3 w-3" />
                        <span>AI Enhancement Available</span>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A professional YouTube thumbnail for a tech review video with bold text and vibrant colors..."
                        className="input min-h-[100px] resize-none pr-12"
                        rows={4}
                      />
                      <button
                        onClick={enhancePrompt}
                        disabled={isEnhancing || !prompt.trim()}
                        className="absolute top-2 right-2 p-2 rounded-md bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isEnhancing ? "AI is analyzing your prompt and creating a detailed description..." : "Click to transform your basic prompt into a professional, detailed description that will generate higher-quality thumbnails"}
                      >
                        {isEnhancing ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      ✨ <strong>AI Prompt Enhancer:</strong> Click the magic wand to automatically transform your basic prompt into a detailed, professional description that will generate higher-quality thumbnails. The AI analyzes your content type, style preferences, and aspect ratio to create optimized prompts with vivid details, emotional impact, and technical specifications.
                    </p>
                  </div>

              {/* Style Selection */}
              <div className="space-y-2">
                <label className="label">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as ImageGenerationOptions['style'])}
                  className="input"
                >
                  <option value="professional">Professional</option>
                  <option value="realistic">Realistic</option>
                  <option value="artistic">Artistic</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="vibrant">Vibrant</option>
                </select>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <label className="label">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-2">
                  {['16:9', '1:1', '4:3', '9:16'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio as ImageGenerationOptions['aspectRatio'])}
                      className={`btn btn-outline btn-sm ${
                        aspectRatio === ratio ? 'bg-primary-50 border-primary-300' : ''
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size and Quality */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label">Size</label>
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
                <div className="space-y-2">
                  <label className="label">Quality</label>
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

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || credits === 0}
                className="btn btn-primary btn-lg w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : credits === 0 ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Upgrade to Generate
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Thumbnail
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Quick Templates */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'YouTube Tech Review',
                  'Instagram Post',
                  'Blog Cover',
                  'LinkedIn Banner',
                  'Twitter Header',
                  'TikTok Thumbnail'
                ].map((template) => (
                  <button
                    key={template}
                    onClick={() => setPrompt(template)}
                    className="btn btn-outline btn-sm text-left justify-start"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Image Preview */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              
              {generatedImage ? (
                <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={generatedImage.url}
                          alt="Generated thumbnail"
                          className="w-full rounded-lg shadow-lg"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          {generatedImage.aspectRatio}
                        </div>
                        {generatedImage.facePreservation?.active && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            🎭 FACE PRESERVED
                          </div>
                        )}
                      </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDownload}
                      className="btn btn-primary btn-md flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="btn btn-outline btn-md"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Style:</strong> {generatedImage.style}</p>
                    <p><strong>Aspect Ratio:</strong> {generatedImage.aspectRatio}</p>
                    <p><strong>Size:</strong> {generatedImage.size}</p>
                    <p><strong>Generated:</strong> {new Date(generatedImage.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your generated thumbnail will appear here</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Results</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Be specific about colors, mood, and composition</li>
                <li>• Mention text placement if you want text overlays</li>
                <li>• Include the subject or main focus of your content</li>
                <li>• Specify the target audience (e.g., "for kids", "professional")</li>
                <li>• Use descriptive adjectives (vibrant, clean, dramatic, etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentCredits={credits || 0}
      />
    </div>
  )
}
