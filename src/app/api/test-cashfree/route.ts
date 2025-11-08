import { NextResponse } from 'next/server'
import { getCashfreeInstance } from '@/lib/cashfree'

export async function GET() {
  try {
    const cashfree = getCashfreeInstance()

    return NextResponse.json({
      success: true,
      environment: cashfree.XEnvironment === 1 ? 'SANDBOX' : 'PRODUCTION',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}


