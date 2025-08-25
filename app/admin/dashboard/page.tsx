"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Eye, 
  FileText, 
  Image, 
  Newspaper, 
  Trophy,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react"

const statsCards = [
  {
    title: "총 방문자",
    value: "12,345",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "메인 캐러셀",
    value: "3개",
    change: "활성화됨",
    icon: Image,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "아티클 수",
    value: "6개",
    change: "게시됨",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "TOP 10 항목",
    value: "10개",
    change: "활성화됨",
    icon: Trophy,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-500 mt-1">고구마팜 관리자 페이지에 오신 것을 환영합니다</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{formatDate(currentTime)}</p>
          <p className="text-2xl font-mono font-semibold text-gray-700">
            {formatTime(currentTime)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 작업</CardTitle>
          <CardDescription>자주 사용하는 기능에 빠르게 접근하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.a
              href="/admin/hero"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <Image className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">메인 캐러셀 편집</p>
                <p className="text-sm text-gray-500">메인 페이지 이미지 변경</p>
              </div>
            </motion.a>
            
            <motion.a
              href="/admin/articles"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
            >
              <FileText className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">새 아티클 추가</p>
                <p className="text-sm text-gray-500">최신 콘텐츠 업로드</p>
              </div>
            </motion.a>
            
            <motion.a
              href="/admin/top10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
            >
              <Trophy className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium">TOP 10 업데이트</p>
                <p className="text-sm text-gray-500">인기 아티클 순위 변경</p>
              </div>
            </motion.a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
          <CardDescription>최근 24시간 동안의 변경사항</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "방금 전", action: "로그인", icon: Eye, color: "text-blue-600" },
              { time: "2시간 전", action: "아티클 수정", icon: FileText, color: "text-green-600" },
              { time: "5시간 전", action: "메인 캐러셀 업데이트", icon: Image, color: "text-purple-600" },
              { time: "1일 전", action: "TOP 10 순서 변경", icon: Trophy, color: "text-orange-600" },
            ].map((activity, index) => {
              const Icon = activity.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
                >
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}