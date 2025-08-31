"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, Eye, TrendingUp, Clock, Calendar, BarChart3, 
  Activity, RefreshCw, Tag, FileText 
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { getVisitorStats, getPopularArticles, getPopularTags } from "@/lib/analytics"
import Link from "next/link"

interface Stats {
  activeVisitors: number
  totalViews: number
  todayViews: number
  todayUniqueVisitors: number
}

interface ArticleWithStats {
  id: string
  title: string
  view_count: number
  created_at: string
}

interface TagStat {
  tag_name: string
  view_count: number
  article_count: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    activeVisitors: 0,
    totalViews: 0,
    todayViews: 0,
    todayUniqueVisitors: 0
  })
  const [popularArticles, setPopularArticles] = useState<ArticleWithStats[]>([])
  const [popularTags, setPopularTags] = useState<TagStat[]>([])
  const [recentViews, setRecentViews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
    // 30초마다 자동 새로고침
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true)
      
      // 방문자 통계
      const visitorStats = await getVisitorStats()
      setStats(visitorStats)
      
      // 인기 아티클
      const articles = await getPopularArticles(5)
      setPopularArticles(articles)
      
      // 인기 태그
      const tags = await getPopularTags(10)
      setPopularTags(tags)
      
      // 최근 조회 기록
      const { data: views } = await supabase
        .from('kmong_12_page_views')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (views) {
        setRecentViews(views)
      }
      
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatTime = (date: string) => {
    const now = new Date()
    const viewDate = new Date(date)
    const diff = now.getTime() - viewDate.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`
    return viewDate.toLocaleDateString('ko-KR')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">방문자 통계</h1>
          <p className="text-gray-600 mt-2">실시간 방문자 및 조회수 분석</p>
        </div>
        <Button 
          onClick={fetchAnalytics} 
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">실시간 방문자</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.activeVisitors)}</div>
              <p className="text-xs text-muted-foreground">최근 5분 이내</p>
              <div className="mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(stats.activeVisitors, 10))].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">오늘 조회수</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.todayViews)}</div>
              <p className="text-xs text-muted-foreground">
                방문자 {formatNumber(stats.todayUniqueVisitors)}명
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 조회수</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalViews)}</div>
              <p className="text-xs text-muted-foreground">누적 조회수</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 체류시간</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3:42</div>
              <p className="text-xs text-muted-foreground">분:초</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 인기 아티클 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              인기 아티클 TOP 5
            </CardTitle>
            <CardDescription>조회수 기준 상위 아티클</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div key={article.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{article.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatNumber(article.view_count || 0)} 조회
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 인기 태그 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              인기 태그
            </CardTitle>
            <CardDescription>많이 조회된 태그</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link key={tag.tag_name} href={`/tag/${encodeURIComponent(tag.tag_name)}`}>
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-purple-100"
                  >
                    #{tag.tag_name}
                    <span className="ml-1 text-xs opacity-60">
                      {formatNumber(tag.view_count)}
                    </span>
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 실시간 조회 기록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            실시간 조회 기록
          </CardTitle>
          <CardDescription>최근 페이지 조회 내역</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentViews.map((view) => (
              <div key={view.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <span className="text-sm font-medium">
                      {view.page_type === 'home' && '메인 페이지'}
                      {view.page_type === 'article' && '아티클'}
                      {view.page_type === 'tag' && `태그: ${view.page_id}`}
                      {view.page_type === 'admin' && '관리자'}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTime(view.created_at)}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {view.page_type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}