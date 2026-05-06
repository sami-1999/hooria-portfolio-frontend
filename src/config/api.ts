'use client'

// API Configuration
export const API_CONFIG = {
  // Base URL for API requests - change this for different environments
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // API endpoints
  ENDPOINTS: {
    // Admin endpoints
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_DASHBOARD: '/api/admin/dashboard',
    
    // Contact endpoints
    CONTACT: '/api/contact',
    
    // Review endpoints
    REVIEWS: '/api/reviews',
    
    // Visitor endpoints
    VISITORS: '/api/visitors',
    
    // Health check
    HEALTH: '/api/health'
  }
}

// Helper function to make API requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    return response
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

export default API_CONFIG
