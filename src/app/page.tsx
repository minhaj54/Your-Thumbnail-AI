import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Users } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Stunning{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Thumbnails
              </span>{' '}
              with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate professional thumbnails and cover pages in seconds using Google's Gemini 2.5 Flash Image AI. 
              Upload your images, describe your vision, and watch AI create stunning visuals perfect for YouTube, blogs, social media, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generate" className="btn btn-primary btn-lg">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/demo" className="btn btn-outline btn-lg">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Thumbnail Builder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by Google's Gemini 2.5 Flash Image AI - the most advanced image generation technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gemini AI Powered</h3>
              <p className="text-gray-600">Uses Google's latest Gemini 2.5 Flash Image model for superior quality</p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Face Preservation</h3>
              <p className="text-gray-600">Upload your photos and AI preserves faces while enhancing the image</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Enhancement</h3>
              <p className="text-gray-600">AI automatically enhances your prompts for better results</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Formats</h3>
              <p className="text-gray-600">Support for all aspect ratios: 16:9, 1:1, 4:3, 9:16, 21:9</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Gemini Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🍌 Powered by Gemini Nano Banana
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of AI image generation with Google's most advanced model
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Revolutionary Image Generation</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <span className="text-primary-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Upload Your Image</h4>
                    <p className="text-gray-600">Drag and drop any image or click to browse</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <span className="text-primary-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Describe Your Vision</h4>
                    <p className="text-gray-600">Tell AI how you want to modify the image</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <span className="text-primary-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Magic Happens</h4>
                    <p className="text-gray-600">Gemini 2.5 Flash Image creates your perfect thumbnail</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🍌</div>
                  <div className="text-sm text-gray-600">Gemini 2.5 Flash Image</div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Example: "Make it look like a movie poster"</h4>
              <p className="text-gray-600 text-sm">AI will transform your image with cinematic effects, dramatic lighting, and professional typography</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Amazing Thumbnails?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of creators who trust Thumbnail Builder for their visual content
          </p>
          <Link href="/auth/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-primary-400" />
                <span className="ml-2 text-lg font-bold">Thumbnail Builder</span>
              </div>
              <p className="text-gray-400">
                AI-powered thumbnail and cover page generation for creators worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Thumbnail Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
