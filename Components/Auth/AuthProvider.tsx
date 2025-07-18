// context/AuthContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '@/api'
import { jwtDecode } from 'jwt-decode'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean | null
  authError: boolean | string
  user: any
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  authError: false,
  user: null,
  loading: true,
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [authError, setAuthError] = useState<boolean | string>(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const isTokenExpired = (token: string) => {
    try {
      const decoded = jwtDecode(token)
      const currentTime = Math.floor(Date.now() / 1000)
      return (decoded.exp ?? 0) < currentTime
    } catch {
      return true
    }
  }

  const getTokens = () => {
    try {
      const tokens = localStorage.getItem('tokens')
      return tokens ? JSON.parse(tokens) : null
    } catch {
      return null
    }
  }

  const refreshToken = async (refresh: string) => {
    try {
      const response = await api.post('/auth/jwt/refresh/', { refresh })
      localStorage.setItem('tokens', JSON.stringify(response.data))
      return response.data.access
    } catch (error) {
      throw new Error("Can't refresh token")
    }
  }

  const getUser = async () => {
    try {
      const response = await api.get('/core/getme')
      localStorage.setItem('me', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const checkSubscription = (userData: any) => {
    console.log(userData,'user data ....')
    if (userData?.subscription_type === 'N') {
      router.push('/payment')
      return false
    }
    return true
  }

  const authenticate = async () => {
    setLoading(true)
    try {
      const tokens = getTokens()
      
      if (!tokens) {
        setIsAuthenticated(false)
        if (pathname !== '/auth') router.push('/onboarding')
        return
      }

      let { access, refresh } = tokens
      
      // Refresh token if expired
      if (!access || isTokenExpired(access)) {
        if (!refresh) {
          setIsAuthenticated(false)
          if (pathname !== '/onboarding') router.push('/auth')
          return
        }
        access = await refreshToken(refresh)
      }

      // Get user data
      const userData = await getUser()
      if (!userData) {
        console.log('a')
        setIsAuthenticated(false)
        if (pathname !== '/auth') router.push('/auth')
        return
      }

      // Check subscription
      console.log('ruing 19760')
      if (!checkSubscription(userData)) {
        setIsAuthenticated(false)
        return
      }

      setUser(userData)
      setIsAuthenticated(true)
      
      // Redirect from auth pages if already authenticated
      if (pathname === '/auth' || pathname === '/onboarding') {
        router.push('/home')
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed')
      setIsAuthenticated(false)
      if (pathname !== '/auth') router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('tokens')
    localStorage.removeItem('me')
    authenticate()
    router.push('/auth')
  }

  useEffect(() => {
    authenticate()
  }, [pathname])

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      authError, 
      user, 
      loading, 
      logout 
    }}>
      { isAuthenticated && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)