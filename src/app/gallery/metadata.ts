import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Gallery - AI-Generated Thumbnail Examples',
  description: 'Browse our gallery of stunning AI-generated thumbnails. Get inspiration for your YouTube videos, social media posts, and content creation.',
  keywords: ['thumbnail gallery', 'AI thumbnail examples', 'thumbnail inspiration', 'YouTube thumbnail ideas', 'thumbnail designs'],
  path: '/gallery',
})

