"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용한 별도 클라이언트 (RLS 우회)
// 주의: 이 키는 절대 클라이언트 코드에 노출되면 안 됩니다!
// 실제 프로덕션에서는 API 라우트를 통해 서버사이드에서 처리해야 합니다.

interface ImageUploadAdminProps {
  value?: string
  onChange: (url: string) => void
  bucket?: string
}

export default function ImageUploadAdmin({ 
  value, 
  onChange, 
  bucket = "post-images" 
}: ImageUploadAdminProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)

  // Anon key 사용 (일반적인 방법)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // 파일명 생성 (타임스탬프 + 원본 파일명)
      const timestamp = Date.now()
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `uploads/${fileName}`

      // 1. 먼저 버킷을 public으로 만들기 시도 (이미 public이면 무시)
      try {
        await supabase.storage.updateBucket(bucket, { public: true })
      } catch (e) {
        // 이미 public이거나 권한이 없으면 무시
      }

      // 2. 파일 업로드
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // 덮어쓰기 허용
        })

      if (error) {
        // RLS 에러인 경우 대체 방법 시도
        if (error.message.includes('row-level security')) {
          console.error('RLS 정책 에러 발생. Dashboard에서 Storage 정책을 확인하세요.')
          
          // 대체 방법: FormData를 사용한 직접 업로드
          const formData = new FormData()
          formData.append('file', file)
          
          const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`
          const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseAnonKey}`,
            },
            body: formData
          })

          if (!response.ok) {
            throw new Error('업로드 실패: Storage 정책을 확인하세요')
          }
        } else {
          throw error
        }
      }

      // 3. Public URL 생성
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl
      
      // 미리보기 설정
      setPreview(publicUrl)
      
      // 부모 컴포넌트에 URL 전달
      onChange(publicUrl)
      
      alert('이미지 업로드 성공!')
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`업로드 실패: ${error.message}\n\nSupabase Dashboard에서 다음을 확인하세요:\n1. Storage > post-images 버킷\n2. Configuration에서 "Public bucket" ON\n3. Policies에서 INSERT 권한 추가`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  이미지 선택
                </>
              )}
            </span>
          </Button>
        </label>
        
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {preview && (
        <div className="relative w-full max-w-md">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="mt-2 text-xs text-gray-500 break-all">
            {preview}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>⚠️ 업로드가 안 되는 경우:</p>
        <ol className="list-decimal ml-4">
          <li>Supabase Dashboard → Storage → post-images 버킷</li>
          <li>Configuration 탭 → "Public bucket" ON</li>
          <li>Policies 탭 → New Policy → Allow All 선택</li>
        </ol>
      </div>
    </div>
  )
}