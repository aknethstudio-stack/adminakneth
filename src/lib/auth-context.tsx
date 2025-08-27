'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser, onAuthStateChange, getCurrentUser } from './auth'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  signOut: async () => {},
  refreshUser: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  const handleSignOut = async () => {
    try {
      const { signOut: supabaseSignOut } = await import('./auth')
      await supabaseSignOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    // Get initial user
    getCurrentUser()
      .then(setUser)
      .catch((error) => {
        console.error('Error getting initial user:', error)
        setUser(null)
      })
      .finally(() => setIsLoading(false))

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((authUser) => {
      setUser(authUser)
      setIsLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    signOut: handleSignOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
