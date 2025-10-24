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

      // Create the enhancement prompt for Gemini
      const enhancementPrompt = `You are an AI Prompt Enhancer designed to transform simple, vague, or unclear prompts into powerful, detailed, and creative ones that maximize quality, clarity, and relevance for text, image, or video generation models.

Your goal is to:
- Understand the user's original intent.
- Expand it with vivid context, details, and purpose.
- Improve grammar and phrasing.
- Add creative and technical depth if needed.
- Keep it concise yet powerful.

Return only the improved prompt, not explanations.

Examples:

1️⃣
User Prompt: "cat sitting on a chair"
Improved Prompt: "A fluffy orange cat with bright green eyes sitting elegantly on a wooden chair near a sunny window, captured in soft natural light — ultra-realistic photography."

2️⃣
User Prompt: "write a youtube video script about ai"
Improved Prompt: "Write a captivating YouTube video script that explains how AI is changing daily life, starting with an engaging hook, relatable examples, and a motivational conclusion."

3️⃣
User Prompt: "build a modern login ui in flutter"
Improved Prompt: "Create a modern, responsive Flutter login UI featuring gradient backgrounds, smooth animations, rounded text fields, and a prominent 'Sign In' button — optimized for both mobile and web."

4️⃣
User Prompt: "generate thumbnail for gaming video"
Improved Prompt: "Create a high-impact YouTube thumbnail for a gaming video — featuring intense action, bold typography, vibrant contrast, and the player's expressive face in focus."

Remember:
✅ Keep user's intent.
✅ Add clarity, richness, and emotion.
✅ Adapt to the context (text, image, code, design, etc.).
✅ Never invent irrelevant details.
✅ Output: only the final improved prompt.

User Prompt: "${prompt}"

Enhanced Prompt:`

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

// Fallback enhancement function
function fallbackEnhancement(originalPrompt: string, style: string, aspectRatio: string): string {
  const styleDescriptors = {
    realistic: 'ultra-realistic photography with sharp focus and natural lighting',
    artistic: 'creative artistic composition with unique visual flair and dynamic elements',
    minimalist: 'clean minimalist design with elegant simplicity and strategic negative space',
    vibrant: 'vibrant high-contrast imagery with bold colors and energetic composition',
    professional: 'polished professional presentation with corporate-grade quality and clean aesthetics'
  }

  const aspectRatioContext = {
    '16:9': 'widescreen format perfect for YouTube thumbnails',
    '1:1': 'square format ideal for social media posts and Instagram',
    '4:3': 'traditional format great for presentations and web content',
    '9:16': 'vertical format perfect for mobile stories and TikTok',
    '21:9': 'ultra-wide cinematic format for premium displays'
  }

  const styleDesc = styleDescriptors[style as keyof typeof styleDescriptors] || styleDescriptors.professional
  const aspectDesc = aspectRatioContext[aspectRatio as keyof typeof aspectRatioContext] || aspectRatioContext['16:9']

  return `Create a high-impact ${aspectDesc} thumbnail featuring ${originalPrompt} — designed with ${styleDesc}, bold typography space, vibrant contrast, and a clear focal point that demands attention and drives clicks.`
}
