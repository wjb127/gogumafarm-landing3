"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Image, 
  FileText, 
  Newspaper, 
  Trophy, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3
} from "lucide-react"
import Link from "next/link"

const menuItems = [
  { href: "/admin", label: "대시보드", icon: Home },
  { href: "/admin/analytics", label: "방문자 통계", icon: BarChart3 },
  { href: "/admin/hero", label: "메인 캐러셀", icon: Image },
  { href: "/admin/articles", label: "아티클 관리", icon: FileText },
  { href: "/admin/news", label: "뉴스클리핑", icon: Newspaper },
  { href: "/admin/top10", label: "TOP 10 관리", icon: Trophy },
  { href: "/admin/settings", label: "사이트 설정", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    // 페이지 새로고침하면 로그아웃됨
    window.location.reload()
  }

  // /admin 페이지에서 인증되지 않은 경우 레이아웃 렌더링하지 않음
  // (페이지 자체에서 처리)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="bg-purple-600 text-white px-3 py-1 rounded-lg font-bold">
                고구마팜
              </div>
              <span className="text-gray-600 font-medium">Admin Panel</span>
            </Link>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">로그아웃</span>
          </Button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Mobile overlay */}
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                />
              )}
              
              <motion.aside
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                exit={{ x: -250 }}
                transition={{ type: "spring", damping: 25 }}
                className={`
                  fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] 
                  w-64 bg-white border-r border-gray-200 
                  overflow-y-auto z-30
                `}
              >
                <nav className="p-4 space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg
                          transition-all duration-200
                          ${isActive 
                            ? "bg-purple-50 text-purple-600 font-medium" 
                            : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                      </Link>
                    )
                  })}
                </nav>
                
                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>고구마팜 Admin v1.0</p>
                    <p>© 2025 Gogumafarm</p>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`
          flex-1 min-h-[calc(100vh-4rem)]
          transition-all duration-300
          ${isSidebarOpen && !isMobile ? "md:ml-0" : ""}
        `}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}