'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiRequest, API_CONFIG } from '../config/api'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      setIsAuthenticated(false)
      setIsLoading(false)
      return
    }

    // Optional: Validate token with backend
    validateToken(token)
  }

  const validateToken = async (token: string) => {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setIsAuthenticated(true)
        // You could decode JWT to get admin info, but for now just set authenticated
        setAdmin({ token })
      } else {
        // Token invalid, remove it
        localStorage.removeItem('adminToken')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Token validation error:', error)
      localStorage.removeItem('adminToken')
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.ADMIN_LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.token)
        setAdmin(data.admin)
        setIsAuthenticated(true)
        return { success: true, message: 'Login successful' }
      } else {
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Network error' }
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setAdmin(null)
    router.push('/admin')
  }

  return {
    isAuthenticated,
    isLoading,
    admin,
    login,
    logout,
    checkAuth
  }
}
