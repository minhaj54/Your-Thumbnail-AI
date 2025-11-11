import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Sign In - Access Your AI Thumbnail Generator',
  description: 'Sign in to YourThumbnailAI and start creating stunning AI-generated thumbnails for your content.',
  path: '/auth/signin',
  noIndex: true, // Don't index auth pages
})

