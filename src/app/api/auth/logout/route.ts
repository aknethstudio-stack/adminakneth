import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {
    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      return NextResponse.json(
        { error: 'Failed to sign out', details: error.message },
        { status: 500 },
      )
    }

    // Create response
    const response = NextResponse.json(
      { message: 'Successfully signed out' },
      { status: 200 },
    )

    // Remove all Supabase auth cookies
    const cookies = request.cookies.getAll()
    cookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.delete({
          name: cookie.name,
          path: '/',
        })
      }
    })

    console.log('User successfully signed out')
    return response
  } catch (error) {
    console.error('Unexpected error during logout:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during logout' },
      { status: 500 },
    )
  }
}
