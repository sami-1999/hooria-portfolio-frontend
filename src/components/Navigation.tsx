import { motion } from 'framer-motion'
import { Menu, X, Mail, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const navItems = [
    { name: 'Home', section: 'hero' },
    { name: 'Services', section: 'services' },
    { name: 'Portfolio', section: 'portfolio' },
    { name: 'Reviews', section: 'reviews' },
    { name: 'Contact', section: 'contact' }
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-dark-bg/90 backdrop-blur-md border-b border-gray-800' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              className="text-xl font-bold text-white"
              whileHover={{ scale: 1.05 }}
            >
              HZK
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.section)}
                  className="text-light-gray hover:text-neon-cyan transition-colors duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            {/* Contact Button */}
            <motion.div
              className="hidden md:flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.a
                href="mailto:hooria@example.com"
                className="p-2 text-light-gray hover:text-neon-cyan transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail size={20} />
              </motion.a>
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="glow-button px-6 py-2 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-light-gray hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-full bg-dark-card border-l border-gray-800"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-light-gray hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <nav className="flex-1">
                <ul className="space-y-6">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => scrollToSection(item.section)}
                        className="block w-full text-left text-lg text-light-gray hover:text-neon-cyan transition-colors duration-300 font-medium"
                      >
                        {item.name}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Contact Info */}
              <div className="border-t border-gray-800 pt-6 space-y-4">
                <motion.a
                  href="mailto:hooria@example.com"
                  className="flex items-center gap-3 text-light-gray hover:text-neon-cyan transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail size={20} />
                  <span>Email</span>
                </motion.a>
                <motion.button
                  onClick={() => scrollToSection('contact')}
                  className="glow-button w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get In Touch
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
