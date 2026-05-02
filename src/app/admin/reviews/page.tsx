'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Search, Filter, Trash2, Eye, Edit, Plus, Download, ChevronLeft, ChevronRight, X, Check } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Review {
  id: string
  name: string
  image?: string
  rating: number
  message: string
  approved: boolean
  createdAt: string
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    rating: 5,
    message: '',
    approved: true
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetchReviews(token)
  }, [router])

  const fetchReviews = async (token: string) => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/reviews/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data.data || [])
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin')
      } else {
        setError('Failed to fetch reviews')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const createReview = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews([...reviews, newReview.data])
        setShowAddModal(false)
        setFormData({ name: '', image: '', rating: 5, message: '', approved: true })
      } else {
        setError('Failed to create review')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const updateReview = async (reviewId: string, updateData: Partial<Review>) => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setReviews(reviews.map(review => 
          review.id === reviewId ? { ...review, ...updateData } : review
        ))
        setShowEditModal(false)
        setSelectedReview(null)
      } else {
        setError('Failed to update review')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId))
      } else {
        setError('Failed to delete review')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const toggleReviewStatus = async (reviewId: string, currentStatus: boolean) => {
    await updateReview(reviewId, { approved: !currentStatus })
  }

  const exportReviews = () => {
    const csvContent = [
      ['Name', 'Rating', 'Message', 'Status', 'Created At'],
      ...reviews.map(review => [
        review.name,
        review.rating,
        review.message.replace(/,/g, ';'),
        review.approved ? 'Approved' : 'Pending',
        new Date(review.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reviews_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && review.approved) ||
                         (statusFilter === 'pending' && !review.approved)
    return matchesSearch && matchesStatus
  })

  const openEditModal = (review: Review) => {
    setSelectedReview(review)
    setFormData({
      name: review.name,
      image: review.image || '',
      rating: review.rating,
      message: review.message,
      approved: review.approved
    })
    setShowEditModal(true)
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading reviews...</div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Reviews Management</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neon-cyan text-dark-bg rounded hover:bg-neon-cyan/90 transition-colors"
            >
              <Plus size={16} />
              Add Review
            </button>
            <button
              onClick={exportReviews}
              className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded hover:bg-neon-cyan/30 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="dark-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input pl-10"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="text-light-gray flex items-center">
              Total: {reviews.length} reviews
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-400">
            {error}
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="dark-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {review.image && (
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
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
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  review.approved 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {review.approved ? 'Approved' : 'Pending'}
                </span>
              </div>

              <p className="text-sm text-light-gray mb-4 line-clamp-3">{review.message}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReviewStatus(review.id, review.approved)}
                    className={`p-2 rounded ${
                      review.approved 
                        ? 'text-yellow-400 hover:text-yellow-300' 
                        : 'text-green-400 hover:text-green-300'
                    }`}
                    title={review.approved ? 'Set to pending' : 'Approve'}
                  >
                    {review.approved ? <X size={16} /> : <Check size={16} />}
                  </button>
                  <button
                    onClick={() => openEditModal(review)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No reviews found</div>
            <button
              onClick={() => setShowAddModal(true)}
              className="glow-button"
            >
              Add First Review
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="dark-card max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {showAddModal ? 'Add Review' : 'Edit Review'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setFormData({ name: '', image: '', rating: 5, message: '', approved: true })
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Image URL (optional)</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Rating</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="form-input"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-input min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="approved"
                      checked={formData.approved}
                      onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="approved" className="text-sm text-gray-400">
                      Approved (show on website)
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      if (showAddModal) {
                        createReview()
                      } else if (selectedReview) {
                        updateReview(selectedReview.id, formData)
                      }
                    }}
                    className="flex-1 glow-button"
                  >
                    {showAddModal ? 'Add Review' : 'Update Review'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setFormData({ name: '', image: '', rating: 5, message: '', approved: true })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-400 rounded hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
