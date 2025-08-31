"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}

export function ImageUpload({ 
  value, 
  onChange, 
  folder = 'images',
  label = '이미지'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('파일을 선택해주세요.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}.${fileExt}`

      // 파일 업로드
      const { data, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName)

      setPreview(publicUrl)
      onChange(publicUrl)
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(error.message || '이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setPreview(url)
    onChange(url)
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* URL 직접 입력 */}
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
          value={preview}
          onChange={handleUrlChange}
          disabled={uploading}
        />
        {preview && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 파일 업로드 */}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              업로드 중...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              파일 업로드
            </>
          )}
        </Button>
        <span className="text-sm text-gray-500">
          JPG, PNG, WebP (최대 5MB)
        </span>
      </div>

      {/* 이미지 미리보기 */}
      {preview && (
        <div className="relative w-full max-w-md">
          <img
            src={preview}
            alt="미리보기"
            className="w-full h-48 object-cover rounded-lg border"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder.png'
              target.onerror = null
            }}
          />
        </div>
      )}
    </div>
  )
}