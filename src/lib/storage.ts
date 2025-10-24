import { createServerSupabase } from '@/lib/supabase/server'

export interface StorageResult {
  url: string
  path: string
}

export async function uploadImageToStorage(
  userId: string,
  imageBuffer: Buffer,
  filename: string
): Promise<StorageResult | null> {
  const supabase = createServerSupabase()
  
  try {
    const timestamp = Date.now()
    const filePath = `${userId}/${timestamp}_${filename}`
    
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, imageBuffer, {
        contentType: 'image/png',
        upsert: false
      })

    if (error) {
      console.error('Error uploading to storage:', error)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath)

    return {
      url: urlData.publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export async function deleteImageFromStorage(filePath: string): Promise<boolean> {
  const supabase = createServerSupabase()
  
  try {
    const { error } = await supabase.storage
      .from('thumbnails')
      .remove([filePath])

    if (error) {
      console.error('Error deleting from storage:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

export function base64ToBuffer(base64String: string): Buffer {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '')
  return Buffer.from(base64Data, 'base64')
}

export function generateFilename(prompt: string, style: string, aspectRatio: string): string {
  const sanitizedPrompt = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 30)
  
  return `${sanitizedPrompt}_${style}_${aspectRatio.replace(':', 'x')}.png`
}
