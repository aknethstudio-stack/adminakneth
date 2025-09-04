'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { GrClose } from 'react-icons/gr'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useAuth } from '@/lib/auth-context'

/**
 * Renders a responsive Header component with Supabase authentication.
 * Desktop: horizontal menu, Mobile: hamburger with off-canvas menu
 * Uses CSS variables for theming with nav-pill active states
 * Integrates with Supabase authentication and admin-only access
 */
function Header() {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, isLoading, signOut } = useAuth()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ensure the menuRef.current exists and the click is outside of it,
      // and also outside the hamburger button itself if it's considered part of the menu interaction.
      // The button is inside a div with ref={menuRef}, so checking menuRef should cover it.
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleLinkClick = () => {
    setShowMenu(false)
  }

  const isActivePage = (path: string) => {
    return pathname === path
  }

  const getNavLinkStyle = (path: string, isMobile: boolean = false) => {
    const baseStyle = {
      padding: isMobile ? '0.75rem 1rem' : '0.5rem 1rem',
      borderRadius: 'var(--border-radius-nav-pills)',
      transition: 'all 0.2s',
      textDecoration: 'none',
      display: isMobile ? 'block' : 'inline-block',
    }

    if (isActivePage(path)) {
      return {
        ...baseStyle,
        backgroundColor: 'var(--color-nav-active-bg)',
        color: 'var(--color-dark)',
        fontWeight: '500',
      }
    }

    return {
      ...baseStyle,
      backgroundColor: 'transparent',
      color: 'var(--color-light)',
    }
  }

  // Common hover/focus and blur/leave logic for nav links
  const handleNavInteraction = (
    e:
      | React.FocusEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLAnchorElement>,
    path: string,
    isEnteringOrFocusing: boolean,
  ) => {
    if (isActivePage(path)) return // Don't change active items

    if (isEnteringOrFocusing) {
      e.currentTarget.style.color = 'var(--color-nav-active-bg)'
    } else {
      e.currentTarget.style.color = 'var(--color-light)'
    }
  }

  // Common hover/focus and blur/leave logic for auth buttons
  const handleAuthButtonInteraction = (
    e:
      | React.FocusEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement>,
    isEnteringOrFocusing: boolean,
  ) => {
    if (isLoading) return

    if (isEnteringOrFocusing) {
      if (isAuthenticated) {
        e.currentTarget.style.color = '#ef4444'
        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.8)'
        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
      } else {
        e.currentTarget.style.color = 'var(--color-dark)'
        e.currentTarget.style.backgroundColor = 'var(--color-nav-active-bg)'
        // Explicitly set borderColor for consistency when not authenticated,
        // ensuring all style properties are handled symmetrically.
        e.currentTarget.style.borderColor = 'var(--color-nav-active-bg)'
      }
    } else {
      e.currentTarget.style.color = 'var(--color-light)'
      e.currentTarget.style.backgroundColor = 'transparent'
      e.currentTarget.style.borderColor = isAuthenticated
        ? 'rgba(239, 68, 68, 0.5)'
        : 'var(--color-nav-active-bg)'
    }
  }

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      try {
        await signOut()
        router.push('/')
      } catch (error) {
        console.error('Error signing out:', error)
      }
    } else {
      router.push('/login')
    }
  }

  return (
    <>
      <header
        className="w-full px-4 py-3 shadow-md relative z-50"
        style={{ backgroundColor: 'var(--color-dark)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - neutral, no active state */}
          <Link
            href="/"
            className="text-2xl font-bold transition-colors hover:opacity-80"
            style={{ color: 'var(--color-light)', textDecoration: 'none' }}
          >
            Admin Panel
          </Link>

          {/* User info - show when authenticated */}
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center mr-4">
              <span
                className="text-sm mr-4"
                style={{ color: 'var(--color-secondary)' }}
              >
                Welcome, {user.email}
              </span>
            </div>
          )}

          {/* Desktop Navigation - only show if authenticated and admin */}
          {isAuthenticated && isAdmin && (
            <nav className="hidden md:flex items-center">
              <ul
                className="flex items-center space-x-2"
                style={{ listStyle: 'none', margin: 0, padding: 0 }}
              >
                <li>
                  <Link
                    href="/dashboard"
                    style={getNavLinkStyle('/dashboard')}
                    onMouseEnter={(e) =>
                      handleNavInteraction(e, '/dashboard', true)
                    }
                    onMouseLeave={(e) =>
                      handleNavInteraction(e, '/dashboard', false)
                    }
                    onFocus={(e) => handleNavInteraction(e, '/dashboard', true)}
                    onBlur={(e) => handleNavInteraction(e, '/dashboard', false)}
                  >
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    href="/settings"
                    style={getNavLinkStyle('/settings')}
                    onMouseEnter={(e) =>
                      handleNavInteraction(e, '/settings', true)
                    }
                    onMouseLeave={(e) =>
                      handleNavInteraction(e, '/settings', false)
                    }
                    onFocus={(e) => handleNavInteraction(e, '/settings', true)}
                    onBlur={(e) => handleNavInteraction(e, '/settings', false)}
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          )}

          {/* Auth Button - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={handleAuthAction}
              disabled={isLoading}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius-nav-pills)',
                transition: 'all 0.2s',
                textDecoration: 'none',
                color: 'var(--color-light)',
                border: isAuthenticated
                  ? '1px solid rgba(239, 68, 68, 0.5)'
                  : '1px solid var(--color-nav-active-bg)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              onMouseOver={(e) => handleAuthButtonInteraction(e, true)}
              onMouseOut={(e) => handleAuthButtonInteraction(e, false)}
              onFocus={(e) => handleAuthButtonInteraction(e, true)}
              onBlur={(e) => handleAuthButtonInteraction(e, false)}
            >
              {isLoading ? 'Loading...' : isAuthenticated ? 'Logout' : 'Login'}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden" ref={menuRef}>
            <button
              onClick={() => { setShowMenu(!showMenu); }}
              className="p-2 transition-colors"
              style={{
                color: 'var(--color-light)',
                background: 'none',
                border: 'none',
              }}
              aria-expanded={showMenu}
              aria-controls="mobile-menu"
            >
              {showMenu ? (
                <GrClose className="w-6 h-6" />
              ) : (
                <GiHamburgerMenu className="w-6 h-6" />
              )}
            </button>

            {/* Mobile Off-Canvas Menu */}
            {showMenu && (
              <div
                id="mobile-menu"
                className="fixed top-0 right-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50 md:hidden"
                style={{ backgroundColor: 'var(--color-dark)' }}
              >
                <div className="flex flex-col h-full">
                  {/* Menu header */}
                  <div
                    className="flex items-center justify-between p-4"
                    style={{ borderBottom: '1px solid var(--color-secondary)' }}
                  >
                    <span
                      className="text-lg font-semibold"
                      style={{ color: 'var(--color-light)' }}
                    >
                      Menu
                    </span>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="p-2 transition-colors"
                      style={{
                        color: 'var(--color-light)',
                        background: 'none',
                        border: 'none',
                      }}
                    >
                      <GrClose className="w-5 h-5" />
                    </button>
                  </div>

                  {/* User info mobile */}
                  {isAuthenticated && user && (
                    <div
                      className="p-4"
                      style={{
                        borderBottom: '1px solid var(--color-secondary)',
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{ color: 'var(--color-secondary)' }}
                      >
                        Signed in as:
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: 'var(--color-light)' }}
                      >
                        {user.email}
                      </p>
                    </div>
                  )}

                  {/* Menu items - only show nav if authenticated and admin */}
                  <nav className="flex-1 px-4 py-6">
                    <ul
                      className="space-y-2"
                      style={{ listStyle: 'none', margin: 0, padding: 0 }}
                    >
                      {isAuthenticated && isAdmin && (
                        <>
                          <li>
                            <Link
                              href="/dashboard"
                              onClick={handleLinkClick}
                              style={getNavLinkStyle('/dashboard', true)}
                              onMouseEnter={(e) =>
                                handleNavInteraction(e, '/dashboard', true)
                              }
                              onMouseLeave={(e) =>
                                handleNavInteraction(e, '/dashboard', false)
                              }
                              onFocus={(e) =>
                                handleNavInteraction(e, '/dashboard', true)
                              }
                              onBlur={(e) =>
                                handleNavInteraction(e, '/dashboard', false)
                              }
                            >
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/settings"
                              onClick={handleLinkClick}
                              style={getNavLinkStyle('/settings', true)}
                              onMouseEnter={(e) =>
                                handleNavInteraction(e, '/settings', true)
                              }
                              onMouseLeave={(e) =>
                                handleNavInteraction(e, '/settings', false)
                              }
                              onFocus={(e) =>
                                handleNavInteraction(e, '/settings', true)
                              }
                              onBlur={(e) =>
                                handleNavInteraction(e, '/settings', false)
                              }
                            >
                              Settings
                            </Link>
                          </li>
                        </>
                      )}

                      {/* Auth Button - Mobile */}
                      <li
                        style={{
                          paddingTop: isAuthenticated && isAdmin ? '1rem' : '0',
                          borderTop:
                            isAuthenticated && isAdmin
                              ? '1px solid var(--color-secondary)'
                              : 'none',
                        }}
                      >
                        <button
                          onClick={() => {
                            handleAuthAction()
                            handleLinkClick()
                          }}
                          disabled={isLoading}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--border-radius-nav-pills)',
                            transition: 'all 0.2s',
                            textDecoration: 'none',
                            color: 'var(--color-light)',
                            border: isAuthenticated
                              ? '1px solid rgba(239, 68, 68, 0.5)'
                              : '1px solid var(--color-nav-active-bg)',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            textAlign: 'left',
                          }}
                          onMouseOver={(e) =>
                            { handleAuthButtonInteraction(e, true); }
                          }
                          onMouseOut={(e) =>
                            handleAuthButtonInteraction(e, false)
                          }
                          onFocus={(e) => handleAuthButtonInteraction(e, true)}
                          onBlur={(e) => handleAuthButtonInteraction(e, false)}
                        >
                          {isLoading
                            ? 'Loading...'
                            : isAuthenticated
                              ? 'Logout'
                              : 'Login'}
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Mobile menu overlay */}
      {showMenu && (
        <button
          type="button"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMenu(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowMenu(false)
            }
          }}
          aria-label="Close menu overlay"
          tabIndex={0}
          style={{
            border: 'none',
            padding: 0,
            margin: 0,
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
    </>
  )
}

export default Header
