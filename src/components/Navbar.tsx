'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Menu, X, Zap, Image as ImageIcon, Layout, FolderOpen, CreditCard, BookOpen } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-primary-100/50 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary-600 group-hover:text-secondary-600 transition-colors" />
                <div className="absolute inset-0 blur-lg bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-30 transition-opacity" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                YourThumbnailAI
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/generate" 
              className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                pathname === '/generate'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
            >
              <Zap className="h-4 w-4" />
              Generate
            </Link>
            <Link 
              href="/dashboard" 
              className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                pathname === '/dashboard'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
            >
              <Layout className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              href="/gallery" 
              className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                pathname === '/gallery'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
            >
              <FolderOpen className="h-4 w-4" />
              Gallery
            </Link>
            <Link 
              href="/prompt-library" 
              className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                pathname === '/prompt-library'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Prompt Library
            </Link>
            <Link 
              href="/pricing" 
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                pathname === '/pricing'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
            >
              Pricing
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <Link 
              href="/generate" 
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
                pathname === '/generate'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Zap className="h-5 w-5" />
              Generate
            </Link>
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
                pathname === '/dashboard'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Layout className="h-5 w-5" />
              Dashboard
            </Link>
            <Link 
              href="/gallery" 
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
                pathname === '/gallery'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FolderOpen className="h-5 w-5" />
              Gallery
            </Link>
            <Link 
              href="/prompt-library" 
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
                pathname === '/prompt-library'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              Prompt Library
            </Link>
            <Link 
              href="/pricing" 
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
                pathname === '/pricing'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <CreditCard className="h-5 w-5" />
              Pricing
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
