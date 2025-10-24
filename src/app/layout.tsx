import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Thumbnail Builder - AI-Powered Image Generation',
  description: 'Generate professional thumbnails and cover pages using AI. Perfect for YouTube, blogs, and social media.',
  keywords: ['thumbnail generator', 'AI image generation', 'cover page maker', 'YouTube thumbnails', 'social media graphics'],
  authors: [{ name: 'Thumbnail Builder Team' }],
  openGraph: {
    title: 'Thumbnail Builder - AI-Powered Image Generation',
    description: 'Generate professional thumbnails and cover pages using AI.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thumbnail Builder - AI-Powered Image Generation',
    description: 'Generate professional thumbnails and cover pages using AI.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
