import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('id, email, credits, subscription_tier, created_at, updated_at')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's email from auth.users (it's the source of truth)
    const email = user.email || profileData.email

    // Get the most recent completed subscription to determine current plan
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('plan_type, status, created_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)

    // Determine subscription tier: use latest subscription if available, otherwise use user's subscription_tier
    let subscriptionTier = profileData.subscription_tier || 'free'
    
    if (subscriptions && subscriptions.length > 0 && !subError) {
      const latestSubscription = subscriptions[0]
      // Use the plan_type from the most recent completed subscription
      subscriptionTier = latestSubscription.plan_type
      
      // If the user's subscription_tier doesn't match, update it
      if (profileData.subscription_tier !== latestSubscription.plan_type) {
        await supabase
          .from('users')
          .update({ subscription_tier: latestSubscription.plan_type })
          .eq('id', user.id)
        
        // Update local variable for response
        subscriptionTier = latestSubscription.plan_type
      }
    }

    // Get generation stats
    const { count: thumbnailsCount } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Calculate total credits used
    const { data: generations } = await supabase
      .from('generations')
      .select('credits_used')
      .eq('user_id', user.id)

    const creditsUsed = generations?.reduce((sum, gen) => sum + (gen.credits_used || 0), 0) || 0

    return NextResponse.json({
      success: true,
      data: {
        email,
        created_at: profileData.created_at,
        credits: profileData.credits,
        subscription_tier: subscriptionTier,
        thumbnails_created: thumbnailsCount || 0,
        credits_used: creditsUsed,
      }
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updates: any = {}

    // Only allow updating specific fields (add more as needed)
    if (body.subscription_tier !== undefined) {
      updates.subscription_tier = body.subscription_tier
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
