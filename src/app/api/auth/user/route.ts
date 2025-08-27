import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// Server-side admin emails validation (secure, not exposed to client)
const ALLOWED_ADMIN_EMAILS = process.env.ALLOWED_ADMIN_EMAILS?.split(',') || []

export async function GET(_request: NextRequest) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting user:', error)
      return NextResponse.json(
        { error: 'Failed to get user', details: error.message },
        { status: 401 },
      )
    }

    if (!user) {
      return NextResponse.json(
        { user: null, isAuthenticated: false, isAdmin: false },
        { status: 200 },
      )
    }

    // Server-side admin validation (secure)
    const isAdmin =
      user.email &&
      ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase().trim())

    // If user is not admin, sign them out
    if (!isAdmin) {
      console.warn(`Unauthorized access attempt by: ${user.email}`)
      await supabase.auth.signOut()

      return NextResponse.json(
        {
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          error: 'Access denied. Admin privileges required.',
        },
        { status: 403 },
      )
    }

    // Return user with admin status
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          isAdmin: true,
        },
        isAuthenticated: true,
        isAdmin: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Unexpected error getting user:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while getting user' },
      { status: 500 },
    )
  }
}
