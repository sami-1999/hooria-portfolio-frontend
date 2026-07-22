import { useEffect, useState } from 'react'
import { apiRequest, API_CONFIG } from '../config/api'

export interface SiteSettings {
  contact_email: string
  whatsapp_number: string
  instagram_url: string
  facebook_url: string
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contact_email: 'hooria@example.com',
  whatsapp_number: '',
  instagram_url: '',
  facebook_url: ''
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiRequest(API_CONFIG.ENDPOINTS.SETTINGS)
        if (response.ok) {
          const data = await response.json()
          if (data?.data) {
            setSettings({
              contact_email: data.data.contact_email || DEFAULT_SITE_SETTINGS.contact_email,
              whatsapp_number: data.data.whatsapp_number || '',
              instagram_url: data.data.instagram_url || '',
              facebook_url: data.data.facebook_url || ''
            })
          }
        }
      } catch (error) {
        console.error('Error fetching site settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading }
}

// Builds a wa.me link from a stored number in any format (+92 300..., 0300..., etc).
export const getWhatsAppLink = (rawNumber: string, message = '') => {
  const digits = rawNumber.replace(/\D/g, '')
  if (!digits) return ''
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${query}`
}
