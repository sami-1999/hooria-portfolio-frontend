import { useEffect, useState } from 'react'
import { apiRequest, API_CONFIG } from '../config/api'

export type ProjectType = 'short_video' | 'long_video' | 'ai_video'
type LegacyProjectType = 'SHORT_VIDEO' | 'LONG_VIDEO' | 'AI_VIDEO'
export type VideoSourceType = 'youtube' | 'upload'

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  short_video: 'SHORT VIDEO',
  long_video: 'LONG VIDEO',
  ai_video: 'AI VIDEO'
}

export const PROJECT_TYPE_FILTERS: { value: ProjectType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'short_video', label: 'Short Form Videos' },
  { value: 'long_video', label: 'Long Form Editing' },
  { value: 'ai_video', label: 'AI Video Ads' }
]

const LEGACY_PROJECT_TYPE_MAP: Record<LegacyProjectType, ProjectType> = {
  SHORT_VIDEO: 'short_video',
  LONG_VIDEO: 'long_video',
  AI_VIDEO: 'ai_video'
}

export const normalizeProjectType = (type?: string): ProjectType | undefined => {
  if (!type) return undefined

  if (type in PROJECT_TYPE_LABELS) {
    return type as ProjectType
  }

  if (type in LEGACY_PROJECT_TYPE_MAP) {
    return LEGACY_PROJECT_TYPE_MAP[type as LegacyProjectType]
  }

  return undefined
}

export const getProjectTypeLabel = (type?: string, fallback = 'PROJECT') => {
  const normalizedType = normalizeProjectType(type)
  return normalizedType ? PROJECT_TYPE_LABELS[normalizedType] : fallback
}

export const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return ''

  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : ''
}

// Newly uploaded videos are stored on Supabase Storage as absolute URLs.
// This only resolves legacy records that still hold an old relative
// `/uploads/...` path against the backend origin instead of the frontend's.
export const resolveVideoUrl = (url?: string) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url
  return `${API_CONFIG.BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export interface PortfolioItem {
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

export const fallbackPortfolioItems: PortfolioItem[] = [
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

export function usePortfolioItems() {
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

  return { portfolioItems, loading }
}
