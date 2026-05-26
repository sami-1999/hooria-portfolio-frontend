'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderKanban, Search, Filter, Trash2, Edit, Plus, Download, X, Check } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { apiRequest, API_CONFIG } from '../../../config/api'

interface Project {
  id: string
  title: string
  category: string
  duration: string
  aspect_ratio?: string
  thumbnail?: string
  description: string
  tags: string[] | string
  project_url?: string
  active: boolean
  createdAt?: string
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'PROJECT',
    duration: 'N/A',
    aspect_ratio: '16:9',
    thumbnail: '',
    description: '',
    tags: '',
    project_url: '',
    active: true
  })

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetchProjects(token)
  }, [router])

  const fetchProjects = async (token: string) => {
    try {
      setLoading(true)
      const response = await apiRequest('/api/projects/admin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(data.data || [])
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin')
      } else {
        setError('Failed to fetch projects')
      }
    } catch (e) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PROJECTS, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        })
      })

      if (response.ok) {
        const result = await response.json()
        setProjects([result.data, ...projects])
        setShowAddModal(false)
        resetForm()
      } else {
        setError('Failed to create project')
      }
    } catch (e) {
      setError('Network error. Please try again.')
    }
  }

  const updateProject = async (projectId: string) => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        })
      })

      if (response.ok) {
        const result = await response.json()
        setProjects(projects.map((project) => (project.id === projectId ? result.data : project)))
        setShowEditModal(false)
        setSelectedProject(null)
        resetForm()
      } else {
        setError('Failed to update project')
      }
    } catch (e) {
      setError('Network error. Please try again.')
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== projectId))
      } else {
        setError('Failed to delete project')
      }
    } catch (e) {
      setError('Network error. Please try again.')
    }
  }

  const toggleProjectStatus = async (project: Project) => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS}/${project.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: !project.active })
      })

      if (response.ok) {
        const result = await response.json()
        setProjects(projects.map((item) => (item.id === project.id ? result.data : item)))
      } else {
        setError('Failed to update project status')
      }
    } catch (e) {
      setError('Network error. Please try again.')
    }
  }

  const openEditModal = (project: Project) => {
    setSelectedProject(project)
    setFormData({
      title: project.title || '',
      category: project.category || 'PROJECT',
      duration: project.duration || 'N/A',
      aspect_ratio: project.aspect_ratio || '16:9',
      thumbnail: project.thumbnail || '',
      description: project.description || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
      project_url: project.project_url || '',
      active: project.active
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'PROJECT',
      duration: 'N/A',
      aspect_ratio: '16:9',
      thumbnail: '',
      description: '',
      tags: '',
      project_url: '',
      active: true
    })
  }

  const exportProjects = () => {
    const csvContent = [
      ['Title', 'Category', 'Duration', 'Aspect Ratio', 'Description', 'Tags', 'Project URL', 'Status'],
      ...projects.map((project) => [
        project.title,
        project.category,
        project.duration,
        project.aspect_ratio || '16:9',
        (project.description || '').replace(/,/g, ';'),
        (Array.isArray(project.tags) ? project.tags.join('|') : project.tags || '').replace(/,/g, ';'),
        project.project_url || '',
        project.active ? 'Active' : 'Inactive'
      ])
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projects_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredProjects = projects.filter((project) => {
    const tagsText = Array.isArray(project.tags) ? project.tags.join(' ') : project.tags || ''
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagsText.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && project.active) ||
      (statusFilter === 'inactive' && !project.active)

    return matchesSearch && matchesStatus
  })

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading projects...</div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Projects Management</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neon-cyan text-dark-bg rounded hover:bg-neon-cyan/90 transition-colors"
            >
              <Plus size={16} />
              Add Project
            </button>
            <button
              onClick={exportProjects}
              className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded hover:bg-neon-cyan/30 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="dark-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input pl-10"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="text-light-gray flex items-center">Total: {projects.length} projects</div>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-400">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="dark-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{project.title}</h3>
                  <p className="text-xs text-neon-cyan mt-1">{project.category}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    project.active ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {project.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-sm text-light-gray mb-3 line-clamp-2">{project.description}</p>
              <div className="text-xs text-gray-400 mb-2">Duration: {project.duration}</div>
              <div className="text-xs text-gray-400 mb-4">Aspect Ratio: {project.aspect_ratio || '16:9'}</div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(Array.isArray(project.tags) ? project.tags : (project.tags || '').split(',')).filter(Boolean).map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-neon-cyan/10 text-neon-cyan rounded border border-neon-cyan/20">
                    {String(tag).trim()}
                  </span>
                ))}
              </div>

              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => toggleProjectStatus(project)}
                  className={`p-2 rounded ${project.active ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}
                  title={project.active ? 'Set inactive' : 'Set active'}
                >
                  {project.active ? <X size={16} /> : <Check size={16} />}
                </button>
                <button onClick={() => openEditModal(project)} className="text-blue-400 hover:text-blue-300">
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteProject(project.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No projects found</div>
            <button onClick={() => setShowAddModal(true)} className="glow-button">
              Add First Project
            </button>
          </div>
        )}

        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="dark-card max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">{showAddModal ? 'Add Project' : 'Edit Project'}</h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedProject(null)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <input type="text" placeholder="Project title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" />
                  <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="form-input" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="form-input" />
                    <input type="text" placeholder="Aspect ratio (16:9)" value={formData.aspect_ratio} onChange={(e) => setFormData({ ...formData, aspect_ratio: e.target.value })} className="form-input" />
                  </div>
                  <input type="url" placeholder="Thumbnail URL" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} className="form-input" />
                  <input type="url" placeholder="Project URL (optional)" value={formData.project_url} onChange={(e) => setFormData({ ...formData, project_url: e.target.value })} className="form-input" />
                  <input type="text" placeholder="Tags (comma separated)" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="form-input" />
                  <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-input min-h-[100px]" />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="rounded" />
                    <label htmlFor="active" className="text-sm text-gray-400">Active (show on website)</label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      if (showAddModal) createProject()
                      else if (selectedProject) updateProject(selectedProject.id)
                    }}
                    className="flex-1 glow-button"
                  >
                    {showAddModal ? 'Add Project' : 'Update Project'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedProject(null)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-400 rounded hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
