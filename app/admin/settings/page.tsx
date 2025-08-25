"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Settings, Save, RefreshCw, Database, Globe, Mail, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface SiteSettings {
  site_title: string
  site_description: string
  contact_email: string
  contact_phone: string
  footer_text: string
  social_links: {
    facebook?: string
    instagram?: string
    youtube?: string
    blog?: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: "고구마팜",
    site_description: "마케팅 인사이트와 콘텐츠 전략",
    contact_email: "",
    contact_phone: "",
    footer_text: "© 2025 고구마팜. All rights reserved.",
    social_links: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("kmong_12_site_settings")
      .select("*")
    
    if (data && !error) {
      const settingsObj: any = {}
      data.forEach(item => {
        if (item.value) {
          settingsObj[item.key] = item.value
        }
      })
      
      setSettings({
        site_title: settingsObj.site_title || "고구마팜",
        site_description: settingsObj.site_description || "마케팅 인사이트와 콘텐츠 전략",
        contact_email: settingsObj.contact_email || "",
        contact_phone: settingsObj.contact_phone || "",
        footer_text: settingsObj.footer_text || "© 2025 고구마팜. All rights reserved.",
        social_links: settingsObj.social_links || {}
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    
    const settingsToSave = [
      { key: "site_title", value: settings.site_title },
      { key: "site_description", value: settings.site_description },
      { key: "contact_email", value: settings.contact_email },
      { key: "contact_phone", value: settings.contact_phone },
      { key: "footer_text", value: settings.footer_text },
      { key: "social_links", value: settings.social_links }
    ]

    for (const setting of settingsToSave) {
      await supabase
        .from("kmong_12_site_settings")
        .upsert({
          key: setting.key,
          value: setting.value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "key"
        })
    }

    setSaving(false)
    alert("설정이 저장되었습니다!")
  }

  const handleClearCache = async () => {
    if (confirm("캐시를 초기화하시겠습니까? 페이지가 새로고침됩니다.")) {
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
    }
  }

  const handleResetDatabase = async () => {
    if (confirm("정말로 데이터베이스를 초기화하시겠습니까? 모든 데이터가 삭제됩니다.")) {
      if (confirm("이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?")) {
        // 여기에 데이터베이스 초기화 로직 추가
        alert("보안상의 이유로 이 기능은 비활성화되어 있습니다.")
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">사이트 설정</h1>
        <p className="text-gray-600 mt-2">웹사이트의 기본 설정을 관리합니다</p>
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            기본 정보
          </CardTitle>
          <CardDescription>사이트의 기본 정보를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>사이트 제목</Label>
            <Input 
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              placeholder="고구마팜"
            />
          </div>
          <div>
            <Label>사이트 설명</Label>
            <Textarea 
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              placeholder="마케팅 인사이트와 콘텐츠 전략"
              rows={3}
            />
          </div>
          <div>
            <Label>푸터 텍스트</Label>
            <Input 
              value={settings.footer_text}
              onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
              placeholder="© 2025 고구마팜. All rights reserved."
            />
          </div>
        </CardContent>
      </Card>

      {/* 연락처 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            연락처 정보
          </CardTitle>
          <CardDescription>관리자 연락처를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              이메일
            </Label>
            <Input 
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              placeholder="admin@gogumafarm.com"
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              전화번호
            </Label>
            <Input 
              value={settings.contact_phone}
              onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
              placeholder="010-1234-5678"
            />
          </div>
        </CardContent>
      </Card>

      {/* 소셜 미디어 */}
      <Card>
        <CardHeader>
          <CardTitle>소셜 미디어</CardTitle>
          <CardDescription>소셜 미디어 링크를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Facebook</Label>
            <Input 
              value={settings.social_links.facebook || ""}
              onChange={(e) => setSettings({ 
                ...settings, 
                social_links: { ...settings.social_links, facebook: e.target.value }
              })}
              placeholder="https://facebook.com/gogumafarm"
            />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input 
              value={settings.social_links.instagram || ""}
              onChange={(e) => setSettings({ 
                ...settings, 
                social_links: { ...settings.social_links, instagram: e.target.value }
              })}
              placeholder="https://instagram.com/gogumafarm"
            />
          </div>
          <div>
            <Label>YouTube</Label>
            <Input 
              value={settings.social_links.youtube || ""}
              onChange={(e) => setSettings({ 
                ...settings, 
                social_links: { ...settings.social_links, youtube: e.target.value }
              })}
              placeholder="https://youtube.com/@gogumafarm"
            />
          </div>
          <div>
            <Label>Blog</Label>
            <Input 
              value={settings.social_links.blog || ""}
              onChange={(e) => setSettings({ 
                ...settings, 
                social_links: { ...settings.social_links, blog: e.target.value }
              })}
              placeholder="https://blog.gogumafarm.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* 시스템 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            시스템 관리
          </CardTitle>
          <CardDescription>시스템 관련 작업을 수행합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClearCache}>
              <RefreshCw className="w-4 h-4 mr-2" />
              캐시 초기화
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleResetDatabase}>
              <Database className="w-4 h-4 mr-2" />
              데이터베이스 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              설정 저장
            </>
          )}
        </Button>
      </div>
    </div>
  )
}