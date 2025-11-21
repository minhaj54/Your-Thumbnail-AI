import { GoogleGenerativeAI } from '@google/generative-ai'
import { uploadImageToStorage, base64ToBuffer, generateFilename } from './storage'

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export interface ImageGenerationOptions {
  prompt: string
  style?: 'realistic' | 'artistic' | 'minimalist' | 'vibrant' | 'professional'
  aspectRatio?: '16:9' | '1:1' | '4:3' | '9:16' | '21:9'
  size?: 'small' | 'medium' | 'large'
  quality?: 'standard' | 'high'
  imageData?: string
  userId?: string
}

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  aspectRatio: string
  size: string
  createdAt: Date
  facePreservation?: {
    active: boolean
    imageCount: number
    data: any
  }
}

export class GeminiImageGenerator {
  private model: any
  private imageModel: any

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    this.imageModel = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' })
  }

  /**
   * Generate an image using Gemini 3 Pro Image Preview with proper API integration
   * Supports up to 4K resolution, real-world grounding, and advanced image generation
   */
  async generateImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
    const { prompt, style = 'professional', aspectRatio = '16:9', size = 'medium', quality = 'high', imageData, userId } = options
    
    console.log(`🎯 Generating image with aspect ratio: ${aspectRatio}, size: ${size}`)

    try {
      // First, enhance the prompt using Gemini 2.5 Flash
      const enhancedPrompt = await this.enhancePrompt(prompt, style, aspectRatio, size, quality, !!imageData)
      console.log(`🤖 AI-enhanced prompt: ${enhancedPrompt}`)

      // Prepare content array for image generation
      const contentArray: any[] = [{
        parts: [{
          text: enhancedPrompt
        }]
      }]

      // Add uploaded images if available for face preservation
      if (imageData) {
        try {
          const images = JSON.parse(imageData)
          if (Array.isArray(images)) {
            images.forEach((image: any) => {
              contentArray[0].parts.push({
                inlineData: {
                  mimeType: image.mimeType,
                  data: image.data
                }
              })
            })
            console.log(`📸 Added ${images.length} reference images to AI prompt`)
          }
        } catch (error) {
          console.error('Error parsing image data:', error)
        }
      }

      // Generate image using Gemini 3 Pro Image Preview
      // Note: Gemini 3 Pro Image Preview supports 1K, 2K, and 4K resolutions
      // Default is 1K resolution. You can specify resolution in imageConfig if needed.
      const result = await this.imageModel.generateContent({
        contents: contentArray,
        generationConfig: {
          imageConfig: {
            aspectRatio: this.mapAspectRatio(aspectRatio)
            // Optional: Add resolution for higher quality (1K default, 2K, or 4K)
            // resolution: this.mapResolution(size, quality)
          }
        }
      })
      
      const response = await result.response

      // Extract image data from response
      if (response.candidates && response.candidates[0] && response.candidates[0].content) {
        const content = response.candidates[0].content
        
        if (content.parts && content.parts.length > 0) {
          for (const part of content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const imageUrl = `data:image/png;base64,${part.inlineData.data}`
              console.log(`✅ Successfully generated image with Gemini 3 Pro Image Preview`)
              
              // Upload to Supabase Storage if userId is provided
              let finalUrl = imageUrl
              if (userId) {
                try {
                  const imageBuffer = base64ToBuffer(imageUrl)
                  const filename = generateFilename(enhancedPrompt, style, aspectRatio)
                  const storageResult = await uploadImageToStorage(userId, imageBuffer, filename)
                  
                  if (storageResult) {
                    finalUrl = storageResult.url
                    console.log(`📁 Image uploaded to Supabase Storage: ${storageResult.url}`)
                  }
                } catch (error) {
                  console.error('Error uploading to storage:', error)
                  // Continue with base64 URL if storage fails
                }
              }
              
              return {
                id: this.generateId(),
                url: finalUrl,
                prompt: enhancedPrompt,
                style,
                aspectRatio,
                size,
                createdAt: new Date(),
                facePreservation: imageData ? {
                  active: true,
                  imageCount: Array.isArray(JSON.parse(imageData)) ? JSON.parse(imageData).length : 1,
                  data: imageData
                } : undefined
              }
            }
          }
        }
      }

      throw new Error('No image data found in Gemini response')

    } catch (error) {
      console.error('Error generating image with Gemini:', error)
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Enhance prompt using Gemini 2.5 Flash (text model for prompt enhancement)
   */
  private async enhancePrompt(
    prompt: string, 
    style: string, 
    aspectRatio: string, 
    size: string, 
    quality: string, 
    hasFacePreservation: boolean
  ): Promise<string> {
    const enhancementPrompt = `You are an expert AI image prompt engineer. Create a detailed, specific prompt for generating a ${aspectRatio} ${style} thumbnail.

Original prompt: "${prompt}"

Requirements:
- Style: ${style}
- Aspect ratio: ${aspectRatio} (${this.getAspectRatioDescription(aspectRatio)})
- Size: ${size}
- Quality: ${quality}
${hasFacePreservation ? '- Face preservation: Use the uploaded reference images to preserve the person\'s face exactly' : ''}

Create a detailed, specific prompt that will generate a professional thumbnail. Focus on:
- Visual elements and composition
- Lighting and mood
- Colors and style
- Text placement and typography
- Overall impact and appeal

Make it compelling and specific for creating a ${aspectRatio} ${style} thumbnail. Return ONLY the enhanced prompt, no explanations.`

    try {
      const result = await this.model.generateContent([enhancementPrompt])
      return await result.response.text()
    } catch (error) {
      console.error('Error enhancing prompt:', error)
      return prompt // Return original prompt if enhancement fails
    }
  }

  /**
   * Map aspect ratio to Gemini API format
   */
  private mapAspectRatio(aspectRatio: string): string {
    const mapping: { [key: string]: string } = {
      '16:9': '16:9',
      '1:1': '1:1',
      '4:3': '4:3',
      '9:16': '9:16',
      '21:9': '21:9'
    }
    return mapping[aspectRatio] || '16:9'
  }

  /**
   * Get aspect ratio description
   */
  private getAspectRatioDescription(aspectRatio: string): string {
    const descriptions = {
      '16:9': 'widescreen landscape perfect for YouTube thumbnails',
      '1:1': 'square format perfect for social media posts',
      '4:3': 'traditional rectangle suitable for presentations',
      '9:16': 'vertical format perfect for mobile stories',
      '21:9': 'ultra-wide cinematic format'
    }
    return descriptions[aspectRatio as keyof typeof descriptions] || 'widescreen format'
  }

  /**
   * Generate a unique ID for the image
   */
  private generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get available styles
   */
  getAvailableStyles(): string[] {
    return ['realistic', 'artistic', 'minimalist', 'vibrant', 'professional']
  }

  /**
   * Get available aspect ratios
   */
  getAvailableAspectRatios(): string[] {
    return ['16:9', '1:1', '4:3', '9:16', '21:9']
  }

  /**
   * Get available sizes
   */
  getAvailableSizes(): string[] {
    return ['small', 'medium', 'large']
  }
}

// Export a singleton instance
export const geminiImageGenerator = new GeminiImageGenerator()