'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Sparkles, Zap, Shield, Users, CheckCircle2, ImagePlus, Wand2, Copy, TrendingUp, Palette, Clock, Download, Play, Instagram } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { VideoModal } from '@/components/VideoModal'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const { user } = useAuth()
  
  // Determine the destination based on auth status
  const getStartedHref = user ? '/generate' : '/auth/signup'
  
  // Extract video ID from the YouTube URL
  const videoId = 'rzpz37zGfks'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg animate-bounce-gentle">
              <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-sm font-semibold gradient-text">AI-Powered Design Studio</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Turn Ideas Into{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Viral Thumbnails</span>
                <svg className="absolute -bottom-2 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 5 150 5 198 10" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="50%" stopColor="#d946ef" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform simple prompts into professional, high-performing designs with AI magic.{' '}
              <span className="font-semibold gradient-text">Generate 3 unique variants in seconds.</span>
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-primary-100">
                <Wand2 className="h-4 w-4 text-primary-600" />
                <span className="font-medium">Magic Prompt</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-secondary-100">
                <ImagePlus className="h-4 w-4 text-secondary-600" />
                <span className="font-medium">3 Style Variants</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-accent-100">
                <Zap className="h-4 w-4 text-accent-600" />
                <span className="font-medium">Instant Results</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/generate" className="btn btn-primary btn-lg group">
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Start Creating Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="btn btn-outline btn-lg group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Why Choose <span className="gradient-text">YourThumbnailAI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create viral-ready thumbnails
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-gradient p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Copy className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Clone Viral Thumbnails</h3>
              <p className="text-gray-600 leading-relaxed">
                Import any YouTube thumbnail and swap faces to match your brand. Perfect for consistent branding.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-gradient p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Face Swap Technology</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your character and seamlessly replace faces in any design with AI precision.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-gradient p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Wand2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Prompt Enhancement</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI automatically improves your prompts for professional results every time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-gradient p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Palette className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Multiple Style Variants</h3>
              <p className="text-gray-600 leading-relaxed">
                Get 3 unique designs in different styles - photorealistic, illustrated, and bold.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-gradient p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate professional thumbnails in seconds, not hours. Save time and boost productivity.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-gradient p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Edit & Customize</h3>
              <p className="text-gray-600 leading-relaxed">
                Refine any thumbnail with simple text prompts. Make it perfect with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Create Thumbnails in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center space-y-6 animate-fade-in">
              <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">1</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 animate-pulse opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Choose Your Method</h3>
              <p className="text-gray-600 leading-relaxed">
                Start from scratch with a prompt, clone a viral thumbnail, or swap faces to match your style.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-secondary-500 to-accent-600 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">2</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-500 to-accent-600 animate-pulse opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Let AI Work Magic</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI generates 3 unique, professional variants in seconds using advanced algorithms.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">3</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-500 to-primary-600 animate-pulse opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Download & Use</h3>
              <p className="text-gray-600 leading-relaxed">
                Pick your favorite, make edits if needed, and download in high quality for instant use.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/generate" className="btn btn-primary btn-lg group">
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-primary-100 font-medium">Happy Creators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-primary-100 font-medium">Thumbnails Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">4.9★</div>
              <div className="text-primary-100 font-medium">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">3s</div>
              <div className="text-primary-100 font-medium">Generation Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Ready to Create <span className="gradient-text">Amazing Thumbnails?</span>
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of creators who trust YourThumbnailAI for their visual content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href={getStartedHref} className="btn btn-primary btn-lg group">
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="btn btn-outline btn-lg">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/yourthumbnail.ai?igsh=ajNnZmcwaG5pZ242" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span>@yourthumbnail.ai</span>
              </a>
            </div>
            <p>&copy; 2025 YourThumbnailAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId={videoId}
        title="YourThumbnailAI Tutorial"
      />
    </div>
  )
}
