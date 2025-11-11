import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Pricing Plans - Affordable AI Thumbnail Generator',
  description: 'Choose the perfect plan for your needs. Free AI thumbnail generator with premium options. Create unlimited thumbnails for YouTube, Instagram, and social media.',
  keywords: ['thumbnail generator pricing', 'AI thumbnail plans', 'free thumbnail maker', 'premium thumbnail creator', 'YouTube thumbnail subscription'],
  path: '/pricing',
})

