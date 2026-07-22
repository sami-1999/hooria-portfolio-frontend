import { motion } from 'framer-motion'
import { PlayCircle } from 'lucide-react'
import {
  PortfolioItem,
  getProjectTypeLabel,
  getYouTubeEmbedUrl,
  resolveVideoUrl
} from '../hooks/usePortfolioItems'

export default function PortfolioCard({ item, delay = 0 }: { item: PortfolioItem; delay?: number }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
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
            src={resolveVideoUrl(item.uploadedVideoUrl || item.videoUrl)}
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
            src={resolveVideoUrl(item.uploadedVideoUrl || item.videoUrl)}
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
  )
}
