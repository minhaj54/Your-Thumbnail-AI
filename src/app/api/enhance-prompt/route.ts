import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = 'professional', aspectRatio = '16:9' } = await request.json()

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('Enhancing prompt:', { prompt, style, aspectRatio })

    try {
          // Initialize Gemini model
          const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

      // Create the thumbnail-specific enhancement prompt for Gemini
      const enhancementPrompt = `You are a YouTube Thumbnail Expert AI. Transform simple prompts into professional, detailed thumbnail descriptions that maximize click-through rates.

Your enhanced prompts MUST follow this exact structure:

Main Subject: [Describe the main focus - people, objects, scenes. Include specific details like age, ethnicity, expressions, actions, clothing, positioning. Be vivid and specific.]

Visual Style: [Lighting (natural/studio/dramatic), color palette (vibrant/muted/specific colors), mood (energetic/professional/mysterious), and technical quality (4K, sharp focus, etc.)]

Composition: [Camera angle (low-angle/eye-level/bird's-eye), shot type (close-up/medium/wide), subject positioning (rule of thirds, centered, left/right space), depth and focus]

Text Elements: [Specific text placement, font style (bold/outlined/3D), colors, size hierarchy, positioning (top/bottom/side), and exact wording suggestions that create urgency or curiosity]

Mood: [Overall emotional impact, target audience feeling, psychological triggers (curiosity/excitement/urgency/inspiration), and the key message conveyed]

Example Input: "tech review thumbnail"

Example Output:
Main Subject: A diverse tech reviewer (late 20s, casual but professional) holding the latest smartphone with an amazed, wide-eyed expression. The phone screen is glowing, casting light on their face. Modern tech setup visible in background with RGB lighting.

Visual Style: Studio lighting with dramatic blue and purple RGB accent lights. High contrast, vibrant colors emphasizing the tech product. Sharp 4K quality with slight bokeh background blur. Cool color temperature with warm highlights on face.

Composition: Medium close-up shot, slightly low-angle (eye-level tilted 10° up) making the reviewer appear authoritative. Subject positioned in left two-thirds of frame. Phone held prominently at chest level. Right third left empty for text overlay.

Text Elements: Bold, white text with black outline at top-right: "BEST PHONE 2025?" in large caps. Below it, smaller yellow text: "INSANE Camera!" with slight glow effect. Bottom-right corner: Small red "HONEST REVIEW" badge. All text uses thick sans-serif font (Impact/Bebas).

Mood: Excitement and trustworthy authority. Conveys genuine surprise and expert analysis. Creates curiosity ("What's so special?") and urgency ("I need to know this"). Appeals to tech enthusiasts aged 18-35 who value honest, energetic reviews.

Now enhance this prompt with the same detailed structure:

User's Basic Prompt: "${prompt}"

Style Preference: ${style}
Aspect Ratio: ${aspectRatio}

Enhanced Thumbnail Prompt:`

      // Generate enhanced prompt using Gemini
      const result = await model.generateContent(enhancementPrompt)
      const response = await result.response
      const enhancedPrompt = response.text()

      return NextResponse.json({
        success: true,
        data: {
          originalPrompt: prompt,
          enhancedPrompt: enhancedPrompt.trim(),
          style,
          aspectRatio
        }
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      
      // Fallback to local enhancement if Gemini fails
      const fallbackEnhanced = fallbackEnhancement(prompt, style, aspectRatio)
      
      return NextResponse.json({
        success: true,
        data: {
          originalPrompt: prompt,
          enhancedPrompt: fallbackEnhanced,
          style,
          aspectRatio,
          fallback: true
        }
      })
    }

  } catch (error) {
    console.error('Error enhancing prompt:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to enhance prompt' },
      { status: 500 }
    )
  }
}

// Fallback enhancement function with structured format
function fallbackEnhancement(originalPrompt: string, style: string, aspectRatio: string): string {
  const styleDescriptors = {
    realistic: {
      lighting: 'natural lighting with soft shadows',
      quality: 'ultra-realistic photography, sharp focus, 4K quality',
      colors: 'natural color palette with accurate skin tones'
    },
    artistic: {
      lighting: 'dramatic lighting with creative shadows and highlights',
      quality: 'artistic composition with painterly effects',
      colors: 'vibrant, saturated colors with artistic color grading'
    },
    minimalist: {
      lighting: 'clean, even lighting with minimal shadows',
      quality: 'crisp, clean imagery with high clarity',
      colors: 'muted color palette with strategic pops of color'
    },
    vibrant: {
      lighting: 'bright, high-energy lighting with strong contrast',
      quality: 'high-contrast, super vibrant, eye-catching quality',
      colors: 'bold, saturated colors that demand attention'
    },
    professional: {
      lighting: 'studio lighting with professional setup',
      quality: 'polished, commercial-grade quality, sharp details',
      colors: 'balanced color palette with professional color grading'
    }
  }

  const aspectRatioGuidance = {
    '16:9': 'Horizontal widescreen composition. Subject positioned following rule of thirds with space for text on sides or top.',
    '1:1': 'Square composition. Centered or slightly off-center subject with text overlay options on all sides.',
    '4:3': 'Traditional horizontal format. Balanced composition with text placement flexibility.',
    '9:16': 'Vertical mobile format. Subject in upper two-thirds with text space at bottom or overlaid.',
    '21:9': 'Ultra-wide cinematic format. Epic composition with dramatic depth and side text placement.'
  }

  const styleConfig = styleDescriptors[style as keyof typeof styleDescriptors] || styleDescriptors.professional
  const compositionGuide = aspectRatioGuidance[aspectRatio as keyof typeof aspectRatioGuidance] || aspectRatioGuidance['16:9']

  // Create structured enhancement
  return `Main Subject: ${originalPrompt} - featuring dynamic subjects with engaging expressions and clear focus. Subjects positioned to create visual interest and leave space for text overlays.

Visual Style: ${styleConfig.lighting}. ${styleConfig.colors}. ${styleConfig.quality}. High production value with professional finishing.

Composition: ${compositionGuide} Eye-catching focal point with balanced elements. Strategic use of negative space for text and visual hierarchy.

Text Elements: Bold, high-contrast typography with clear readability. Suggested placement: Primary text at top or bottom in large, attention-grabbing font (white with black outline or contrasting color). Secondary text in complementary colors. All text should create curiosity or urgency.

Mood: Engaging and click-worthy. Creates immediate interest and compels viewers to click. Conveys professionalism, excitement, and value. Target audience will feel intrigued and motivated to engage with the content.`
}
