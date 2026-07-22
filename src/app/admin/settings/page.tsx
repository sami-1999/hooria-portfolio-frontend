'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { apiRequest, API_CONFIG } from '../../../config/api'

interface SettingsForm {
  contact_email: string
  whatsapp_number: string
  instagram_url: string
  facebook_url: string
}

export default function SettingsManagement() {
  const [formData, setFormData] = useState<SettingsForm>({
    contact_email: '',
    whatsapp_number: '',
    instagram_url: '',
    facebook_url: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetchSettings()
  }, [router])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await apiRequest(API_CONFIG.ENDPOINTS.SETTINGS)
      if (response.ok) {
        const data = await response.json()
        if (data?.data) {
          setFormData({
            contact_email: data.data.contact_email || '',
            whatsapp_number: data.data.whatsapp_number || '',
            instagram_url: data.data.instagram_url || '',
            facebook_url: data.data.facebook_url || ''
          })
        }
      }
    } catch (e) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.SETTINGS, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSaved(true)
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin')
      } else {
        setError('Failed to save settings')
      }
    } catch (e) {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">Site Settings</h1>
        <p className="text-light-gray text-sm mb-6">
          Contact email, WhatsApp number, and social links shown on the public site (Contact section, Footer, Navigation).
        </p>

        {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-400">{error}</div>}
        {saved && <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded text-green-400">Settings saved successfully.</div>}

        <div className="dark-card p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">WhatsApp Number</label>
            <input
              type="tel"
              placeholder="e.g. 923001234567 (country code, no + or spaces)"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              className="form-input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used to build the wa.me link and the WhatsApp button on the Contact section. Leave blank to hide the WhatsApp button.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Instagram URL</label>
            <input
              type="url"
              placeholder="https://instagram.com/yourhandle"
              value={formData.instagram_url}
              onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Facebook URL</label>
            <input
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={formData.facebook_url}
              onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
              className="form-input"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="glow-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
