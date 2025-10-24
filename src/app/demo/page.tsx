'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, Play, Download, RefreshCw } from 'lucide-react'

export default function DemoPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const demoPrompts = [
    'Professional YouTube thumbnail for a tech review video with bold text and vibrant colors',
    'Instagram post for a fitness brand with motivational quote and energetic design',
    'Blog cover for a cooking article with appetizing food photography',
    'LinkedIn banner for a business consultant with clean, professional layout',
    'Twitter header for a travel blogger with scenic landscape and adventure theme',
    'TikTok thumbnail for a dance tutorial with dynamic movement and bright colors'
  ]

  const handleDemoGeneration = async (prompt: string) => {
    setIsGenerating(true)
    setGeneratedImage(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate a random image URL for demo
      const randomId = Math.floor(Math.random() * 1000)
      setGeneratedImage(`https://picsum.photos/800/450?random=${randomId}`)
    } catch (error) {
      console.error('Demo generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Thumbnail Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/generate" className="btn btn-primary btn-md">
                Try It Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See Thumbnail Builder in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how easy it is to create professional thumbnails and cover pages 
            with our AI-powered generator. No design skills required!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo Interface */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Try It Yourself</h2>
              
              {/* Quick Demo Prompts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Quick Demos</h3>
                <div className="grid grid-cols-1 gap-3">
                  {demoPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleDemoGeneration(prompt)}
                      disabled={isGenerating}
                      className="btn btn-outline btn-md text-left justify-start p-4 h-auto"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm">{prompt}</span>
                        <Play className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={() => handleDemoGeneration('Professional YouTube thumbnail for a tech review video')}
                disabled={isGenerating}
                className="btn btn-primary btn-lg w-full mt-6"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Generating Demo...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Demo Thumbnail
                  </>
                )}
              </button>
            </div>

            {/* Features List */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What You Get</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>AI-powered image generation in seconds</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Multiple aspect ratios (16:9, 1:1, 4:3, etc.)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Various styles: professional, artistic, minimalist</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>High-quality downloads in multiple formats</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>No design experience required</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Preview Area */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
              
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={generatedImage}
                      alt="Generated thumbnail"
                      className="w-full rounded-lg shadow-lg"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      16:9
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = generatedImage
                        link.download = 'demo-thumbnail.jpg'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                      className="btn btn-primary btn-md flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Demo
                    </button>
                    <button
                      onClick={() => handleDemoGeneration('Professional YouTube thumbnail for a tech review video')}
                      className="btn btn-outline btn-md"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Another
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <p><strong>Generated:</strong> Just now</p>
                    <p><strong>Style:</strong> Professional</p>
                    <p><strong>Size:</strong> 800x450px</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Click a demo prompt above</p>
                  <p className="text-sm text-gray-400">or generate a sample thumbnail</p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="card p-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
              <h3 className="text-xl font-bold mb-2">Ready to Create Your Own?</h3>
              <p className="text-primary-100 mb-4">
                Sign up for free and start generating professional thumbnails in minutes.
              </p>
              <div className="flex space-x-3">
                <Link href="/auth/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-md flex-1">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/pricing" className="btn btn-outline border-white text-white hover:bg-white/10 btn-md">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Describe Your Vision</h3>
              <p className="text-gray-600">
                Simply tell our AI what kind of thumbnail you want. Be as specific or general as you like.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Creates Magic</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your prompt and generates a professional thumbnail in seconds.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download & Use</h3>
              <p className="text-gray-600">
                Download your thumbnail in high quality and use it across all your platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
