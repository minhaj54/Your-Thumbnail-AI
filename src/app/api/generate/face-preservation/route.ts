import { NextRequest, NextResponse } from 'next/server'
import { geminiImageGenerator, ImageGenerationOptions } from '@/lib/gemini'
import { createServerSupabase } from '@/lib/supabase/server'
import { canGenerate, deductCredits } from '@/lib/credits'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has credits
    const { canGenerate: hasCredits, credits } = await canGenerate(session.user.id)
    
    if (!hasCredits) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        credits: credits,
        upgradeRequired: true
      }, { status: 402 })
    }

    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const style = formData.get('style') as string
    const aspectRatio = formData.get('aspectRatio') as string
    const size = formData.get('size') as string
    const quality = formData.get('quality') as string
    const images = formData.getAll('images') as File[]

    // Validate required fields
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'Face preservation requires uploaded images' },
        { status: 400 }
      )
    }

    // Process uploaded images
    let imageData = ''
    
    console.log(`Processing ${images.length} uploaded images for face preservation`)
    
    // Convert uploaded images to base64 for AI processing
    try {
      const imagePromises = images.map(async (image) => {
        const arrayBuffer = await image.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        return {
          mimeType: image.type,
          data: base64
        }
      })
      
      const imageDataArray = await Promise.all(imagePromises)
      imageData = JSON.stringify(imageDataArray)
      console.log(`Converted ${images.length} images to base64 for face preservation`)
    } catch (error) {
      console.error('Error processing images:', error)
      return NextResponse.json(
        { error: 'Failed to process uploaded images' },
        { status: 500 }
      )
    }

    // Enhanced prompt for face preservation
    const finalPrompt = `🎭 FACE PRESERVATION MODE ACTIVATED 🎭

${prompt}

🚨 CRITICAL FACE PRESERVATION REQUIREMENTS 🚨
- Use the EXACT face from the uploaded reference images
- The face should be the PRIMARY FOCUS and CENTER of the thumbnail
- Preserve the person's identity, facial structure, and key distinguishing features EXACTLY as shown
- Maintain the same facial expression and pose as shown in the reference images
- Ensure the face is clearly visible and recognizable in the final thumbnail
- Position the face prominently in the composition (center or rule of thirds)
- Keep the face sharp and well-lit in the final image
- Do NOT replace, alter, or obscure the face - it must remain the focal point
- Use the actual face from the uploaded image, not a similar-looking face
- Extract the face from the uploaded images and use it directly in the thumbnail
- Maintain all facial characteristics, skin tone, hair color, eye color from the uploaded image
- Preserve the person's expression, pose, and distinctive characteristics exactly

The user has uploaded ${images.length} reference image(s) containing faces that MUST be preserved and featured prominently in the thumbnail.`

    const options: ImageGenerationOptions = {
      prompt: finalPrompt,
      style: style || 'professional',
      aspectRatio: aspectRatio || '16:9',
      size: size || 'medium',
      quality: quality || 'high',
      imageData: imageData,
      userId: session.user.id
    }

    const result = await geminiImageGenerator.generateImage(options)

    // Deduct credits after successful generation
    const creditsDeducted = await deductCredits(session.user.id, 1)
    
    if (!creditsDeducted) {
      console.error('Failed to deduct credits after generation')
      // Don't fail the request as image was already generated
    }

    // Store generation in database
    try {
      const { error: dbError } = await supabase
        .from('generations')
        .insert({
          user_id: session.user.id,
          image_url: result.url,
          prompt: result.prompt,
          style: result.style,
          aspect_ratio: result.aspectRatio,
          size: result.size,
          credits_used: 1
        })

      if (dbError) {
        console.error('Error storing generation:', dbError)
        // Don't fail the request as image was already generated
      }
    } catch (error) {
      console.error('Error storing generation:', error)
    }

    return NextResponse.json({
      success: true,
      data: result,
      credits_remaining: credits - 1
    })

  } catch (error) {
    console.error('Face preservation generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image with face preservation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}