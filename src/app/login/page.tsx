'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmail, signInWithMagicLink } from '@/lib/auth'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>(
    'password',
  )

  // Magic link is available for web app

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Handle URL error params on component mount
  useEffect(() => {
    const urlError = searchParams.get('error')
    const urlMessage = searchParams.get('message')

    if (urlError && urlMessage) {
      switch (urlError) {
        case 'unauthorized':
          setError(
            'Access denied. This admin panel is restricted to authorized administrators only.',
          )
          break
        case 'oauth_error':
          setError(`Authentication failed: ${decodeURIComponent(urlMessage)}`)
          break
        case 'auth_error':
          setError(`Login error: ${decodeURIComponent(urlMessage)}`)
          break
        case 'missing_code':
          setError('Invalid authentication link. Please try logging in again.')
          break
        case 'no_session':
          setError(
            'Authentication session could not be established. Please try again.',
          )
          break
        case 'unexpected':
          setError('An unexpected error occurred. Please try again.')
          break
        default:
          setError(decodeURIComponent(urlMessage))
      }

      // Clear URL params after displaying error
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      newUrl.searchParams.delete('message')
      router.replace(newUrl.pathname)
    }
  }, [searchParams, router])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await signInWithEmail(email, password)

      if (error) {
        setError(error.message)
        return
      }

      setSuccess('Login successful! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 1000)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await signInWithMagicLink(email)

      if (error) {
        setError(error.message)
        return
      }

      setSuccess(
        'Magic link sent! Check your email and click the link to sign in.',
      )
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-body-background)' }}
    >
      <div
        className="max-w-md w-full p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: 'var(--color-light)' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-2xl font-bold transition-colors hover:opacity-80"
            style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
          >
            Admin Panel
          </Link>
          <h1
            className="text-xl font-semibold mt-4 mb-2"
            style={{ color: 'var(--color-body-text)' }}
          >
            Admin Login
          </h1>
          <p style={{ color: 'var(--color-secondary)' }}>
            Access restricted to authorized administrators only
          </p>
        </div>

        {/* Login Method Toggle */}
        <div
          className="flex rounded-lg mb-6"
          style={{ backgroundColor: 'var(--color-body-background)' }}
        >
          <button
            type="button"
            onClick={() => setLoginMethod('password')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-all duration-200 ${
              loginMethod === 'password' ? 'rounded-lg' : ''
            }`}
            style={{
              backgroundColor:
                loginMethod === 'password'
                  ? 'var(--color-primary)'
                  : 'transparent',
              color:
                loginMethod === 'password'
                  ? 'var(--color-dark)'
                  : 'var(--color-secondary)',
            }}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('magic')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-all duration-200 ${
              loginMethod === 'magic' ? 'rounded-lg' : ''
            }`}
            style={{
              backgroundColor:
                loginMethod === 'magic'
                  ? 'var(--color-primary)'
                  : 'transparent',
              color:
                loginMethod === 'magic'
                  ? 'var(--color-dark)'
                  : 'var(--color-secondary)',
            }}
          >
            Magic Link
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div
            className="p-4 rounded-lg mb-4 text-sm"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="p-4 rounded-lg mb-4 text-sm"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#16a34a',
            }}
          >
            {success}
          </div>
        )}

        {/* Login Forms */}
        {loginMethod === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-body-text)' }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--color-secondary)',
                  backgroundColor: 'var(--color-body-background)',
                  color: 'var(--color-body-text)',
                  borderRadius: 'var(--border-radius-nav-pills)',
                }}
                placeholder="admin@yourdomain.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-body-text)' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--color-secondary)',
                  backgroundColor: 'var(--color-body-background)',
                  color: 'var(--color-body-text)',
                  borderRadius: 'var(--border-radius-nav-pills)',
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 font-medium rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-dark)',
                borderRadius: 'var(--border-radius-nav-pills)',
                border: 'none',
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
            <div>
              <label
                htmlFor="magic-email"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-body-text)' }}
              >
                Email Address
              </label>
              <input
                id="magic-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--color-secondary)',
                  backgroundColor: 'var(--color-body-background)',
                  color: 'var(--color-body-text)',
                  borderRadius: 'var(--border-radius-nav-pills)',
                }}
                placeholder="admin@yourdomain.com"
              />
            </div>

            <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>
              We'll send you a secure login link. No password required.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 font-medium rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-dark)',
                borderRadius: 'var(--border-radius-nav-pills)',
                border: 'none',
              }}
            >
              {isLoading ? 'Sending Link...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: 'var(--color-link)', textDecoration: 'none' }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
