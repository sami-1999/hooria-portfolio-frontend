'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, Mail, Star, TrendingUp, Eye } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { apiRequest, API_CONFIG } from '../../../config/api'

interface DashboardStats {
  totalContacts: number
  newContacts: number
  totalVisits: number
  uniqueVisitors: number
  todayVisits: number
  totalReviews: number
  activeReviews: number
}

interface Contact {
  id: string
  name: string
  email: string
  whatsapp: string
  projectDetails: string
  status: string
  createdAt: string
}

interface Review {
  id: string
  name: string
  rating: number
  message: string
  isActive: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentContacts, setRecentContacts] = useState<Contact[]>([])
  const [recentReviews, setRecentReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetchDashboardData(token)
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data.stats)
        setRecentContacts(data.data.recentContacts || [])
        setRecentReviews(data.data.recentReviews || [])
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin')
      } else {
        setError('Failed to fetch dashboard data')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="dark-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Mail className="w-8 h-8 text-neon-cyan" />
              <span className="text-2xl font-bold text-white">{stats?.totalContacts || 0}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Total Contacts</h3>
            <p className="text-sm text-light-gray">{stats?.newContacts || 0} new this week</p>
          </div>

          <div className="dark-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-neon-cyan" />
              <span className="text-2xl font-bold text-white">{stats?.totalVisits || 0}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Total Visits</h3>
            <p className="text-sm text-light-gray">{stats?.uniqueVisitors || 0} unique visitors</p>
          </div>

          <div className="dark-card p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-neon-cyan" />
              <span className="text-2xl font-bold text-white">{stats?.todayVisits || 0}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Today's Visits</h3>
            <p className="text-sm text-light-gray">Live tracking</p>
          </div>

          <div className="dark-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-neon-cyan" />
              <span className="text-2xl font-bold text-white">{stats?.totalReviews || 0}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Total Reviews</h3>
            <p className="text-sm text-light-gray">{stats?.activeReviews || 0} active</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Contacts */}
          <div className="dark-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Contacts</h2>
            <div className="space-y-4">
              {recentContacts && recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <div key={contact.id} className="border-b border-gray-800 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{contact.name}</h3>
                      <span className="text-xs px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded">
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-light-gray mb-1">{contact.email}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{contact.projectDetails}</p>
                    <p className="text-xs text-gray-600 mt-2">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent contacts found</p>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="dark-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {recentReviews && recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-800 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{review.name}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-gold fill-current' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-light-gray line-clamp-2">{review.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        review.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {review.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent reviews found</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </AdminLayout>
  )
}
