import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const searchParams = request.nextUrl.searchParams
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'recent' // 'recent' or 'popular'
    const search = searchParams.get('search') || ''

    // Calculate offset
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('prompt_library')
      .select('id, thumbnail_url, thumbnail_base64, extracted_prompt, source_type, view_count, created_at', { count: 'exact' })

    // Apply search filter
    if (search.trim()) {
      query = query.ilike('extracted_prompt', `%${search.trim()}%`)
    }

    // Apply sorting
    if (sort === 'popular') {
      query = query.order('view_count', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching prompt library:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch prompts'
        },
        { status: 500 }
      )
    }

    // Calculate pagination info
    const totalPages = count ? Math.ceil(count / limit) : 0
    const hasMore = page < totalPages

    return NextResponse.json({
      success: true,
      data: {
        prompts: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasMore
        }
      }
    })

  } catch (error) {
    console.error('Prompt library list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prompts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

