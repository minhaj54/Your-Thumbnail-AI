import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Sign Up - Start Creating AI Thumbnails Free',
  description: 'Create your free YourThumbnailAI account and start generating professional thumbnails with AI in seconds.',
  path: '/auth/signup',
  noIndex: true, // Don't index auth pages
})

