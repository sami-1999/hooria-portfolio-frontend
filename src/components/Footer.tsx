import { motion } from 'framer-motion'
import { Mail, MessageCircle, Instagram, Facebook } from 'lucide-react'
import { useSiteSettings, getWhatsAppLink } from '../hooks/useSiteSettings'

export default function Footer() {
  const { settings } = useSiteSettings()
  const whatsappLink = getWhatsAppLink(settings.whatsapp_number)

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
            © {new Date().getFullYear()} Hooria Zaman Khan. All rights reserved.
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
              href={`mailto:${settings.contact_email}`}
              className="text-light-gray hover:text-neon-cyan transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail size={20} />
            </motion.a>

            {whatsappLink && (
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-gray hover:text-neon-cyan transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle size={20} />
              </motion.a>
            )}

            {settings.instagram_url && (
              <motion.a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-gray hover:text-neon-cyan transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram size={20} />
              </motion.a>
            )}

            {settings.facebook_url && (
              <motion.a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-gray hover:text-neon-cyan transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook size={20} />
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
