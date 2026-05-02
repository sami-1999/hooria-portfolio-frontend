import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'

const portfolioItems = [
  {
    id: 1,
    title: 'E-commerce Product Showcase',
    category: 'AI VIDEO ADS',
    duration: '0:30',
    aspectRatio: '9:16',
    thumbnail: '/api/placeholder/400/600',
    description: 'High-converting product video for social media campaigns',
    tags: ['UGC Style', 'Conversion Focused']
  },
  {
    id: 2,
    title: 'Brand Story Documentary',
    category: 'LONG FORM',
    duration: '12:45',
    aspectRatio: '16:9',
    thumbnail: '/api/placeholder/600/400',
    description: 'Comprehensive brand storytelling with cinematic editing',
    tags: ['Documentary', 'Cinematic']
  },
  {
    id: 3,
    title: 'Fitness Challenge Series',
    category: 'SHORT FORM',
    duration: '0:15',
    aspectRatio: '9:16',
    thumbnail: '/api/placeholder/400/600',
    description: 'Engaging fitness content for social media platforms',
    tags: ['Reels', 'TikTok']
  },
  {
    id: 4,
    title: 'Tech Product Launch',
    category: 'AI VIDEO ADS',
    duration: '0:45',
    aspectRatio: '1:1',
    thumbnail: '/api/placeholder/400/400',
    description: 'Innovative tech product promotional video',
    tags: ['Product Launch', 'AI Enhanced']
  },
  {
    id: 5,
    title: 'Travel Vlog Episode',
    category: 'LONG FORM',
    duration: '18:20',
    aspectRatio: '16:9',
    thumbnail: '/api/placeholder/600/400',
    description: 'Cinematic travel documentary with storytelling',
    tags: ['Travel', 'Storytelling']
  },
  {
    id: 6,
    title: 'Food Recipe Quick Cut',
    category: 'SHORT FORM',
    duration: '0:20',
    aspectRatio: '9:16',
    thumbnail: '/api/placeholder/400/600',
    description: 'Fast-paced recipe video for social media',
    tags: ['Food', 'Quick Cuts']
  }
]

export default function Portfolio() {
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
              onClick={() => window.open('#contact', '_self')}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-dark-bg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-purple-accent/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ExternalLink className="w-12 h-12 text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-dark-bg/80 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-semibold text-neon-cyan">
                    {item.category}
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
