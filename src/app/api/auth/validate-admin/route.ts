import { NextResponse, type NextRequest } from 'next/server'

// Server-side admin emails validation (secure, not exposed to client)
const ALLOWED_ADMIN_EMAILS = process.env.ALLOWED_ADMIN_EMAILS?.split(',') || []

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required', isAdmin: false },
        { status: 400 },
      )
    }

    // Check if email is in the allowed admin list
    const isAdmin = ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase().trim())

    // Log admin validation attempts (for security monitoring)
    if (isAdmin) {
      console.log(`Admin validation successful for: ${email}`)
    } else {
      console.warn(`Admin validation failed for: ${email}`)
    }

    return NextResponse.json({ isAdmin }, { status: 200 })
  } catch (error) {
    console.error('Error validating admin email:', error)
    return NextResponse.json(
      { error: 'Internal server error', isAdmin: false },
      { status: 500 },
    )
  }
}
