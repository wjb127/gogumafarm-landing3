"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Eye, Clock, Share2, Heart, Tag } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { incrementArticleView } from "@/lib/analytics"
import Link from "next/link"

interface Article {
  id: string
  title: string
  description: string
  content?: string
  image: string
  badges: any[]
  category: string
  created_at: string
  is_featured: boolean
  is_active: boolean
  view_count?: number
}

export default function ArticlePage() {
  const params = useParams()
  const articleId = params.id as string
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetchArticle()
    // 조회수 증가
    incrementArticleView(articleId)
  }, [articleId])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      // 현재 아티클 가져오기
      const { data: articleData, error: articleError } = await supabase
        .from("kmong_12_articles")
        .select(`
          *,
          kmong_12_article_stats(view_count)
        `)
        .eq("id", articleId)
        .eq("is_active", true)
        .single()

      if (articleData && !articleError) {
        // image -> image_url 변환
        if (articleData.image && !articleData.image_url) {
          articleData.image_url = articleData.image
        }
        
        // view_count 처리
        if (articleData.kmong_12_article_stats?.[0]) {
          articleData.view_count = articleData.kmong_12_article_stats[0].view_count
        }
        
        setArticle(articleData)

        // 관련 아티클 가져오기 (같은 카테고리 또는 태그)
        if (articleData.category) {
          const { data: related } = await supabase
            .from("kmong_12_articles")
            .select("*")
            .eq("is_active", true)
            .eq("category", articleData.category)
            .neq("id", articleId)
            .limit(4)

          if (related) {
            // image -> image_url 변환
            related.forEach(item => {
              if (item.image && !item.image_url) {
                item.image_url = item.image
              }
            })
            setRelatedArticles(related)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error)
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.description,
          url: window.location.href
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // 클립보드에 URL 복사
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 복사되었습니다!")
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            아티클을 찾을 수 없습니다
          </h1>
          <Link href="/">
            <Button>메인으로 돌아가기</Button>
          </Link>
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
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Image */}
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={getImageUrl(article.image_url || article.image)}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.jpg'
              }}
            />
            {article.is_featured && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-500 text-white">추천</Badge>
              </div>
            )}
          </div>

          {/* Article Header */}
          <div className="mb-8">
            {/* Badges */}
            {article.badges && article.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.badges.map((badge: any, idx: number) => (
                  <Link 
                    key={idx}
                    href={`/tag/${encodeURIComponent(badge.text)}`}
                  >
                    <Badge 
                      variant="secondary"
                      className="cursor-pointer hover:bg-purple-100"
                    >
                      {badge.text}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* Description */}
            {article.description && (
              <p className="text-xl text-gray-600 mb-4">
                {article.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.created_at).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.view_count || 0} 조회</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>5분 읽기</span>
              </div>
              {article.category && (
                <Link href={`/tag/${encodeURIComponent(article.category)}`}>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-purple-600">
                    <Tag className="w-4 h-4" />
                    <span>{article.category}</span>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <div className="space-y-4 text-gray-700">
                <p>
                  이 아티클은 {article.title}에 대한 상세한 내용을 담고 있습니다.
                  {article.description && ` ${article.description}`}
                </p>
                <p>
                  고구마팜에서는 최고 품질의 고구마를 생산하기 위해 끊임없이 노력하고 있습니다.
                  우리의 목표는 단순히 좋은 고구마를 재배하는 것이 아니라, 
                  고객 여러분께 건강하고 맛있는 먹거리를 제공하는 것입니다.
                </p>
                <p>
                  앞으로도 저희 고구마팜은 지속 가능한 농업과 혁신적인 재배 방법을 통해
                  더 나은 품질의 제품을 선보이기 위해 노력하겠습니다.
                </p>
              </div>
            )}
          </div>

          {/* Share Section */}
          <div className="border-t border-b py-6 mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">이 글이 도움이 되셨나요?</span>
                <Button 
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-white' : ''}`} />
                  좋아요
                </Button>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유하기
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              관련 아티클
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/article/${related.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={getImageUrl(related.image_url || related.image)}
                          alt={related.title}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder.jpg'
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                          {related.title}
                        </h3>
                        {related.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {related.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

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