'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { isAuthenticated, isAdmin, user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect authenticated admin users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isAdmin, isLoading, router])

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-body-background)' }}
      >
        <div
          className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-primary)' }}
        />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-body-background)' }}
    >
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: 'var(--color-body-text)' }}
          >
            Admin Panel
          </h1>
          <p
            className="text-xl md:text-2xl mb-8"
            style={{ color: 'var(--color-secondary)' }}
          >
            Secure web-based administration interface
          </p>

          {/* Show different content based on auth state */}
          {!isAuthenticated && (
            <div className="space-y-4">
              <p className="mb-8" style={{ color: 'var(--color-body-text)' }}>
                Access restricted to authorized administrators only.
              </p>
              <Link
                href="/login"
                className="inline-block py-3 px-8 font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-dark)',
                  textDecoration: 'none',
                  borderRadius: 'var(--border-radius-nav-pills)',
                }}
              >
                Admin Login
              </Link>
            </div>
          )}

          {isAuthenticated && !isAdmin && (
            <div
              className="p-6 rounded-lg max-w-md mx-auto"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              <h2
                className="text-lg font-semibold mb-2"
                style={{ color: '#dc2626' }}
              >
                Access Denied
              </h2>
              <p className="mb-4" style={{ color: 'var(--color-body-text)' }}>
                You are signed in as {user?.email}, but this account does not
                have admin privileges.
              </p>
              <Link
                href="/login"
                className="text-sm underline"
                style={{ color: 'var(--color-link)' }}
              >
                Sign in with admin account
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: 'var(--color-body-text)' }}
          >
            Admin Panel Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="p-6 rounded-lg shadow-md text-center"
              style={{ backgroundColor: 'var(--color-light)' }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--color-dark)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: 'var(--color-body-text)' }}
              >
                Dashboard
              </h3>
              <p style={{ color: 'var(--color-secondary)' }}>
                Monitor system metrics, user activity, and key performance
                indicators in real-time.
              </p>
            </div>

            <div
              className="p-6 rounded-lg shadow-md text-center"
              style={{ backgroundColor: 'var(--color-light)' }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--color-dark)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: 'var(--color-body-text)' }}
              >
                User Management
              </h3>
              <p style={{ color: 'var(--color-secondary)' }}>
                Manage user accounts, permissions, and access controls with
                comprehensive admin tools.
              </p>
            </div>

            <div
              className="p-6 rounded-lg shadow-md text-center"
              style={{ backgroundColor: 'var(--color-light)' }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--color-dark)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: 'var(--color-body-text)' }}
              >
                System Settings
              </h3>
              <p style={{ color: 'var(--color-secondary)' }}>
                Configure application settings, security policies, and system
                preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="p-8 rounded-lg"
            style={{ backgroundColor: 'var(--color-light)' }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#16a34a' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--color-body-text)' }}
            >
              Secure by Design
            </h2>
            <p
              className="text-lg mb-6"
              style={{ color: 'var(--color-secondary)' }}
            >
              Built with security best practices, including encrypted
              authentication, role-based access control, and comprehensive audit
              logging.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <span style={{ color: 'var(--color-body-text)' }}>
                  Multi-factor Authentication
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <span style={{ color: 'var(--color-body-text)' }}>
                  Encrypted Data Transmission
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <span style={{ color: 'var(--color-body-text)' }}>
                  Session Management
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <span style={{ color: 'var(--color-body-text)' }}>
                  Access Logging
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
