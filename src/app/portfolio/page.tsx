'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Scissors, Film, Zap, LayoutGrid, Mail } from 'lucide-react'
import Footer from '@/components/Footer'
import PortfolioCard from '@/components/PortfolioCard'
import { usePortfolioItems, normalizeProjectType, ProjectType } from '@/hooks/usePortfolioItems'

type CategoryFilter = ProjectType | 'all'

const CATEGORY_FILTERS: { value: CategoryFilter; label: string; icon: typeof LayoutGrid }[] = [
  { value: 'all', label: 'All Projects', icon: LayoutGrid },
  { value: 'short_video', label: 'Short Form Videos', icon: Scissors },
  { value: 'long_video', label: 'Long Form Editing', icon: Film },
  { value: 'ai_video', label: 'AI Video Ads', icon: Zap }
]

function PortfolioPageContent() {
  const searchParams = useSearchParams()
  const initialCategory = normalizeProjectType(searchParams.get('category') || undefined) || 'all'

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(initialCategory)
  const { portfolioItems, loading } = usePortfolioItems()

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return portfolioItems
    return portfolioItems.filter((item) => normalizeProjectType(item.type) === activeCategory)
  }, [portfolioItems, activeCategory])

  return (
    <main className="min-h-screen bg-dark-bg">
      <nav className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-light-gray hover:text-neon-cyan transition-colors duration-300"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <Link href="/#contact" className="glow-button px-6 py-2 text-sm flex items-center gap-2">
            <Mail size={16} />
            Hire Me
          </Link>
        </div>
      </nav>

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              FULL <span className="text-gradient">PORTFOLIO</span>
            </h1>
            <p className="text-light-gray text-lg">
              Every project, filterable by format
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filter */}
            <motion.aside
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="lg:sticky lg:top-8 flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0">
                {CATEGORY_FILTERS.map((filter) => {
                  const Icon = filter.icon
                  const isActive = activeCategory === filter.value
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setActiveCategory(filter.value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors duration-300 whitespace-nowrap text-left ${
                        isActive
                          ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan'
                          : 'border-gray-800 text-light-gray hover:border-neon-cyan/40 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{filter.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.aside>

            {/* Filtered Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="portfolio-grid">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse rounded-xl overflow-hidden bg-dark-card">
                      <div className="aspect-video bg-gray-800" />
                      <div className="p-6">
                        <div className="h-6 bg-gray-800 rounded mb-3" />
                        <div className="h-4 bg-gray-800 rounded mb-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="portfolio-grid">
                  {filteredItems.map((item, index) => (
                    <PortfolioCard key={item.id} item={item} delay={Math.min(index, 5) * 0.1} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-light-gray">
                  No projects found in this category yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={null}>
      <PortfolioPageContent />
    </Suspense>
  )
}
