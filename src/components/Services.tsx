import { motion } from 'framer-motion'
import { Scissors, Film, Zap } from 'lucide-react'

const services = [
  {
    icon: Scissors,
    title: 'Short Form Videos',
    description: 'Stark, neutral gray concise description tailored for rapid engagement across vertical viewing platforms.',
    features: ['Reels', 'TikToks', 'Shorts']
  },
  {
    icon: Film,
    title: 'Long Form Editing',
    description: 'Comprehensive narrative construction designed for maximum viewer retention and authoritative storytelling.',
    features: ['YouTube', 'Podcasts', 'Storytelling']
  },
  {
    icon: Zap,
    title: 'AI Video Ads',
    description: 'Algorithmically optimized promotional content engineered precisely for high conversion and scale.',
    features: ['UGC Style', 'Conversion-Focused', 'AI Enhanced']
  }
]

export default function Services() {
  return (
    <section id="services" className="section-padding bg-dark-bg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            TECHNICAL <span className="text-gradient">CAPABILITIES</span>
          </h2>
          <p className="text-light-gray text-lg">
            Specialized video editing services designed to maximize engagement and conversion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-neon-cyan/30 transition-colors duration-300">
                <service.icon className="w-8 h-8 text-neon-cyan" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">
                {service.title}
              </h3>
              
              <p className="text-light-gray mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {service.features.map((feature, featureIndex) => (
                  <span
                    key={featureIndex}
                    className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan rounded-full text-sm border border-neon-cyan/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
