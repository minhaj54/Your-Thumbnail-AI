import { createServerSupabase, supabaseAdmin } from '@/lib/supabase/server'

export interface UserCredits {
  credits: number
  subscription_tier: string
}

export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const supabase = createServerSupabase()
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('credits, subscription_tier')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user credits:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error getting user credits:', error)
    return null
  }
}

export async function deductCredits(userId: string, creditsToDeduct: number = 1): Promise<boolean> {
  const supabase = createServerSupabase()
  
  try {
    // First check if user has enough credits
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()
    
    if (fetchError || !userData) {
      console.error('Error fetching user credits:', fetchError)
      return false
    }
    
    if (userData.credits < creditsToDeduct) {
      console.error('Insufficient credits')
      return false
    }
    
    // Deduct credits
    const { error } = await supabase
      .from('users')
      .update({ credits: userData.credits - creditsToDeduct })
      .eq('id', userId)
    
    if (error) {
      console.error('Error deducting credits:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error deducting credits:', error)
    return false
  }
}

export async function addCredits(userId: string, creditsToAdd: number): Promise<boolean> {
  const supabase = createServerSupabase()
  
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        credits: supabase.raw('credits + ?', [creditsToAdd])
      })
      .eq('id', userId)
    
    if (error) {
      console.error('Error adding credits:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error adding credits:', error)
    return false
  }
}

export async function canGenerate(userId: string): Promise<{ canGenerate: boolean; credits: number }> {
  const userCredits = await getUserCredits(userId)
  
  if (!userCredits) {
    return { canGenerate: false, credits: 0 }
  }
  
  return { 
    canGenerate: userCredits.credits > 0, 
    credits: userCredits.credits 
  }
}
