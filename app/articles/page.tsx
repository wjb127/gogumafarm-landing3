"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, Calendar, ArrowLeft, Filter, X, 
  ChevronDown, Grid3x3, List, Tag 
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface Article {
  id: string
  title: string
  description: string
  image: string
  image_url?: string
  badges: any[]
  category: string
  created_at: string
  is_featured: boolean
  is_active: boolean
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "featured">("newest")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, selectedCategory, selectedTags, sortBy])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("kmong_12_articles")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (data && !error) {
        // image -> image_url 변환
        data.forEach(article => {
          if (article.image && !article.image_url) {
            article.image_url = article.image
          }
        })
        
        setArticles(data)
        
        // 카테고리와 태그 수집
        const uniqueCategories = new Set<string>()
        const uniqueTags = new Set<string>()
        
        data.forEach(article => {
          if (article.category) {
            uniqueCategories.add(article.category)
          }
          if (article.badges && Array.isArray(article.badges)) {
            article.badges.forEach((badge: any) => {
              if (badge.text) {
                uniqueTags.add(badge.text)
              }
            })
          }
        })
        
        setCategories(Array.from(uniqueCategories))
        setAllTags(Array.from(uniqueTags))
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterArticles = () => {
    let filtered = [...articles]

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter(article => 
        article.category === selectedCategory
      )
    }

    // 태그 필터
    if (selectedTags.length > 0) {
      filtered = filtered.filter(article => {
        if (!article.badges || !Array.isArray(article.badges)) return false
        const articleTags = article.badges.map((b: any) => b.text).filter(Boolean)
        return selectedTags.some(tag => articleTags.includes(tag))
      })
    }

    // 정렬
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        break
      case "featured":
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1
          if (!a.is_featured && b.is_featured) return 1
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        break
      default: // newest
        filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }

    setFilteredArticles(filtered)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedTags([])
    setSortBy("newest")
  }

  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.jpg'
    if (url.includes('supabase.co/storage')) {
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}t=${Date.now()}`
    }
    return url
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  메인으로
                </Button>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold">전체 아티클</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:w-64 bg-white rounded-lg p-6 h-fit sticky top-20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">필터</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    초기화
                  </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="아티클 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">정렬</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="newest">최신순</option>
                    <option value="oldest">오래된순</option>
                    <option value="featured">추천순</option>
                  </select>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">카테고리</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">전체</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Tags */}
                {allTags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">태그</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 10).map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    {allTags.length > 10 && (
                      <Button variant="link" size="sm" className="mt-2 p-0">
                        더 보기 ({allTags.length - 10}개)
                      </Button>
                    )}
                  </div>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Articles Grid/List */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {filteredArticles.length}개의 아티클
                {searchTerm && ` "${searchTerm}" 검색 결과`}
              </p>
              {(searchTerm || selectedCategory || selectedTags.length > 0) && (
                <div className="flex items-center gap-2">
                  {selectedCategory && (
                    <Badge variant="secondary">
                      {selectedCategory}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => setSelectedCategory("")}
                      />
                    </Badge>
                  )}
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Articles Display */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                  아티클을 찾을 수 없습니다
                </h2>
                <p className="text-gray-500">
                  다른 검색어나 필터를 시도해보세요
                </p>
                <Button onClick={clearFilters} className="mt-4">
                  필터 초기화
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                {filteredArticles.map((article) => (
                  <motion.div key={article.id} variants={fadeInUp}>
                    <Link href={`/article/${article.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                        <div className="relative aspect-video overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(article.image_url || article.image)}
                            alt={article.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder.jpg'
                            }}
                          />
                          {article.is_featured && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-yellow-500 text-white">추천</Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          {article.badges && article.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {article.badges.map((badge: any, idx: number) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {badge.text}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          {article.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {article.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(article.created_at).toLocaleDateString('ko-KR')}
                              </span>
                            </div>
                            {article.category && (
                              <Badge variant="outline" className="text-xs">
                                {article.category}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Link key={article.id} href={`/article/${article.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-32 md:h-auto">
                          <img
                            src={getImageUrl(article.image_url || article.image)}
                            alt={article.title}
                            className="w-full h-full object-cover rounded-l-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder.jpg'
                            }}
                          />
                        </div>
                        <CardContent className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg line-clamp-1">
                              {article.title}
                            </h3>
                            {article.is_featured && (
                              <Badge className="bg-yellow-500 text-white ml-2">
                                추천
                              </Badge>
                            )}
                          </div>
                          {article.description && (
                            <p className="text-gray-600 line-clamp-2 mb-3">
                              {article.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(article.created_at).toLocaleDateString('ko-KR')}
                              </span>
                            </div>
                            {article.category && (
                              <Badge variant="outline">
                                {article.category}
                              </Badge>
                            )}
                            {article.badges && article.badges.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {article.badges.slice(0, 3).map((badge: any, idx: number) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {badge.text}
                                  </Badge>
                                ))}
                                {article.badges.length > 3 && (
                                  <span className="text-xs text-gray-400">
                                    +{article.badges.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}