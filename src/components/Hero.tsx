import { motion } from 'framer-motion'
import { ArrowDown, Mail, Briefcase } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-purple-accent/10 pointer-events-none" />
      
      <motion.div 
        className="text-center z-10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Hooria Zaman Khan
        </motion.h1>
        
        <motion.h2 
          className="text-3xl md:text-4xl text-neon-cyan mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Video Editor
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-light-gray mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          "Scroll-stopping Reels & Ads that actually convert."
        </motion.p>
        
        <motion.p 
          className="text-lg text-light-gray mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          AI UGC Ads • Graphic Design • Bodycam Footage Editing
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            className="glow-button flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('mailto:hooria@example.com', '_blank')}
          >
            <Mail size={20} />
            Hire Me
          </motion.button>
          
          <motion.button
            className="border-2 border-neon-cyan text-neon-cyan px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-neon-cyan hover:text-dark-bg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Briefcase size={20} />
            View Work
          </motion.button>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-neon-cyan"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown size={24} />
      </motion.div>
    </section>
  )
}
