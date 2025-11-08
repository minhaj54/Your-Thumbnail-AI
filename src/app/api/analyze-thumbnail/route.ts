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

    console.log('Processing thumbnail:', {
      fileName: thumbnail.name,
      fileSize: thumbnail.size,
      mimeType: mimeType
    })

    // Use Gemini Vision to analyze the thumbnail
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const analysisPrompt = `You are an expert thumbnail designer and analyst. Analyze this YouTube thumbnail in detail and provide a comprehensive analysis in JSON format.

Your analysis should include:

1. **overallScore**: Rate the thumbnail from 1-10 based on its effectiveness for YouTube
2. **colors**: 
   - description: Describe the color scheme and its effectiveness
   - dominantColors: Array of hex color codes for dominant colors (extract 3-5 main colors)
3. **composition**: Describe the layout, focal points, rule of thirds usage, and visual hierarchy
4. **textElements**: Analyze any text - readability, size, placement, font choice, contrast
5. **emotion**: What emotion does this thumbnail evoke? How impactful is it?
6. **strengths**: Array of 3-5 specific strengths of this thumbnail
7. **improvements**: Array of 3-5 specific, actionable suggestions to improve this thumbnail

Return ONLY valid JSON with no markdown formatting or extra text. Use this exact structure:
{
  "overallScore": 8,
  "colors": {
    "description": "...",
    "dominantColors": ["#FF0000", "#00FF00", "#0000FF"]
  },
  "composition": "...",
  "textElements": "...",
  "emotion": "...",
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...]
}`

    console.log('Calling Gemini API for analysis...')
    
    const result = await model.generateContent([
      analysisPrompt,
      {
        inlineData: {
          mimeType: mimeType,
          data: base64
        }
      }
    ])

    console.log('Gemini API responded')
    
    const response = await result.response
    const analysisText = response.text()
    
    console.log('Analysis text received, length:', analysisText.length)

    // Parse the JSON response
    let analysis
    try {
      // Remove markdown code blocks if present
      const cleanedText = analysisText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      console.log('Attempting to parse JSON...')
      analysis = JSON.parse(cleanedText)
      console.log('JSON parsed successfully')
      
      // Add the thumbnail URL for preview
      analysis.thumbnailUrl = `data:${mimeType};base64,${base64}`
    } catch (parseError) {
      console.error('Error parsing analysis JSON:', parseError)
      console.error('Raw response (first 500 chars):', analysisText.substring(0, 500))
      
      // Fallback: Create a basic analysis from the text
      analysis = {
        overallScore: 7,
        colors: {
          description: 'Unable to extract detailed color information. Raw analysis: ' + analysisText.substring(0, 200),
          dominantColors: ['#FF5733', '#33FF57', '#3357FF']
        },
        composition: analysisText.substring(0, 200),
        textElements: 'Analysis in progress...',
        emotion: 'Unable to determine',
        strengths: ['Analysis completed'],
        improvements: ['Try uploading a different thumbnail'],
        thumbnailUrl: `data:${mimeType};base64,${base64}`
      }
    }

    return NextResponse.json({
      success: true,
      data: analysis
    })

  } catch (error) {
    console.error('Thumbnail analysis error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to analyze thumbnail',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Thumbnail Analysis API endpoint',
    method: 'POST',
    requiredFields: ['thumbnail (File)']
  })
}

