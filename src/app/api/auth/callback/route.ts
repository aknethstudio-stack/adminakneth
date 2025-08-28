import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// Server-side admin emails validation (secure, not exposed to client)
const ALLOWED_ADMIN_EMAILS = process.env.ALLOWED_ADMIN_EMAILS?.split(',') || []

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/login?error=oauth_error&message=${encodeURIComponent(errorDescription || error)}`,
    )
  }

  if (!code) {
    console.error('No code parameter found in auth callback')
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = await createClient()

  try {
    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(
        `${origin}/login?error=auth_error&message=${encodeURIComponent(exchangeError.message)}`,
      )
    }

    if (!data.session || !data.user?.email) {
      console.error('No session or user email found after code exchange')
      return NextResponse.redirect(`${origin}/login?error=no_session`)
    }

    const userEmail = data.user.email.toLowerCase().trim()

    // Server-side admin validation (secure)
    const isAdmin = ALLOWED_ADMIN_EMAILS.includes(userEmail)

    if (!isAdmin) {
      console.warn(`Unauthorized admin panel access attempt by: ${userEmail}`)

      // Sign out the unauthorized user from this session
      await supabase.auth.signOut({ scope: 'local' })

      return NextResponse.redirect(
        `${origin}/login?error=unauthorized&message=${encodeURIComponent('Access denied. This panel is restricted to authorized administrators only.')}`,
      )
    }

    // Create successful redirect response
    const redirectUrl = next.startsWith('/')
      ? `${origin}${next}`
      : `${origin}/dashboard`
    const response = NextResponse.redirect(redirectUrl)

    // Set secure cookies for the admin session
    const sessionCookies = [
      {
        name: `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('://')[1]?.split('.')[0]}-auth-token`,
        value: JSON.stringify(data.session),
      },
    ]

    sessionCookies.forEach((cookie) => {
      response.cookies.set({
        name: cookie.name,
        value: cookie.value,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    })

    // Set admin-specific identifier cookie
    response.cookies.set({
      name: 'admin-panel-auth',
      value: 'true',
      httpOnly: false, // Allow client-side access for UI state
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log(`Successful admin panel login: ${userEmail}`)
    return response
  } catch (error) {
    console.error('Unexpected error during admin auth callback:', error)
    return NextResponse.redirect(
      `${origin}/login?error=unexpected&message=${encodeURIComponent('An unexpected error occurred during authentication.')}`,
    )
  }
}
