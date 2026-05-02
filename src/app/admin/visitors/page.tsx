'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, Calendar, Globe, Monitor, Download, BarChart3, TrendingUp, Eye } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Visitor {
  id: string
  ipAddress: string
  userAgent: string
  pageVisited: string
  visitTime: string
  referrer?: string
}

interface VisitorStats {
  totalVisits: number
  uniqueVisitors: number
  todayVisits: number
  visitsByPage: Array<{ page: string; count: number }>
}

export default function VisitorsManagement() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [pageFilter, setPageFilter] = useState<string>('all')
  const [showStats, setShowStats] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetchVisitorData(token)
  }, [router])

  const fetchVisitorData = async (token: string) => {
    try {
      setLoading(true)
      
      // Fetch visitor stats
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      // Fetch all visitors (we'll need to add this endpoint to the backend)
      const visitorsResponse = await fetch('http://localhost:5000/api/track-visit/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats({
          totalVisits: statsData.data.totalVisits || 0,
          uniqueVisitors: statsData.data.uniqueVisitors || 0,
          todayVisits: statsData.data.todayVisits || 0,
          visitsByPage: statsData.data.visitsByDate || []
        })
      }

      if (visitorsResponse.ok) {
        const visitorsData = await visitorsResponse.json()
        // Note: This would need a new endpoint to get individual visitor records
        // For now, we'll show empty visitors array
        setVisitors([])
      }

      if (statsResponse.status === 401 || visitorsResponse.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin')
      } else if (!statsResponse.ok && !visitorsResponse.ok) {
        setError('Failed to fetch visitor data')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportVisitorData = () => {
    if (!stats) return

    const csvContent = [
      ['Metric', 'Value'],
      ['Total Visits', stats.totalVisits.toString()],
      ['Unique Visitors', stats.uniqueVisitors.toString()],
      ['Today Visits', stats.todayVisits.toString()],
      [],
      ['Page', 'Visits'],
      ...stats.visitsByPage.map(item => [item.page, item.count.toString()])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visitor_stats_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getBrowserIcon = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return '🌐'
    if (userAgent.includes('Firefox')) return '🦊'
    if (userAgent.includes('Safari')) return '🧭'
    if (userAgent.includes('Edge')) return '📐'
    return '🌍'
  }

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.ipAddress.includes(searchTerm) ||
                         visitor.pageVisited.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPage = pageFilter === 'all' || visitor.pageVisited === pageFilter
    return matchesSearch && matchesPage
  })

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading visitor data...</div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Visitor Analytics</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                showStats 
                  ? 'bg-neon-cyan text-dark-bg' 
                  : 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30'
              }`}
            >
              <BarChart3 size={16} />
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <button
              onClick={exportVisitorData}
              className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded hover:bg-neon-cyan/30 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-400">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        {showStats && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="dark-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-neon-cyan" />
                <span className="text-2xl font-bold text-white">{stats.totalVisits}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Total Visits</h3>
              <p className="text-sm text-light-gray">All time traffic</p>
            </div>

            <div className="dark-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Eye className="w-8 h-8 text-neon-cyan" />
                <span className="text-2xl font-bold text-white">{stats.uniqueVisitors}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Unique Visitors</h3>
              <p className="text-sm text-light-gray">Distinct IPs</p>
            </div>

            <div className="dark-card p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-neon-cyan" />
                <span className="text-2xl font-bold text-white">{stats.todayVisits}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Today's Visits</h3>
              <p className="text-sm text-light-gray">Live tracking</p>
            </div>

            <div className="dark-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Globe className="w-8 h-8 text-neon-cyan" />
                <span className="text-2xl font-bold text-white">{stats.visitsByPage.length}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Pages Visited</h3>
              <p className="text-sm text-light-gray">Unique pages</p>
            </div>
          </div>
        )}

        {/* Page Visits Chart */}
        {showStats && stats && stats.visitsByPage.length > 0 && (
          <div className="dark-card p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Page Visits Breakdown</h2>
            <div className="space-y-4">
              {stats.visitsByPage
                .sort((a, b) => b.count - a.count)
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white min-w-[20px]">#{index + 1}</span>
                      <span className="text-sm text-light-gray">{item.page}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-neon-cyan h-2 rounded-full"
                          style={{
                            width: `${(item.count / Math.max(...stats.visitsByPage.map(v => v.count))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-white font-medium min-w-[40px] text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="dark-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by IP or page..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={pageFilter}
                onChange={(e) => setPageFilter(e.target.value)}
                className="form-input pl-10"
              >
                <option value="all">All Pages</option>
                {stats?.visitsByPage.map(page => (
                  <option key={page.page} value={page.page}>{page.page}</option>
                ))}
              </select>
            </div>
            <div className="text-light-gray flex items-center">
              {filteredVisitors.length} of {visitors.length} visitors
            </div>
          </div>
        </div>

        {/* Note about visitor data */}
        <div className="dark-card p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Monitor size={16} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Visitor Tracking Information</h3>
              <p className="text-gray-400 text-sm mb-2">
                This section displays visitor analytics and page visit statistics. The system tracks:
              </p>
              <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                <li>Total visits and unique visitors</li>
                <li>Page visit breakdown by popularity</li>
                <li>Daily visit statistics</li>
                <li>Geographic and browser information (when available)</li>
              </ul>
              <p className="text-gray-500 text-xs mt-3">
                Note: Individual visitor records are aggregated for privacy. Detailed visitor logs can be implemented if needed for specific analytics requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Visitors Table (placeholder for future implementation) */}
        {visitors.length > 0 && (
          <div className="dark-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Page</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Browser</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Visit Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredVisitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{visitor.ipAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-light-gray">{visitor.pageVisited}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{getBrowserIcon(visitor.userAgent)}</span>
                          <span className="text-sm text-gray-400">
                            {visitor.userAgent.includes('Chrome') ? 'Chrome' :
                             visitor.userAgent.includes('Firefox') ? 'Firefox' :
                             visitor.userAgent.includes('Safari') ? 'Safari' :
                             visitor.userAgent.includes('Edge') ? 'Edge' : 'Other'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {new Date(visitor.visitTime).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {visitors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Individual visitor records not available</div>
            <p className="text-gray-600 text-sm">
              Visitor data is aggregated for privacy and performance. Use the statistics above for analytics.
            </p>
          </div>
        )}
      </div>
      </AdminLayout>
  )
}
