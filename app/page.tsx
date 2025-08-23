"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Menu } from "lucide-react"

export default function HomePage() {
  const [isHoveringGoguma, setIsHoveringGoguma] = useState(false)
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  
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
      <section className="bg-gray-50 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src="/korean-cute-animals-youtube.png" alt="유튜브 지트키 등장" className="w-full rounded-lg shadow-xl" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div className="mb-4" variants={stagger} initial="initial" animate="animate">
                <motion.span variants={fadeInUp}>
                  <Badge className="badge-purple mr-2">공공기관</Badge>
                </motion.span>
                <motion.span variants={fadeInUp}>
                  <Badge className="badge-green mr-2">유튜브</Badge>
                </motion.span>
                <motion.span variants={fadeInUp}>
                  <Badge className="badge-blue">콘텐츠</Badge>
                </motion.span>
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">
                유튜브 필승법 = 귀여운 동물? 공공기관도, AI 크리에이터도 써먹는 콘텐츠 치트키!
              </h2>
              <div className="flex justify-end">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
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
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <motion.div className="space-y-6" variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <motion.div 
              className="flex items-start gap-4 pb-4 border-b border-gray-700 cursor-pointer"
              variants={fadeInUp}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl font-bold text-gray-400">1</span>
              <p className="text-lg">저희는 함의 끝에 이 챌린지로 공짜입니다. 앞고리즘 탐승 직행하는 인기 필수 모음!</p>
            </motion.div>
            <motion.div 
              className="flex items-start gap-4 pb-4 border-b border-gray-700 cursor-pointer"
              variants={fadeInUp}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl font-bold text-gray-400">2</span>
              <p className="text-lg">이건 첫 번째 레슨~ 요즘 유행하는 맘은 알고 가기! [2025년 7월 최신 및 모음]</p>
            </motion.div>
            <motion.div 
              className="flex items-start gap-4 pb-4 border-b border-gray-700 cursor-pointer"
              variants={fadeInUp}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl font-bold text-gray-400">3</span>
              <p className="text-lg">추성훈, 김포도, 카니... 지금 유튜브에서 협업하기 좋은 셀럽 체널 14선!</p>
            </motion.div>
            <motion.div 
              className="flex items-start gap-4 pb-4 border-b border-gray-700 cursor-pointer"
              variants={fadeInUp}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl font-bold text-gray-400">4</span>
              <p className="text-lg">29C는 브랜딩, 올리브영은 클라넘? 각자 다른 마케팅으로 승부하는 플랫폼 시장!</p>
            </motion.div>
            <motion.div 
              className="flex items-start gap-4 pb-4 cursor-pointer"
              variants={fadeInUp}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl font-bold text-gray-400">5</span>
              <p className="text-lg">바야흐로 생성형 AI 콘텐츠의 전성시대! 지금 주목받는 AI 활용 트렌드 살펴보기</p>
            </motion.div>
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