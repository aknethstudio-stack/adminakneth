import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  isAdmin: boolean
}

/**
 * Check if a user email is in the allowed admin list (server-side only)
 * This function can only be used in server components and API routes
 */
export const isAdminEmailServer = (email: string | undefined): boolean => {
  if (!email) return false

  const allowedAdmins = process.env.ALLOWED_ADMIN_EMAILS?.split(',') || []
  return allowedAdmins.includes(email.toLowerCase().trim())
}

/**
 * Check if a user email is admin via API call (client-side)
 */
export const isAdminEmail = async (
  email: string | null | undefined,
): Promise<boolean> => {
  if (!email) return false

  try {
    const response = await fetch('/api/auth/validate-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    })

    if (!response.ok) return false

    const { isAdmin } = await response.json()
    return isAdmin
  } catch (error) {
    console.error('Error validating admin email:', error)
    return false
  }
}

/**
 * Get current authenticated user with admin status
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Check admin status via API
    const isAdmin = await isAdminEmail(user.email)

    return {
      ...user,
      isAdmin,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (error) {
      return { data: null, error }
    }

    // Check admin status after successful login
    if (data.user) {
      const isAdmin = await isAdminEmail(data.user.email)
      if (!isAdmin) {
        await supabase.auth.signOut()
        return {
          data: null,
          error: {
            message:
              'Access denied. Admin privileges required for this application.',
          },
        }
      }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error signing in:', error)
    return {
      data: null,
      error: { message: 'An unexpected error occurred during sign in.' },
    }
  }
}

/**
 * Sign in with magic link
 */
export const signInWithMagicLink = async (email: string) => {
  try {
    // Check if email is allowed before sending magic link
    const isAdmin = await isAdminEmail(email)
    if (!isAdmin) {
      return {
        data: null,
        error: {
          message:
            'Access denied. Admin privileges required for this application.',
        },
      }
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    return { data, error }
  } catch (error) {
    console.error('Error sending magic link:', error)
    return {
      data: null,
      error: {
        message: 'An unexpected error occurred while sending magic link.',
      },
    }
  }
}

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      return { error }
    }

    // Clear any app specific local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin-panel-user')
    }

    return { error: null }
  } catch (error) {
    console.error('Error signing out:', error)
    return {
      error: { message: 'An unexpected error occurred during sign out.' },
    }
  }
}

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void,
) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      // Check admin status via API
      const isAdmin = await isAdminEmail(session.user.email)

      const authUser: AuthUser = {
        ...session.user,
        isAdmin,
      }

      // If user is not admin, sign them out immediately
      if (!authUser.isAdmin) {
        console.warn(
          `Non-admin user attempted to access admin panel: ${session.user.email}`,
        )
        await signOut()
        callback(null)
        return
      }

      // Store admin user info locally
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'admin-panel-user',
          JSON.stringify({
            email: authUser.email,
            id: authUser.id,
            isAdmin: true,
            lastAccess: new Date().toISOString(),
          }),
        )
      }

      callback(authUser)
    } else {
      // Clean up admin-specific storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin-panel-user')
      }
      callback(null)
    }
  })
}

/**
 * Check if current session is valid and user is admin
 */
export const validateAdminSession = async (): Promise<boolean> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.email) {
      return false
    }

    const isValidAdmin = await isAdminEmail(session.user.email)

    // Update local storage if admin
    if (isValidAdmin && typeof window !== 'undefined') {
      localStorage.setItem(
        'admin-panel-user',
        JSON.stringify({
          email: session.user.email,
          id: session.user.id,
          isAdmin: true,
          lastAccess: new Date().toISOString(),
        }),
      )
    }

    return isValidAdmin
  } catch (error) {
    console.error('Error validating admin session:', error)
    return false
  }
}

/**
 * Refresh the current session
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (data?.session?.user) {
      const isAdmin = await isAdminEmail(data.session.user.email)
      if (!isAdmin) {
        // If refreshed user is not admin, sign out
        await signOut()
        return {
          data: null,
          error: { message: 'Session invalid for admin panel' },
        }
      }
    }

    return { data, error }
  } catch (error) {
    console.error('Error refreshing session:', error)
    return { data: null, error }
  }
}

/**
 * Get stored admin user info (fallback when session is loading)
 */
export const getStoredAdminUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem('admin-panel-user')
    return stored ? (JSON.parse(stored) as unknown as AuthUser) : null
  } catch {
    return null
  }
}
