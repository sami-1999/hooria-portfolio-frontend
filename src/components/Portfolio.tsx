import { motion } from 'framer-motion'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { apiRequest, API_CONFIG } from '../config/api'

type ProjectType = 'short_video' | 'long_video' | 'ai_video'
type LegacyProjectType = 'SHORT_VIDEO' | 'LONG_VIDEO' | 'AI_VIDEO'
type VideoSourceType = 'youtube' | 'upload'

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  short_video: 'SHORT VIDEO',
  long_video: 'LONG VIDEO',
  ai_video: 'AI VIDEO'
}

const LEGACY_PROJECT_TYPE_MAP: Record<LegacyProjectType, ProjectType> = {
  SHORT_VIDEO: 'short_video',
  LONG_VIDEO: 'long_video',
  AI_VIDEO: 'ai_video'
}

const normalizeProjectType = (type?: string): ProjectType | undefined => {
  if (!type) return undefined

  if (type in PROJECT_TYPE_LABELS) {
    return type as ProjectType
  }

  if (type in LEGACY_PROJECT_TYPE_MAP) {
    return LEGACY_PROJECT_TYPE_MAP[type as LegacyProjectType]
  }

  return undefined
}

const getProjectTypeLabel = (type?: string, fallback = 'PROJECT') => {
  const normalizedType = normalizeProjectType(type)
  return normalizedType ? PROJECT_TYPE_LABELS[normalizedType] : fallback
}

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return ''

  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : ''
}

interface PortfolioItem {
  id: string | number
  title: string
  category: string
  type?: ProjectType | LegacyProjectType | string
  videoSource?: VideoSourceType
  duration: string
  aspectRatio: string
  description: string
  tags: string[]
  videoUrl?: string
  youtubeUrl?: string
  uploadedVideoUrl?: string
}

const fallbackPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'E-commerce Product Showcase',
    category: 'AI VIDEO ADS',
    type: 'ai_video',
    duration: '0:30',
    aspectRatio: '9:16',
    description: 'High-converting product video for social media campaigns',
    tags: ['UGC Style', 'Conversion Focused'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 2,
    title: 'Brand Story Documentary',
    category: 'LONG FORM',
    type: 'long_video',
    duration: '12:45',
    aspectRatio: '16:9',
    description: 'Comprehensive brand storytelling with cinematic editing',
    tags: ['Documentary', 'Cinematic']
  },
  {
    id: 3,
    title: 'Fitness Challenge Series',
    category: 'SHORT FORM',
    type: 'short_video',
    duration: '0:15',
    aspectRatio: '9:16',
    description: 'Engaging fitness content for social media platforms',
    tags: ['Reels', 'TikTok']
  },
  {
    id: 4,
    title: 'Tech Product Launch',
    category: 'AI VIDEO ADS',
    type: 'ai_video',
    duration: '0:45',
    aspectRatio: '1:1',
    description: 'Innovative tech product promotional video',
    tags: ['Product Launch', 'AI Enhanced']
  },
  {
    id: 5,
    title: 'Travel Vlog Episode',
    category: 'LONG FORM',
    type: 'long_video',
    duration: '18:20',
    aspectRatio: '16:9',
    description: 'Cinematic travel documentary with storytelling',
    tags: ['Travel', 'Storytelling']
  },
  {
    id: 6,
    title: 'Food Recipe Quick Cut',
    category: 'SHORT FORM',
    type: 'short_video',
    duration: '0:20',
    aspectRatio: '9:16',
    description: 'Fast-paced recipe video for social media',
    tags: ['Food', 'Quick Cuts']
  }
]

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await apiRequest(API_CONFIG.ENDPOINTS.PROJECTS)

        if (response.ok) {
          const data = await response.json()
          const projects = Array.isArray(data?.data) ? data.data : []

          if (projects.length > 0) {
            const mappedProjects: PortfolioItem[] = projects.map((project: any, index: number) => ({
              id: project.id ?? index + 1,
              title: project.title ?? 'Untitled Project',
              category: project.category ?? 'PROJECT',
              type: project.type ?? project.project_type ?? undefined,
              videoSource: project.videoSource ?? project.video_source ?? undefined,
              duration: project.duration ?? 'N/A',
              aspectRatio: project.aspectRatio ?? project.aspect_ratio ?? '16:9',
              description: project.description ?? '',
              tags: Array.isArray(project.tags)
                ? project.tags
                : typeof project.tags === 'string'
                ? project.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                : [],
              videoUrl: project.videoUrl ?? project.video_url ?? '',
              youtubeUrl: project.youtubeUrl ?? project.youtube_url ?? '',
              uploadedVideoUrl: project.uploadedVideoUrl ?? project.uploaded_video_url ?? ''
            }))

            setPortfolioItems(mappedProjects)
          } else {
            setPortfolioItems(fallbackPortfolioItems)
          }
        } else {
          setPortfolioItems(fallbackPortfolioItems)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setPortfolioItems(fallbackPortfolioItems)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section id="portfolio" className="section-padding bg-dark-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex justify-between items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                THE <span className="text-gradient">TIMELINE</span>
              </h2>
              <p className="text-light-gray text-lg">Loading projects...</p>
            </div>
          </motion.div>

          <div className="portfolio-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl overflow-hidden bg-dark-bg">
                <div className="aspect-video bg-gray-800" />
                <div className="p-6">
                  <div className="h-6 bg-gray-800 rounded mb-3" />
                  <div className="h-4 bg-gray-800 rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-800 rounded" />
                    <div className="h-6 w-20 bg-gray-800 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="section-padding bg-dark-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex justify-between items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              THE <span className="text-gradient">TIMELINE</span>
            </h2>
            <p className="text-light-gray text-lg">
              Recent projects showcasing expertise across video formats
            </p>
          </div>
          
          <motion.button
            className="flex items-center gap-2 text-neon-cyan hover:text-white transition-colors duration-300"
            whileHover={{ x: 5 }}
            onClick={() => window.open('#contact', '_self')}
          >
            VIEW ALL
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>

        <div className="portfolio-grid">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative overflow-hidden rounded-xl cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Video */}
              <div className="relative aspect-video bg-dark-bg overflow-hidden">
                {item.videoSource === 'youtube' && getYouTubeEmbedUrl(item.youtubeUrl || item.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(item.youtubeUrl || item.videoUrl)}
                    title={item.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (item.videoSource === 'upload' && (item.uploadedVideoUrl || item.videoUrl)) ? (
                  <video
                    src={item.uploadedVideoUrl || item.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : getYouTubeEmbedUrl(item.youtubeUrl || item.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(item.youtubeUrl || item.videoUrl)}
                    title={item.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (item.uploadedVideoUrl || item.videoUrl) ? (
                  <video
                    src={item.uploadedVideoUrl || item.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neon-cyan/20 to-purple-accent/20">
                    <PlayCircle className="w-14 h-14 text-neon-cyan/80" />
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-dark-bg/80 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-semibold text-neon-cyan">
                    {getProjectTypeLabel(item.type, item.category)}
                  </span>
                </div>
                
                {/* Duration and Aspect Ratio */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <span className="text-xs text-white bg-dark-bg/80 backdrop-blur-sm px-2 py-1 rounded">
                    {item.duration}
                  </span>
                  <span className="text-xs text-white bg-dark-bg/80 backdrop-blur-sm px-2 py-1 rounded">
                    {item.aspectRatio}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 bg-dark-card">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-light-gray text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 bg-neon-cyan/10 text-neon-cyan rounded border border-neon-cyan/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
