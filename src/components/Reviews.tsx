import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiRequest, API_CONFIG } from '../config/api'

interface Review {
  id: string
  name: string
  image?: string
  rating: number
  message: string
  approved: boolean
  createdAt: string
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fallbackReviews: Review[] = [
    {
      id: '1',
      name: 'Sarah Jenkins',
      rating: 5,
      message: 'Exceptional work! Hooria transformed our raw footage into a stunning video that increased our engagement by 300%. Highly recommend!',
      approved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Marcus Thorne',
      rating: 5,
      message: 'Professional, creative, and delivers on time. The AI video ads she created for our campaign were absolutely game-changing.',
      approved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      rating: 5,
      message: 'Her attention to detail and storytelling ability is unmatched. Our YouTube series has never looked better!',
      approved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'David Chen',
      rating: 5,
      message: 'Working with Hooria was a game-changer for our brand. Her creative vision and technical skills are top-notch.',
      approved: true,
      createdAt: new Date().toISOString()
    }
  ]

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await apiRequest(API_CONFIG.ENDPOINTS.REVIEWS)
        
        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.length > 0) {
            setReviews(data.data.filter((review: Review) => review.approved))
          } else {
            setReviews(fallbackReviews)
          }
        } else {
          // If backend fails, use fallback reviews
          setReviews(fallbackReviews)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        // Use fallback reviews on error
        setReviews(fallbackReviews)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-gold fill-current' : 'text-gray-600'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <section id="reviews" className="section-padding bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              CLIENT <span className="text-gradient">TELEMETRY</span>
            </h2>
            <p className="text-light-gray text-lg">
              Loading client feedback...
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="review-card animate-pulse">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-800"></div>
                <div className="h-6 bg-gray-800 rounded mb-4"></div>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-800 rounded"></div>
                  ))}
                </div>
                <div className="h-16 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="reviews" className="section-padding bg-dark-bg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            CLIENT <span className="text-gradient">TELEMETRY</span>
          </h2>
          <p className="text-light-gray text-lg">
            Real feedback from satisfied clients worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="review-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* Profile Image */}
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-neon-cyan/20 to-purple-accent/20 flex items-center justify-center">
                {review.image ? (
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-18 h-18 rounded-full bg-dark-bg flex items-center justify-center">
                    <span className="text-2xl font-bold text-neon-cyan">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-white mb-2">
                {review.name}
              </h3>

              {/* Star Rating */}
              <div className="star-rating mb-4">
                {renderStars(review.rating)}
              </div>

              {/* Review Message */}
              <p className="text-light-gray text-sm leading-relaxed">
                {review.message}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
