'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderKanban, Search, Filter, Trash2, Edit, Plus, Download, X, Check } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { apiRequest, API_CONFIG } from '../../../config/api'
import { compressVideoInBrowser } from '@/lib/videoCompression'

type ProjectVideoType = 'short_video' | 'long_video' | 'ai_video'
type VideoSourceType = 'youtube' | 'upload'

interface Project {
  id: string
  title: string
  category: string
  project_type?: ProjectVideoType
  video_source?: VideoSourceType
  youtube_url?: string
  uploaded_video_url?: string
  duration: string
  aspect_ratio?: string
  description: string
  tags: string[] | string
  active: boolean
  createdAt?: string
  drive_link?: string
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
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null)
  const [compressingVideo, setCompressingVideo] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [driveLinkSource, setDriveLinkSource] = useState<'link' | 'upload'>('link')
  const [uploadedStorageFile, setUploadedStorageFile] = useState<File | null>(null)
  const [uploadingStorageFile, setUploadingStorageFile] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'PROJECT',
    project_type: 'short_video' as ProjectVideoType,
    video_source: 'youtube' as VideoSourceType,
    youtube_url: '',
    uploaded_video_url: '',
    duration: 'N/A',
    aspect_ratio: '16:9',
    description: '',
    tags: '',
    active: true,
    drive_link: ''
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
      if (!validateVideoSource()) return

      let uploadedVideoUrl = formData.uploaded_video_url
      if (formData.video_source === 'upload' && uploadedVideoFile) {
        setUploadingVideo(true)
        try {
          uploadedVideoUrl = await uploadFileAndGetPublicUrl(token, uploadedVideoFile)
        } finally {
          setUploadingVideo(false)
        }
      }

      const payload = {
        ...formData,
        type: formData.project_type,
        video_url: formData.youtube_url,
        uploaded_video_url: uploadedVideoUrl,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      }

      const response = await apiRequest(API_CONFIG.ENDPOINTS.PROJECTS, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
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
      if (!validateVideoSource()) return

      let uploadedVideoUrl = formData.uploaded_video_url
      if (formData.video_source === 'upload' && uploadedVideoFile) {
        setUploadingVideo(true)
        try {
          uploadedVideoUrl = await uploadFileAndGetPublicUrl(token, uploadedVideoFile)
        } finally {
          setUploadingVideo(false)
        }
      }

      const payload = {
        ...formData,
        type: formData.project_type,
        video_url: formData.youtube_url,
        uploaded_video_url: uploadedVideoUrl,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      }

      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
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
    const normalizedVideoSource: VideoSourceType =
      project.video_source || (project.uploaded_video_url ? 'upload' : 'youtube')

    setSelectedProject(project)
    setFormData({
      title: project.title || '',
      category: project.category || 'PROJECT',
      project_type: project.project_type || 'short_video',
      video_source: normalizedVideoSource,
      youtube_url: project.youtube_url || '',
      uploaded_video_url: project.uploaded_video_url || '',
      duration: project.duration || 'N/A',
      aspect_ratio: project.aspect_ratio || '16:9',
      description: project.description || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
      active: project.active,
      drive_link: project.drive_link || ''
    })
    setUploadedVideoFile(null)
    setCompressingVideo(false)
    setCompressionProgress(0)
    setUploadingVideo(false)
    setDriveLinkSource('link')
    setUploadedStorageFile(null)
    setUploadingStorageFile(false)
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'PROJECT',
      project_type: 'short_video',
      video_source: 'youtube',
      youtube_url: '',
      uploaded_video_url: '',
      duration: 'N/A',
      aspect_ratio: '16:9',
      description: '',
      tags: '',
      active: true,
      drive_link: ''
    })
    setDriveLinkSource('link')
    setUploadedStorageFile(null)
    setUploadingStorageFile(false)
    setUploadedVideoFile(null)
    setCompressingVideo(false)
    setCompressionProgress(0)
    setUploadingVideo(false)
  }

  const handleVideoFileSelect = async (file: File | null) => {
    setFormData((prev) => ({ ...prev, youtube_url: '' }))

    if (!file) {
      setUploadedVideoFile(null)
      return
    }

    setUploadedVideoFile(file)
    setError('')
    setCompressingVideo(true)
    setCompressionProgress(0)

    try {
      const compressed = await compressVideoInBrowser(file, {
        onProgress: setCompressionProgress
      })
      setUploadedVideoFile(compressed)
    } catch (e) {
      // compressVideoInBrowser already falls back to the original file on error
    } finally {
      setCompressingVideo(false)
    }
  }

  // Uploads the picked file straight to Supabase Storage (no compression —
  // this is for arbitrary attachments, not just video) and stores the
  // resulting public URL as the project's drive_link.
  const handleStorageFileSelect = async (file: File | null) => {
    if (!file) {
      setUploadedStorageFile(null)
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) return

    setUploadedStorageFile(file)
    setError('')
    setUploadingStorageFile(true)

    try {
      const publicUrl = await uploadFileAndGetPublicUrl(token, file)
      setFormData((prev) => ({ ...prev, drive_link: publicUrl }))
    } catch (e) {
      setError('Failed to upload file')
      setUploadedStorageFile(null)
    } finally {
      setUploadingStorageFile(false)
    }
  }

  // Uploads a file straight to Supabase Storage using a signed URL from the
  // backend, so it never passes through the Vercel function body (which has
  // a small request size limit). Used for both video files and storage-link
  // file uploads.
  const uploadFileAndGetPublicUrl = async (token: string, file: File) => {
    const urlResponse = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS}/upload-url`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename: file.name })
    })

    if (!urlResponse.ok) {
      throw new Error('Failed to get upload URL')
    }

    const { data } = await urlResponse.json()

    const putResponse = await fetch(data.signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'video/mp4' },
      body: file
    })

    if (!putResponse.ok) {
      throw new Error('Failed to upload video')
    }

    return data.publicUrl as string
  }

  const validateVideoSource = () => {
    const hasYouTube = Boolean(formData.youtube_url.trim())
    const hasUploadFile = Boolean(uploadedVideoFile)
    const hasExistingUploadUrl = Boolean(formData.uploaded_video_url.trim())
    const hasUpload = hasUploadFile || hasExistingUploadUrl

    if (formData.video_source === 'youtube' && !hasYouTube) {
      setError('Please add a YouTube URL when video source is YouTube.')
      return false
    }

    if (formData.video_source === 'upload' && !hasUpload) {
      setError('Please upload a video file when video source is Upload.')
      return false
    }

    if (hasYouTube && hasUpload) {
      setError('Use only one video source at a time: YouTube URL OR uploaded video file.')
      return false
    }

    setError('')
    return true
  }

  const exportProjects = () => {
    const csvContent = [
      ['Title', 'Category', 'Duration', 'Aspect Ratio', 'Description', 'Tags', 'Status'],
      ...projects.map((project) => [
        project.title,
        project.category,
        project.duration,
        project.aspect_ratio || '16:9',
        (project.description || '').replace(/,/g, ';'),
        (Array.isArray(project.tags) ? project.tags.join('|') : project.tags || '').replace(/,/g, ';'),
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
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{project.project_type || 'short_video'}</p>
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
              <div className="text-xs text-gray-400 mb-2">Aspect Ratio: {project.aspect_ratio || '16:9'}</div>
              {project.drive_link && (
                <a
                  href={project.drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neon-cyan hover:underline mb-2 inline-block"
                >
                  View storage link
                </a>
              )}

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
                    <select
                      value={formData.project_type}
                      onChange={(e) => setFormData({ ...formData, project_type: e.target.value as ProjectVideoType })}
                      className="form-input"
                    >
                      <option value="short_video">Short Video</option>
                      <option value="long_video">Long Video</option>
                      <option value="ai_video">AI Video</option>
                    </select>
                    <select
                      value={formData.video_source}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          video_source: e.target.value as VideoSourceType,
                          youtube_url: e.target.value === 'youtube' ? prev.youtube_url : '',
                          uploaded_video_url: e.target.value === 'upload' ? prev.uploaded_video_url : ''
                        }))
                      }
                      className="form-input"
                    >
                      <option value="youtube">YouTube Link</option>
                      <option value="upload">Uploaded Video File</option>
                    </select>
                  </div>
                  {formData.video_source === 'youtube' ? (
                    <input
                      type="url"
                      placeholder="YouTube URL"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value, uploaded_video_url: '' })}
                      className="form-input"
                    />
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="video/*"
                        disabled={compressingVideo || uploadingVideo}
                        onChange={(e) => handleVideoFileSelect(e.target.files?.[0] || null)}
                        className="form-input"
                      />
                      {formData.uploaded_video_url && !uploadedVideoFile && (
                        <p className="text-xs text-gray-400">
                          Existing uploaded video is already saved. Select a new file only if you want to replace it.
                        </p>
                      )}
                      {compressingVideo && (
                        <p className="text-xs text-yellow-400">
                          Compressing video… {Math.round(compressionProgress * 100)}%
                        </p>
                      )}
                      {!compressingVideo && uploadedVideoFile && (
                        <p className="text-xs text-neon-cyan">
                          Selected file: {uploadedVideoFile.name} ({(uploadedVideoFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </p>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="form-input" />
                    <input type="text" placeholder="Aspect ratio (16:9)" value={formData.aspect_ratio} onChange={(e) => setFormData({ ...formData, aspect_ratio: e.target.value })} className="form-input" />
                  </div>
                  <input type="text" placeholder="Tags (comma separated)" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="form-input" />

                  <div className="space-y-2">
                    <label className="block text-xs text-gray-400">Storage link (optional) — paste a link or upload a file</label>
                    <select
                      value={driveLinkSource}
                      onChange={(e) => {
                        setDriveLinkSource(e.target.value as 'link' | 'upload')
                        setUploadedStorageFile(null)
                      }}
                      className="form-input"
                    >
                      <option value="link">Paste Link (Drive, Dropbox, etc.)</option>
                      <option value="upload">Upload File</option>
                    </select>

                    {driveLinkSource === 'link' ? (
                      <input
                        type="url"
                        placeholder="e.g. https://drive.google.com/..."
                        value={formData.drive_link}
                        onChange={(e) => setFormData({ ...formData, drive_link: e.target.value })}
                        className="form-input"
                      />
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="file"
                          disabled={uploadingStorageFile}
                          onChange={(e) => handleStorageFileSelect(e.target.files?.[0] || null)}
                          className="form-input"
                        />
                        {formData.drive_link && !uploadedStorageFile && (
                          <p className="text-xs text-gray-400">
                            Existing storage file/link is already saved. Select a new file only if you want to replace it.
                          </p>
                        )}
                        {uploadingStorageFile && (
                          <p className="text-xs text-yellow-400">Uploading file…</p>
                        )}
                        {!uploadingStorageFile && uploadedStorageFile && (
                          <p className="text-xs text-neon-cyan">
                            Uploaded: {uploadedStorageFile.name} ({(uploadedStorageFile.size / (1024 * 1024)).toFixed(1)} MB)
                          </p>
                        )}
                      </div>
                    )}
                  </div>

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
                    disabled={compressingVideo || uploadingVideo || uploadingStorageFile}
                    className="flex-1 glow-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {compressingVideo
                      ? 'Compressing video…'
                      : uploadingVideo
                      ? 'Uploading video…'
                      : uploadingStorageFile
                      ? 'Uploading file…'
                      : showAddModal
                      ? 'Add Project'
                      : 'Update Project'}
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
