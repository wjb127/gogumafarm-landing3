"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Menu } from "lucide-react"

export default function HomePage() {
  const [isHoveringGoguma, setIsHoveringGoguma] = useState(false)
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [top10Page, setTop10Page] = useState(0)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  
  const heroContents = [
    {
      image: "/youtube-content-1.png",
      badges: [
        { text: "공공기관", className: "badge-purple" },
        { text: "유튜브", className: "badge-green" },
        { text: "콘텐츠", className: "badge-blue" }
      ],
      title: "유튜브 필승법 = 귀여운 동물? 공공기관도, AI 크리에이터도 써먹는 콘텐츠 치트키!"
    },
    {
      image: "/youtube-content-2.jpg",
      badges: [
        { text: "NEW", className: "badge-purple" },
        { text: "마케팅", className: "badge-orange" },
        { text: "SNS", className: "badge-blue" }
      ],
      title: "패턴 2의 제목을 입력해주세요"
    },
    {
      image: "/youtube-content-3.jpg",
      badges: [
        { text: "트렌드", className: "badge-pink" },
        { text: "릴스", className: "badge-green" },
        { text: "템플릿", className: "badge-yellow" }
      ],
      title: "패턴 3의 제목을 입력해주세요"
    }
  ]
  
  const newsImages = [
    "/0812.png",
    "/0813_new.png",
    "/0814.png",
    "/0818.png",
    "/0819.png",
    "/0820.png",
    "/0821.png",
    "/0822.png"
  ]

  const handlePrevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + newsImages.length) % newsImages.length)
  }

  const handleNextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % newsImages.length)
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

  const top10Items: string[] = [
    "저희는 합의 끝에 이 챌린지로 골랐습니다. 알고리즘 탑승 직행하는 인기 릴스 모음!",
    "이건 첫 번째 레슨~ 요즘 유행하는 밈은 알고 가기! [2025년 7월 최신 밈 모음]",
    "추성훈, 권또또, 카니··· 지금 유튜브에서 협업하기 좋은 셀럽 채널 14선!",
    "29CM는 브랜딩, 올리브영은 콜라보? 각자 다른 마케팅으로 승부하는 플랫폼 시장!",
    "바야흐로 생성형 AI 콘텐츠의 전성시대! 지금 주목받는 AI 활용 트렌드 살펴보기",
    "나영석&김태호가 연프 패널로?! PD판 '사옥미팅'으로 보는 콘텐츠 인사이트",
    "웬즈데이가 역대급 콜라보와 함께 돌아왔다! 웬디스, 치토스 사례로 보는 IP 활용 전략",
    "2025 상반기 마케팅 트렌드·이슈 총결산! 실무자가 주목해야 할 변화는?",
    "인기 밈 알면 하룰라라 날아서 궁전으로 갈 수도 있어~ [2025년 6월 최신 밈 모음]",
    "여름 가고 부국제, 최강야구 온다! 9월 시즈널 이슈 담은 마케팅 캘린더 보기",
  ]

  const handleTop10Prev = () => setTop10Page((prev) => (prev - 1 + 2) % 2)
  const handleTop10Next = () => setTop10Page((prev) => (prev + 1) % 2)
  
  const handleHeroPrev = () => setCurrentHeroIndex((prev) => (prev - 1 + heroContents.length) % heroContents.length)
  const handleHeroNext = () => setCurrentHeroIndex((prev) => (prev + 1) % heroContents.length)
  
  // Auto-rotate hero content every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroContents.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [])

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
          <div className="flex items-center gap-8">
            <motion.div 
              className="logo-container"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="/logo-1.svg" 
                alt="고구마팜 by. The SMC" 
                className="h-10"
              />
            </motion.div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="nav-link">
                최신 밈과 트렌드
              </a>
              <a href="#" className="nav-link">
                핵심 전략과 레퍼런스
              </a>
              <a href="#" className="nav-link">
                일잘러 스킬셋
              </a>
              <a href="#" className="nav-link">
                슴씨피드
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-700 hover:text-black">
              문의하기
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              뉴스레터 구독하기
            </a>
            <Search className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </motion.header>

      {/* YouTube Content Section */}
      <section className="relative bg-gray-50 pt-24 pb-56 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 w-full z-0">
          <img 
            src="/hero-bottom-bg.png" 
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
                src={heroContents[currentHeroIndex].image} 
                alt="콘텐츠" 
                className="w-full rounded-lg shadow-xl" 
              />
            </motion.div>
            <motion.div
              className="order-1 lg:order-2 text-left"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="flex gap-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {heroContents[currentHeroIndex].badges.map((badge, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  >
                    <Badge className={`${badge.className} mr-2`}>{badge.text}</Badge>
                  </motion.span>
                ))}
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">
                {heroContents[currentHeroIndex].title}
              </h2>
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

      {/* Popular Articles TOP 10 */}
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
            <h2 className="text-3xl font-bold mb-4">인기 아티클 TOP 10</h2>
            <p className="text-gray-300">시간이 없다면? 이것부터 읽어봐도 좋아요</p>
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
            {top10Items.slice(top10Page * 5, top10Page * 5 + 5).map((title, idx) => {
              const itemNumber = top10Page * 5 + idx + 1
              const isLastInGroup = idx === 4
              return (
                <motion.div 
                  key={itemNumber}
                  className={`flex items-start gap-4 pb-4 ${isLastInGroup ? '' : 'border-b border-gray-700'} cursor-pointer`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <span className="text-2xl font-bold text-gray-400">{itemNumber}</span>
                  <p className="text-lg text-white">{title}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Latest Articles - Now Third Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">최신 아티클</h2>
          <p className="text-gray-600">방금 올라온 인사이트 확인하고 한 걸음 앞서가세요</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Article 1 */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="relative">
                <img src="/고구마팜썸네일-0822-700x401.jpg" alt="인기광고 리뷰해봄" className="w-full h-64 object-contain bg-gray-50" />
              </div>
              <CardContent className="pt-2 px-4 pb-4">
                <div className="mb-2">
                  <Badge className="bg-purple-100 text-purple-800">PPL</Badge>
                  <Badge className="bg-blue-100 text-blue-800 ml-1">광고</Badge>
                  <Badge className="bg-green-100 text-green-800 ml-1">유튜브</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">2025. 08. 22</p>
                <h3 className="font-bold">
                  이게 뮤직비디오야 광고야? 강렬한 비주얼로 시선을 사로잡은 [7월 인기 광고 분석]
                </h3>
              </CardContent>
            </Card>
          </motion.div>

          {/* Article 2 */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="relative">
                <img
                  src="/고구마팜-말랭이썸네일_250821-700x400.jpg"
                  alt="페이커X영 만남"
                  className="w-full h-64 object-contain bg-gray-50"
                />
              </div>
              <CardContent className="pt-2 px-4 pb-4">
                <div className="mb-2">
                  <Badge className="bg-blue-100 text-blue-800">광고</Badge>
                  <Badge className="bg-green-100 text-green-800 ml-1">유튜브</Badge>
                  <Badge className="bg-purple-100 text-purple-800 ml-1">캠페인</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">2025. 08. 22</p>
                <h3 className="font-bold">
                  게이머들이 뽑은 올해 최고의 광고?! 페이커X윙 만남을 성사시킨 삼성 OLED 캠페인!
                </h3>
              </CardContent>
            </Card>
          </motion.div>

          {/* Article 3 */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="relative">
                <img src="/고구마팜썸네일-0820-700x401.png" alt="구매로 전환되는 광고" className="w-full h-64 object-contain bg-gray-50" />
              </div>
              <CardContent className="pt-2 px-4 pb-4">
                <div className="mb-2">
                  <Badge className="bg-orange-100 text-orange-800">SNS</Badge>
                  <Badge className="bg-blue-100 text-blue-800 ml-1">광고</Badge>
                  <Badge className="bg-green-100 text-green-800 ml-1">인터뷰</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">2025. 08. 20</p>
                <h3 className="font-bold">구매로 전환되는 광고 기획의 비결? 광고에 영업 당한 소비자에게 물어봤습니다</h3>
              </CardContent>
            </Card>
          </motion.div>

          {/* Article 4 */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="relative">
                <img src="/고구마팜-시니어는-이렇게-삽니다_대지-1-사본-700x400.png" alt="시니어는 콘텐츠" className="w-full h-64 object-contain bg-gray-50" />
              </div>
              <CardContent className="pt-2 px-4 pb-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                    시니어마케팅
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 ml-1">
                    캠페인
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 ml-1">
                    트렌드
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">2025. 08. 19</p>
                <h3 className="font-bold">
                  5060 연프에 이어 이젠 초고령 유튜버까지?! 시니어 마케팅 하기 전에 꼭 알아야 할 변화들
                </h3>
              </CardContent>
            </Card>
          </motion.div>

          {/* Article 5 */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="relative">
                <img
                  src="/고구마팜-말랭이썸네일_250819-01-700x400.jpg"
                  alt="광복 80주년을 빛낸 캠페인"
                  className="w-full h-64 object-contain bg-gray-50"
                />
              </div>
              <CardContent className="pt-2 px-4 pb-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    CSR
                  </Badge>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800 ml-1">
                    시즈널마케팅
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 ml-1">
                    캠페인
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">2025. 08. 19</p>
                <h3 className="font-bold">AI가 되살려낸 80년 전 만세 소리! 올해 광복절 캠페인이 보여준 새로운 시도</h3>
              </CardContent>
            </Card>
          </motion.div>

          {/* Article 6 */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="relative">
                <img
                  src="/고구마팜-말랭이썸네일_250814-700x400.png"
                  alt="나영석&김태호가 연구 패널로"
                  className="w-full h-64 object-contain bg-gray-50"
                />
              </div>
              <CardContent className="pt-2 px-4 pb-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    유튜브
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 ml-1">
                    콘텐츠
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">2025. 08. 14</p>
                <h3 className="font-bold">나영석&김태호가 연프 패널로?! PD판 연프 '사옥미팅'으로 보는 콘텐츠 인사이트</h3>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" className="bg-black text-white hover:bg-gray-800 px-8 py-2">
              MORE
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* News Clipping Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side - Title and description */}
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold mb-4">뉴스클리핑</h2>
              <p className="text-gray-600 mb-8">
                방금 업데이트된 뉴미디어 소식,
                <br />
                여기 다 있어요
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
                className="absolute -top-8 -left-20 z-20"
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
                  src="/read-now.webp" 
                  alt="READ NOW" 
                  className="w-24 h-24 md:w-32 md:h-32"
                />
              </motion.div>
              
              <div className="grid grid-cols-2 gap-6">
                {[0, 1].map((offset) => {
                  const imageIndex = (currentNewsIndex + offset) % newsImages.length;
                  return (
                    <motion.div
                      key={`${imageIndex}-${currentNewsIndex}`}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      className="relative"
                    >
                      <img 
                        src={newsImages[imageIndex]} 
                        alt={`뉴스 ${imageIndex + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

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
              src={isHoveringGoguma ? "/broken-goguma.webp" : "/footer-goguma.webp"} 
              alt="고구마" 
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        {/* Footer Info */}
        <div className="bg-yellow-300 border-t border-yellow-400 py-4">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex gap-6">
              <span>이용약관</span>
              <span>개인정보 수집 및 이용방침</span>
            </div>
            <div className="text-right">
              <div>서울특별시 강남구 선릉로 648 · 070-7825-0749 · info@gogumafarm.kr</div>
              <div>©2025. The SMC all rights reserved.</div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}