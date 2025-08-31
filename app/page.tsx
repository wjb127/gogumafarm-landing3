"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Menu, X } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { trackPageView } from "@/lib/analytics"

export default function HomePage() {
  const [isHoveringGoguma, setIsHoveringGoguma] = useState(false)
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [top10Page, setTop10Page] = useState(0)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // DB에서 가져올 데이터 state
  const [heroContents, setHeroContents] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [newsClippings, setNewsClippings] = useState<any[]>([])
  const [top10Items, setTop10Items] = useState<any[]>([])
  const [siteSettings, setSiteSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // 데이터 가져오기 및 페이지뷰 트래킹
  useEffect(() => {
    fetchAllData()
    // 홈페이지 조회수 기록
    trackPageView('home')
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Hero 콘텐츠 가져오기
      const { data: heroData } = await supabase
        .from('kmong_12_hero_contents')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(3)
      
      // 데이터 변환 (image -> image_url, badges 파싱)
      if (heroData) {
        heroData.forEach(item => {
          item.image_url = item.image
          item.badge_text = item.badges ? item.badges.map((b: any) => b.text).join(',') : ''
        })
      }

      // 아티클 가져오기
      const { data: articlesData } = await supabase
        .from('kmong_12_articles')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(6)
      
      // 데이터 변환 (image -> image_url, badges 파싱)
      if (articlesData) {
        articlesData.forEach(item => {
          item.image_url = item.image
          item.badge_text = item.badges ? item.badges.map((b: any) => b.text).join(',') : ''
          item.badge_type = item.category // category를 badge_type으로 사용
        })
      }

      // 뉴스 클리핑 가져오기
      const { data: newsData } = await supabase
        .from('kmong_12_news_clippings')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      
      // 데이터 변환 (image -> image_url)
      if (newsData) {
        newsData.forEach(item => {
          item.image_url = item.image
        })
      }

      // TOP 10 아이템 가져오기
      const { data: top10Data } = await supabase
        .from('kmong_12_top10_items')
        .select('*')
        .eq('is_active', true)
        .order('rank', { ascending: true })
        .limit(10)

      // 사이트 설정 가져오기
      const { data: settingsData } = await supabase
        .from('kmong_12_site_settings')
        .select('*')

      // State 업데이트
      if (heroData && heroData.length > 0) {
        setHeroContents(heroData)
      }
      if (articlesData) {
        setArticles(articlesData)
      }
      if (newsData) {
        setNewsClippings(newsData)
      }
      if (top10Data) {
        setTop10Items(top10Data)
      }
      if (settingsData) {
        const settings: any = {}
        settingsData.forEach(item => {
          settings[item.setting_key] = item.setting_value
        })
        setSiteSettings(settings)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrevNews = () => {
    if (newsClippings.length > 0) {
      setCurrentNewsIndex((prev) => (prev - 1 + newsClippings.length) % newsClippings.length)
    }
  }

  const handleNextNews = () => {
    if (newsClippings.length > 0) {
      setCurrentNewsIndex((prev) => (prev + 1) % newsClippings.length)
    }
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

  const handleTop10Prev = () => setTop10Page((prev) => (prev - 1 + 2) % 2)
  const handleTop10Next = () => setTop10Page((prev) => (prev + 1) % 2)
  
  const handleHeroPrev = () => {
    if (heroContents.length > 0) {
      setCurrentHeroIndex((prev) => (prev - 1 + heroContents.length) % heroContents.length)
    }
  }
  const handleHeroNext = () => {
    if (heroContents.length > 0) {
      setCurrentHeroIndex((prev) => (prev + 1) % heroContents.length)
    }
  }
  
  // Auto-rotate hero content every 5 seconds
  useEffect(() => {
    if (heroContents.length > 0) {
      const timer = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroContents.length)
      }, 5000)
      
      return () => clearInterval(timer)
    }
  }, [heroContents])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 이미지 URL에 타임스탬프 추가 (캐시 버스팅)
  const getImageUrl = (url: string) => {
    if (!url) return ''
    // Supabase Storage URL인 경우 타임스탬프 추가
    if (url.includes('supabase.co/storage')) {
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}t=${Date.now()}`
    }
    return url
  }

  // Badge 타입에 따른 색상 매핑
  const getBadgeClassName = (type: string) => {
    switch(type) {
      case 'hot':
      case '핫이슈':
        return 'bg-red-100 text-red-800'
      case 'popular':
      case '인기':
        return 'bg-orange-100 text-orange-800'
      case 'new':
      case '새글':
        return 'bg-green-100 text-green-800'
      case 'recommend':
      case '추천':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-purple-100 text-purple-800'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-200 px-4 py-3 sticky top-0 bg-white z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <motion.div 
              className="logo-container"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={getImageUrl(siteSettings.logo_url) || "/logo-1.svg"} 
                alt={siteSettings.site_title || "고구마팜 by. The SMC"} 
                className="h-8 md:h-10"
              />
            </motion.div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="nav-link">
                {siteSettings.nav_link_1 || "최신 밈과 트렌드"}
              </a>
              <a href="#" className="nav-link">
                {siteSettings.nav_link_2 || "핵심 전략과 레퍼런스"}
              </a>
              <a href="#" className="nav-link">
                {siteSettings.nav_link_3 || "일잘러 스킬셋"}
              </a>
            </nav>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-gray-700 hover:text-black">
              {siteSettings.header_cta_1 || "문의하기"}
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              {siteSettings.header_cta_2 || "뉴스레터 구독하기"}
            </a>
            <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 mt-3"
            >
              <nav className="flex flex-col py-4 px-4 space-y-3">
                <a href="#" className="text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded transition-colors">
                  {siteSettings.nav_link_1 || "최신 밈과 트렌드"}
                </a>
                <a href="#" className="text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded transition-colors">
                  {siteSettings.nav_link_2 || "핵심 전략과 레퍼런스"}
                </a>
                <a href="#" className="text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded transition-colors">
                  {siteSettings.nav_link_3 || "일잘러 스킬셋"}
                </a>
                <div className="border-t pt-3 mt-3 space-y-3">
                  <a href="#" className="text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded transition-colors block">
                    {siteSettings.header_cta_1 || "문의하기"}
                  </a>
                  <a href="#" className="text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded transition-colors block">
                    {siteSettings.header_cta_2 || "뉴스레터 구독하기"}
                  </a>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Search className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">검색</span>
                  </div>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded transition-colors block">
                    📷 인스타그램
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section - DB 기반 */}
      {heroContents.length > 0 && (
        <section className="relative bg-gray-50 pt-24 pb-56 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 w-full z-0">
            <img 
              src="https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/hero/hero-bottom-bg.png" 
              alt="" 
              className="w-full h-auto"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 relative z-10 pb-20">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              key={currentHeroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src={getImageUrl(heroContents[currentHeroIndex].image_url)} 
                  alt={heroContents[currentHeroIndex].title} 
                  className="w-full rounded-lg shadow-xl" 
                />
              </motion.div>
              <motion.div
                className="order-1 lg:order-2 text-left"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {heroContents[currentHeroIndex].badge_text && (
                  <motion.div 
                    className="flex gap-2 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {heroContents[currentHeroIndex].badge_text.split(',').map((badge: string, idx: number) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                      >
                        <Badge className="bg-purple-100 text-purple-800">{badge.trim()}</Badge>
                      </motion.span>
                    ))}
                  </motion.div>
                )}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  {heroContents[currentHeroIndex].title}
                </h2>
                {heroContents[currentHeroIndex].subtitle && (
                  <p className="text-gray-600 mb-4">
                    {heroContents[currentHeroIndex].subtitle}
                  </p>
                )}
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleHeroPrev}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleHeroNext}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* TOP 10 Section - DB 기반 */}
      {top10Items.length > 0 && (
        <motion.section 
          className="bg-black text-white py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                {siteSettings.top10_title || "인기 아티클 TOP 10"}
              </h2>
              <p className="text-gray-300">
                {siteSettings.top10_subtitle || "시간이 없다면? 이것부터 읽어봐도 좋아요"}
              </p>
              <motion.div 
                className="w-24 h-0.5 bg-white mx-auto mt-4"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.div>

            <div className="flex justify-end mb-6">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-gray-800"
                  onClick={handleTop10Prev}
                  aria-label="이전 인기 아티클"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-gray-800"
                  onClick={handleTop10Next}
                  aria-label="다음 인기 아티클"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <motion.div 
              key={top10Page}
              className="space-y-6" 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {top10Items.slice(top10Page * 5, top10Page * 5 + 5).map((item, idx) => {
                const isLastInGroup = idx === 4
                return (
                  <motion.div 
                    key={item.id}
                    className={`flex items-start gap-4 pb-4 ${isLastInGroup ? '' : 'border-b border-gray-700'} ${item.link_url ? 'cursor-pointer' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 10 }}
                    onClick={() => item.link_url && window.open(item.link_url, '_blank')}
                  >
                    <span className="text-2xl font-bold text-gray-400">{item.rank}</span>
                    <p className="text-lg text-white">{item.title}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Latest Articles Section - DB 기반 */}
      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {siteSettings.articles_title || "최신 아티클"}
            </h2>
            <p className="text-gray-600">
              {siteSettings.articles_subtitle || "방금 올라온 인사이트 확인하고 한 걸음 앞서가세요"}
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {articles.map((article) => (
              <motion.div key={article.id} variants={fadeInUp}>
                <Link href={`/article/${article.id}`}>
                  <Card 
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  >
                  <div className="relative">
                    <img 
                      src={getImageUrl(article.image_url)} 
                      alt={article.title} 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <CardContent className="pt-2 px-4 pb-4">
                    {article.badge_text && (
                      <div className="mb-2">
                        {article.badge_text.split(',').map((badge: string, idx: number) => (
                          <Link 
                            key={idx} 
                            href={`/tag/${encodeURIComponent(badge.trim())}`}
                          >
                            <Badge 
                              className={`${getBadgeClassName(article.badge_type)} ${idx > 0 ? 'ml-1' : ''} cursor-pointer hover:opacity-80`}
                            >
                              {badge.trim()}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(article.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).replace(/\./g, '. ')}
                    </p>
                    <h3 className="font-bold">{article.title}</h3>
                    {article.description && (
                      <p className="text-sm text-gray-600 mt-2">{article.description}</p>
                    )}
                  </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/articles">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="bg-black text-white hover:bg-gray-800 px-8 py-2">
                  MORE
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* News Clipping Section - DB 기반 */}
      {newsClippings.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left side - Title and description */}
              <div className="lg:col-span-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  {siteSettings.news_title || "뉴스클리핑"}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
                  {siteSettings.news_subtitle || "방금 업데이트된 뉴미디어 소식,\n여기 다 있어요"}
                </p>
                <div className="border-b border-gray-300 mb-8"></div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full bg-gray-100"
                    onClick={handlePrevNews}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full bg-gray-100"
                    onClick={handleNextNews}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Right side - News images */}
              <div className="lg:col-span-8 relative">
                {/* READ NOW 스티커 이미지 */}
                <motion.div 
                  className="absolute -top-4 md:-top-8 -left-10 md:-left-20 z-20"
                  animate={{ 
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.05, 1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <img 
                    src="https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/misc/read-now.webp" 
                    alt="READ NOW" 
                    className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32"
                  />
                </motion.div>
                
                <div className="relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentNewsIndex}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{
                        x: { type: "spring", stiffness: 200, damping: 25 },
                        opacity: { duration: 0.3 }
                      }}
                    >
                      {[0, 1].map((offset) => {
                        const imageIndex = (currentNewsIndex + offset) % newsClippings.length;
                        const news = newsClippings[imageIndex];
                        return (
                          <div key={offset} className="relative">
                            <img 
                              src={getImageUrl(news.image_url)} 
                              alt={news.title || `뉴스 ${imageIndex + 1}`}
                              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                              onClick={() => news.link_url && window.open(news.link_url, '_blank')}
                            />
                          </div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <motion.footer 
        className="bg-yellow-300 py-8 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div 
            className="mx-auto mb-4 cursor-pointer w-72 h-72 relative"
            onMouseEnter={() => setIsHoveringGoguma(true)}
            onMouseLeave={() => setIsHoveringGoguma(false)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src={isHoveringGoguma ? "https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/misc/broken-goguma.webp" : "https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/misc/footer-goguma.webp"} 
              alt="고구마" 
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        {/* Footer Info */}
        <div className="bg-yellow-300 border-t border-yellow-400 py-4">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex gap-6">
              <span>{siteSettings.footer_term || "이용약관"}</span>
              <span>{siteSettings.footer_privacy || "개인정보 수집 및 이용방침"}</span>
            </div>
            <div className="text-right">
              <div>
                {siteSettings.footer_address || "서울특별시 강남구 선릉로 648"} · 
                {siteSettings.footer_phone || "070-7825-0749"} · 
                {siteSettings.footer_email || "info@gogumafarm.kr"}
              </div>
              <div>{siteSettings.footer_copyright || "©2025. The SMC all rights reserved."}</div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}