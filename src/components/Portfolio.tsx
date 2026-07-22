import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePortfolioItems } from '../hooks/usePortfolioItems'
import PortfolioCard from './PortfolioCard'

const HOMEPAGE_ITEM_LIMIT = 6

export default function Portfolio() {
  const { portfolioItems, loading } = usePortfolioItems()
  const visibleItems = portfolioItems.slice(0, HOMEPAGE_ITEM_LIMIT)

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

          <Link href="/portfolio">
            <motion.span
              className="flex items-center gap-2 text-neon-cyan hover:text-white transition-colors duration-300"
              whileHover={{ x: 5 }}
            >
              VIEW ALL
              <ArrowRight size={20} />
            </motion.span>
          </Link>
        </motion.div>

        <div className="portfolio-grid">
          {visibleItems.map((item, index) => (
            <PortfolioCard key={item.id} item={item} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
