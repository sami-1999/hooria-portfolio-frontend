'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  Mail, 
  Star, 
  TrendingUp, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Database
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin')
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: BarChart3,
      current: pathname === '/admin/dashboard'
    },
    {
      name: 'Contacts',
      href: '/admin/contacts',
      icon: Mail,
      current: pathname === '/admin/contacts'
    },
    {
      name: 'Reviews',
      href: '/admin/reviews',
      icon: Star,
      current: pathname === '/admin/reviews'
    },
    {
      name: 'Visitors',
      href: '/admin/visitors',
      icon: Users,
      current: pathname === '/admin/visitors'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                  ${item.current 
                    ? 'bg-neon-cyan/20 text-neon-cyan' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-800 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-dark-card border-b border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-white">
                {navigationItems.find(item => item.current)?.name || 'Admin'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <Database size={16} />
                <span>Backend Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
