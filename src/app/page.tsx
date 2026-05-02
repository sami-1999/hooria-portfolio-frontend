'use client'

import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Reviews from '@/components/Reviews'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Track visitor on page load with enhanced data
    const trackVisitor = async () => {
      try {
        const pageData = {
          page: window.location.pathname,
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }

        await fetch('http://localhost:5000/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageData)
        })
      } catch (error) {
        console.error('Error tracking visitor:', error)
      }
    }

    trackVisitor()

    // Track page sections when they come into view
    const trackSectionView = (sectionName: string) => {
      try {
        fetch('http://localhost:5000/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: window.location.pathname,
            section: sectionName,
            action: 'view',
            timestamp: new Date().toISOString()
          })
        })
      } catch (error) {
        console.error('Error tracking section view:', error)
      }
    }

    // Set up intersection observer for section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            if (sectionId) {
              trackSectionView(sectionId)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    // Observe all sections with IDs
    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-dark-bg">
      <Navigation />
      <section id="hero">
        <Hero />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="portfolio">
        <Portfolio />
      </section>
      <section id="reviews">
        <Reviews />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </main>
  )
}
