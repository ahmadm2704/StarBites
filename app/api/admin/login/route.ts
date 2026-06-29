import { NextRequest, NextResponse } from 'next/server'

// Demo credentials - In production, check against Supabase admin_users table
const DEMO_EMAIL = 'admin@starbites.pk'
const DEMO_PASSWORD = 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate credentials
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

      return NextResponse.json({
        success: true,
        token,
        message: 'Login successful',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
