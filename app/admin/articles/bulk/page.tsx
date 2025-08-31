"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, FileJson, Check, AlertCircle, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BulkArticlesPage() {
  const [jsonInput, setJsonInput] = useState("")
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({ 
    success: 0, 
    failed: 0, 
    errors: [] 
  })

  // 샘플 JSON 템플릿
  const sampleJson = `[
  {
    "title": "첫 번째 아티클 제목",
    "description": "아티클 설명입니다",
    "image": "https://example.com/image1.jpg",
    "badges": [
      {"text": "핫이슈", "className": "badge-red"},
      {"text": "광고", "className": "badge-purple"}
    ],
    "category": "마케팅",
    "is_featured": true,
    "order_index": 1
  },
  {
    "title": "두 번째 아티클 제목",
    "description": "또 다른 아티클 설명",
    "image": "https://example.com/image2.jpg",
    "badges": [
      {"text": "새글", "className": "badge-green"}
    ],
    "category": "트렌드",
    "is_featured": false,
    "order_index": 2
  }
]`

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setJsonInput(content)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    setImporting(true)
    setResults({ success: 0, failed: 0, errors: [] })

    try {
      const articles = JSON.parse(jsonInput)
      
      if (!Array.isArray(articles)) {
        throw new Error("JSON은 배열 형식이어야 합니다")
      }

      let successCount = 0
      let failedCount = 0
      const errors: string[] = []

      for (const article of articles) {
        try {
          // 필수 필드 검증
          if (!article.title || !article.image) {
            throw new Error(`필수 필드 누락: ${article.title || '제목 없음'}`)
          }

          // 데이터 정리
          const cleanedArticle = {
            title: article.title,
            description: article.description || "",
            image: article.image,
            badges: article.badges || [],
            category: article.category || "기타",
            is_featured: article.is_featured || false,
            order_index: article.order_index || 999,
            is_active: article.is_active !== false, // 기본값 true
            created_at: article.created_at || new Date().toISOString()
          }

          // Supabase에 삽입
          const { error } = await supabase
            .from("kmong_12_articles")
            .insert(cleanedArticle)

          if (error) {
            throw error
          }

          successCount++
        } catch (error: any) {
          failedCount++
          errors.push(`${article.title || '제목 없음'}: ${error.message}`)
        }
      }

      setResults({ success: successCount, failed: failedCount, errors })
    } catch (error: any) {
      setResults({ 
        success: 0, 
        failed: 1, 
        errors: [`JSON 파싱 오류: ${error.message}`] 
      })
    } finally {
      setImporting(false)
    }
  }

  const handleClear = () => {
    setJsonInput("")
    setResults({ success: 0, failed: 0, errors: [] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">아티클 일괄 추가</h1>
          <p className="text-gray-600 mt-2">JSON 형식으로 여러 아티클을 한번에 추가합니다</p>
        </div>
        <Link href="/admin/articles">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 입력 영역 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>JSON 데이터 입력</CardTitle>
              <CardDescription>
                아래 형식에 맞춰 JSON 데이터를 입력하거나 파일을 업로드하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>파일 업로드 (JSON)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="json-upload"
                  />
                  <label htmlFor="json-upload">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        JSON 파일 선택
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              <div>
                <Label>JSON 데이터</Label>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={sampleJson}
                  className="font-mono text-sm h-96"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleImport} 
                  disabled={!jsonInput || importing}
                  className="flex-1"
                >
                  {importing ? "가져오는 중..." : "아티클 가져오기"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  disabled={importing}
                >
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 샘플 & 결과 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>JSON 템플릿</CardTitle>
              <CardDescription>아래 형식을 참고하여 작성하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                <code>{sampleJson}</code>
              </pre>
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>필수 필드:</strong></p>
                <ul className="list-disc list-inside text-gray-600">
                  <li>title: 아티클 제목</li>
                  <li>image: 이미지 URL</li>
                </ul>
                <p className="mt-2"><strong>선택 필드:</strong></p>
                <ul className="list-disc list-inside text-gray-600">
                  <li>description: 설명</li>
                  <li>badges: 뱃지 배열 [{`{text, className}`}]</li>
                  <li>category: 카테고리</li>
                  <li>is_featured: 추천 여부 (true/false)</li>
                  <li>order_index: 순서 (숫자)</li>
                  <li>is_active: 활성화 여부 (기본값: true)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 가져오기 결과 */}
          {(results.success > 0 || results.failed > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>가져오기 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.success > 0 && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      {results.success}개 아티클이 성공적으로 추가되었습니다.
                    </AlertDescription>
                  </Alert>
                )}
                
                {results.failed > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {results.failed}개 아티클 추가에 실패했습니다.
                    </AlertDescription>
                  </Alert>
                )}

                {results.errors.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">오류 상세:</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      {results.errors.map((error, idx) => (
                        <li key={idx} className="text-xs">• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}