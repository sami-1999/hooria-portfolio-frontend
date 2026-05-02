import { motion } from 'framer-motion'
import { Mail, Phone, MessageCircle, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-gray-800 section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Copyright */}
          <motion.div
            className="text-light-gray text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            © 2024 Hooria Zaman Khan. All rights reserved.
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.a
              href="mailto:hooria@example.com"
              className="text-light-gray hover:text-neon-cyan transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail size={20} />
            </motion.a>
            
            <motion.a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-gray hover:text-neon-cyan transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Phone size={20} />
            </motion.a>
            
            <motion.a
              href="https://instagram.com/hooria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-gray hover:text-neon-cyan transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle size={20} />
            </motion.a>
            
            <motion.a
              href="https://facebook.com/hooria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-gray hover:text-neon-cyan transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Facebook size={20} />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
