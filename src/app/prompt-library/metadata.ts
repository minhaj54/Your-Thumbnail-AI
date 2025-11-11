import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Prompt Library - Free AI Thumbnail Prompts',
  description: 'Explore our library of tested AI prompts for creating viral thumbnails. Copy and use proven prompts for YouTube, Instagram, and social media thumbnails.',
  keywords: ['AI prompts', 'thumbnail prompts', 'AI prompt library', 'YouTube thumbnail prompts', 'free AI prompts', 'thumbnail ideas'],
  path: '/prompt-library',
})

