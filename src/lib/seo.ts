// SEO Configuration and Utilities for YourThumbnailAI

export const siteConfig = {
  name: 'YourThumbnailAI',
  title: 'YourThumbnailAI - AI-Powered Thumbnail Generator | Create Viral Thumbnails in Seconds',
  description: 'Create stunning AI-generated thumbnails for YouTube, Instagram, and social media in seconds. Free AI thumbnail maker with advanced customization. No design skills needed.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourthumbnailai.com',
  ogImage: '/og-image.jpg',
  keywords: [
    'AI thumbnail generator',
    'YouTube thumbnail maker',
    'free thumbnail creator',
    'AI thumbnail maker',
    'create thumbnails with AI',
    'thumbnail generator free',
    'AI-powered thumbnail creator',
    'YouTube thumbnail AI',
    'social media thumbnail maker',
    'Instagram thumbnail generator',
    'TikTok thumbnail creator',
    'video thumbnail maker',
    'AI image generator',
    'thumbnail design tool',
    'viral thumbnail creator',
    'professional thumbnail maker',
    'thumbnail AI online',
    'custom thumbnail generator',
    'thumbnail creator online',
    'AI graphic design'
  ],
  author: 'YourThumbnailAI Team',
  creator: '@yourthumbnailai',
  twitterHandle: '@yourthumbnailai',
  instagramHandle: '@yourthumbnail.ai',
  links: {
    instagram: 'https://www.instagram.com/yourthumbnail.ai',
  }
}

export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'YourThumbnailAI',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      siteConfig.links.instagram,
    ],
    description: siteConfig.description,
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@yourthumbnailai.com',
      availableLanguage: 'English'
    }
  },
  
  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'YourThumbnailAI',
    url: siteConfig.url,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free AI thumbnail generator with premium options'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1'
    },
    featureList: [
      'AI-powered thumbnail generation',
      'Multiple design styles',
      'YouTube thumbnail maker',
      'Instagram thumbnail creator',
      'Face preservation technology',
      'Custom text overlays',
      'Prompt library',
      'Image analysis',
      'Multi-platform support'
    ]
  },

  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'YourThumbnailAI',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      ratingCount: '1250'
    }
  },

  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`
    }))
  })
}

// Generate meta tags for pages
export function generateMetadata({
  title,
  description,
  keywords,
  image,
  path = '',
  noIndex = false,
  type = 'website'
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  path?: string
  noIndex?: boolean
  type?: 'website' | 'article'
}) {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const metaDescription = description || siteConfig.description
  const metaKeywords = keywords ? [...siteConfig.keywords, ...keywords] : siteConfig.keywords
  const metaImage = image || siteConfig.ogImage
  const canonicalUrl = `${siteConfig.url}${path}`

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords.join(', '),
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.creator,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      type,
      locale: 'en_US',
      url: canonicalUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.twitterHandle,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

// Common SEO-optimized FAQs
export const commonFAQs = [
  {
    question: 'What is YourThumbnailAI?',
    answer: 'YourThumbnailAI is a free AI-powered thumbnail generator that helps you create stunning, professional thumbnails for YouTube, Instagram, TikTok, and other social media platforms in seconds. No design skills required.'
  },
  {
    question: 'How does the AI thumbnail generator work?',
    answer: 'Our AI thumbnail generator uses advanced artificial intelligence to create custom thumbnails based on your text prompts or existing images. Simply describe what you want, and our AI will generate multiple high-quality thumbnail options instantly.'
  },
  {
    question: 'Is YourThumbnailAI free to use?',
    answer: 'Yes! YourThumbnailAI offers a free plan with 3 credits per month for basic thumbnail generation. We also offer premium plans with advanced features like unlimited generations, face preservation, and priority processing.'
  },
  {
    question: 'What platforms can I create thumbnails for?',
    answer: 'You can create thumbnails for YouTube, Instagram, TikTok, Facebook, Twitter, LinkedIn, and any other social media platform. Our AI generates thumbnails optimized for each platform\'s specifications.'
  },
  {
    question: 'Do I need design skills to use YourThumbnailAI?',
    answer: 'No design skills needed! YourThumbnailAI is built for everyone - from beginners to professionals. Just describe your idea in simple words, and our AI handles the complex design work.'
  },
  {
    question: 'Can I customize the AI-generated thumbnails?',
    answer: 'Yes! After generating a thumbnail, you can customize elements like text, colors, layouts, and add your own images or logos to make it perfectly match your brand.'
  },
  {
    question: 'How long does it take to generate a thumbnail?',
    answer: 'Most thumbnails are generated in 10-30 seconds, depending on complexity. Our AI works fast to ensure you can create and publish content quickly.'
  },
  {
    question: 'Can I use the generated thumbnails commercially?',
    answer: 'Yes! All thumbnails generated with YourThumbnailAI are yours to use for personal and commercial purposes, including YouTube videos, social media posts, and marketing materials.'
  }
]

