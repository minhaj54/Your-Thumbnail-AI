import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerSupabase } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    // Check if Gemini API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY is not configured')
      return NextResponse.json(
        { 
          success: false,
          error: 'AI service not configured. Please set GOOGLE_API_KEY.' 
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const thumbnail = formData.get('thumbnail') as File
    const saveToLibrary = formData.get('saveToLibrary') === 'true'
    const sourceType = formData.get('sourceType') as string || 'upload'

    if (!thumbnail) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Thumbnail file is required' 
        },
        { status: 400 }
      )
    }

    // Convert image to base64
    const arrayBuffer = await thumbnail.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = thumbnail.type || 'image/jpeg'
    const thumbnailDataUrl = `data:${mimeType};base64,${base64}`

    console.log('Processing thumbnail for prompt extraction:', {
      fileName: thumbnail.name,
      fileSize: thumbnail.size,
      mimeType: mimeType
    })

    // Use Gemini Vision to extract prompt from the thumbnail
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const extractionPrompt = `You are an expert AI prompt engineer specializing in thumbnail generation. Analyze this thumbnail image carefully and extract a detailed, structured prompt that could be used to generate a similar or identical thumbnail.

Analyze the image thoroughly and create a comprehensive, reusable prompt following this EXACT structure:

Main Subject: [Describe the main focus - people, objects, scenes with specific details like age, ethnicity, expressions, actions, clothing, positioning. Be vivid and specific. Include all important visual elements.]

Visual Style: [Describe the lighting (natural/studio/dramatic), color palette (vibrant/muted/specific colors), mood (energetic/professional/mysterious), and technical quality (4K, sharp focus, etc.). Be specific about colors and visual effects.]

Composition: [Describe the camera angle (low-angle/eye-level/bird's-eye), shot type (close-up/medium/wide), subject positioning (rule of thirds, centered, left/right space), depth and focus. Include spatial relationships.]

Text Elements: [If text is visible, describe the specific text placement, font style (bold/outlined/3D), colors, size hierarchy, positioning (top/bottom/side), and exact wording. If no text is visible, note that the composition leaves space for text.]

Mood: [Describe the overall emotional impact, target audience feeling, psychological triggers (curiosity/excitement/urgency/inspiration), and the key message conveyed. What emotion does this thumbnail evoke?]

CRITICAL REQUIREMENTS:
- Be extremely detailed and specific
- Use the same structured format shown above
- Include all visual elements you can identify
- Make it comprehensive enough to recreate the thumbnail
- Focus on actionable, generative details
- Return ONLY the structured prompt with sections, no explanations or markdown formatting
- Start directly with "Main Subject:" without any preamble

Return the prompt in this exact format (no additional text before or after):`

    console.log('Calling Gemini API for prompt extraction...')
    
    const result = await model.generateContent([
      extractionPrompt,
      {
        inlineData: {
          mimeType: mimeType,
          data: base64
        }
      }
    ])

    console.log('Gemini API responded')
    
    const response = await result.response
    let extractedPrompt = response.text()
    
    console.log('Extraction text received, length:', extractedPrompt.length)

    // Clean up the response - remove any markdown code blocks if present
    extractedPrompt = extractedPrompt
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/```prompt\n?/g, '')
      .replace(/```text\n?/g, '')
      .trim()

    // If the prompt doesn't start with "Main Subject:", add it as a fallback
    if (!extractedPrompt.startsWith('Main Subject:')) {
      // Try to find where the actual prompt starts
      const subjectIndex = extractedPrompt.indexOf('Main Subject:')
      if (subjectIndex > 0) {
        extractedPrompt = extractedPrompt.substring(subjectIndex)
      } else {
        // Fallback: wrap the response
        extractedPrompt = `Main Subject: ${extractedPrompt}`
      }
    }

    const finalPrompt = extractedPrompt.trim()

    // Save to prompt library if requested
    let libraryEntryId = null
    if (saveToLibrary) {
      try {
        const { data, error } = await supabase
          .from('prompt_library')
          .insert({
            thumbnail_url: thumbnailDataUrl,
            thumbnail_base64: base64,
            extracted_prompt: finalPrompt,
            user_id: session.user.id,
            source_type: sourceType
          })
          .select('id')
          .single()

        if (error) {
          console.error('Error saving to prompt library:', error)
          // Don't fail the request, just log the error
        } else {
          libraryEntryId = data.id
          console.log('Successfully saved to prompt library:', libraryEntryId)
        }
      } catch (err) {
        console.error('Exception saving to prompt library:', err)
        // Continue even if save fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        extractedPrompt: finalPrompt,
        savedToLibrary: saveToLibrary && libraryEntryId !== null,
        libraryEntryId: libraryEntryId
      }
    })

  } catch (error) {
    console.error('Prompt extraction error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to extract prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Prompt Extraction API endpoint',
    method: 'POST',
    requiredFields: ['thumbnail (File)']
  })
}

