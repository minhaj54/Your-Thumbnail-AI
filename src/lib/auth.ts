import { createServerSupabase } from '@/lib/supabase/server'

export async function getUser() {
  const supabase = createServerSupabase()
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createServerSupabase()
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

export async function getUserCredits(userId: string) {
  const supabase = createServerSupabase()
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user credits:', error)
      return 0
    }
    
    return data?.credits || 0
  } catch (error) {
    console.error('Error getting user credits:', error)
    return 0
  }
}

export async function deductCredits(userId: string, creditsToDeduct: number = 1) {
  const supabase = createServerSupabase()
  
  try {
    const { error } = await supabase.rpc('deduct_user_credits', {
      user_id: userId,
      credits_to_deduct: creditsToDeduct
    })
    
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
