"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface Article {
  id: string
  title: string
  description: string
  image: string
  badges: any[]
  category: string
  created_at: string
  is_featured: boolean
}

export default function TagPage() {
  const params = useParams()
  const tag = decodeURIComponent(params.tag as string)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [relatedTags, setRelatedTags] = useState<string[]>([])

  useEffect(() => {
    fetchArticlesByTag()
  }, [tag])

  const fetchArticlesByTag = async () => {
    setLoading(true)
    try {
      // 모든 아티클 가져오기
      const { data, error } = await supabase
        .from("kmong_12_articles")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (data && !error) {
        // badges에서 태그 필터링
        const filteredArticles = data.filter(article => {
          if (article.badges && Array.isArray(article.badges)) {
            return article.badges.some((badge: any) => 
              badge.text && badge.text.toLowerCase() === tag.toLowerCase()
            )
          }
          // category로도 필터링
          return article.category && article.category.toLowerCase() === tag.toLowerCase()
        })

        // image -> image_url 변환
        filteredArticles.forEach(article => {
          if (article.image && !article.image_url) {
            article.image_url = article.image
          }
        })

        setArticles(filteredArticles)

        // 관련 태그 수집
        const allTags = new Set<string>()
        filteredArticles.forEach(article => {
          if (article.badges && Array.isArray(article.badges)) {
            article.badges.forEach((badge: any) => {
              if (badge.text && badge.text !== tag) {
                allTags.add(badge.text)
              }
            })
          }
          if (article.category && article.category !== tag) {
            allTags.add(article.category)
          }
        })
        setRelatedTags(Array.from(allTags).slice(0, 10))
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
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
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                메인으로
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  관리자
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tag className="w-8 h-8" />
              <h1 className="text-4xl font-bold">#{tag}</h1>
            </div>
            <p className="text-xl opacity-90">
              {articles.length}개의 아티클
            </p>
          </motion.div>
        </div>
      </section>

      {/* Related Tags */}
      {relatedTags.length > 0 && (
        <section className="bg-white border-b py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-600">관련 태그:</span>
              {relatedTags.map((relatedTag) => (
                <Link key={relatedTag} href={`/tag/${encodeURIComponent(relatedTag)}`}>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-purple-50 transition-colors"
                  >
                    #{relatedTag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {articles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                아직 아티클이 없습니다
              </h2>
              <p className="text-gray-500">
                #{tag} 태그를 가진 아티클이 없습니다.
              </p>
              <Link href="/">
                <Button className="mt-6">
                  메인 페이지로 돌아가기
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {articles.map((article) => (
                <motion.div key={article.id} variants={fadeInUp}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img 
                        src={getImageUrl(article.image_url || article.image)} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                            <Link 
                              key={idx} 
                              href={`/tag/${encodeURIComponent(badge.text)}`}
                            >
                              <Badge 
                                variant="secondary" 
                                className="text-xs cursor-pointer hover:bg-purple-100"
                              >
                                {badge.text}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
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
                          <Link href={`/tag/${encodeURIComponent(article.category)}`}>
                            <Badge variant="outline" className="text-xs cursor-pointer">
                              {article.category}
                            </Badge>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm opacity-75">
            © 2025 고구마팜. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}