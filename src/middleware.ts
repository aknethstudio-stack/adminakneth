import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/users', '/settings']

// Auth routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login']

// Server-side admin emails validation (secure, not exposed to client)
const ALLOWED_ADMIN_EMAILS = process.env.ALLOWED_ADMIN_EMAILS?.split(',') || []

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  )
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  )

  // Check if user is admin using server-side validation (secure)
  const isAdmin =
    user?.email &&
    ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase().trim())

  // Redirect to login if accessing protected route without admin privileges
  if (isProtectedRoute && (!user || !isAdmin)) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if authenticated admin tries to access auth routes
  if (isAuthRoute && user && isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is authenticated but not admin, sign them out and redirect
  if (user && !isAdmin && (isProtectedRoute || isAuthRoute)) {
    await supabase.auth.signOut({ scope: 'local' })
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('error', 'unauthorized')
    redirectUrl.searchParams.set(
      'message',
      'Access denied. Admin privileges required for this panel.',
    )
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
}
