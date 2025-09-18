"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Settings, Save, RefreshCw, Database, Globe, Mail, Phone, Link, Navigation, ExternalLink } from "lucide-react"
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
  // 푸터 텍스트 관련 필드
  footer_term?: string
  footer_privacy?: string
  footer_address?: string
  footer_phone?: string
  footer_email?: string
  footer_copyright?: string
  // URL 관련 필드
  nav_link_1?: string
  nav_link_1_url?: string
  nav_link_2?: string
  nav_link_2_url?: string
  nav_link_3?: string
  nav_link_3_url?: string
  nav_link_4?: string
  nav_link_4_url?: string
  header_cta_1?: string
  header_cta_1_url?: string
  header_cta_2?: string
  header_cta_2_url?: string
  footer_privacy_url?: string
  footer_terms_url?: string
  footer_contact_url?: string
  admin_panel_url?: string
  all_articles_url?: string
  instagram_url?: string
  // 추가 URL 필드
  kakao_url?: string
  naver_store_url?: string
  business_info_url?: string
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
    console.log("📥 Fetching settings from database...")
    const { data, error } = await supabase
      .from("kmong_12_site_settings")
      .select("*")
    
    console.log("Database response:", { data, error })
    
    if (data && data.length > 0 && !error) {
      // URL은 첫 번째 행에서 가져오기 (모든 행에 동일)
      const firstRow = data[0]
      
      // 텍스트 설정들 수집
      const textSettings: any = {}
      data.forEach(item => {
        if (item.setting_key && item.setting_value) {
          textSettings[item.setting_key] = item.setting_value
          console.log(`Loading text setting: ${item.setting_key} =`, item.setting_value)
        }
      })
      
      const finalSettings = {
        // 텍스트 설정들
        site_title: textSettings.site_title || "고구마팜",
        site_description: textSettings.site_description || "마케팅 인사이트와 콘텐츠 전략",
        contact_email: textSettings.contact_email || "",
        contact_phone: textSettings.contact_phone || "",
        footer_text: textSettings.footer_text || "© 2025 고구마팜. All rights reserved.",
        footer_term: textSettings.footer_term || "이용약관",
        footer_privacy: textSettings.footer_privacy || "개인정보 수집 및 이용방침",
        footer_address: textSettings.footer_address || "서울특별시 강남구 선릉로 648",
        footer_phone: textSettings.footer_phone || "070-7825-0749",
        footer_email: textSettings.footer_email || "info@gogumafarm.kr",
        footer_copyright: textSettings.footer_copyright || "©2025. The SMC all rights reserved.",
        
        // URL 컬럼들 (직접 컬럼에서 읽기)
        nav_link_1: textSettings.nav_link_1 || "최신 밈과 트렌드",
        nav_link_2: textSettings.nav_link_2 || "핵심 전략과 레퍼런스",
        nav_link_3: textSettings.nav_link_3 || "일잘러 스킬셋",
        nav_link_4: textSettings.nav_link_4 || "슴씨피드",
        header_cta_1: textSettings.header_cta_1 || "문의하기",
        header_cta_2: textSettings.header_cta_2 || "뉴스레터 구독하기",
        
        nav_link_1_url: firstRow.nav_link_1_url || "#",
        nav_link_2_url: firstRow.nav_link_2_url || "#",
        nav_link_3_url: firstRow.nav_link_3_url || "#",
        nav_link_4_url: firstRow.nav_link_4_url || "#",
        header_cta_1_url: firstRow.header_cta_1_url || "#",
        header_cta_2_url: firstRow.header_cta_2_url || "#",
        instagram_url: firstRow.instagram_url || "",
        youtube_url: firstRow.youtube_url || "",
        facebook_url: firstRow.facebook_url || "",
        twitter_url: firstRow.twitter_url || "",
        blog_url: firstRow.blog_url || "",
        footer_privacy_url: firstRow.footer_privacy_url || "/privacy",
        footer_terms_url: firstRow.footer_terms_url || "/terms",
        footer_contact_url: firstRow.footer_contact_url || "/contact",
        admin_panel_url: firstRow.admin_panel_url || "/admin",
        all_articles_url: firstRow.all_articles_url || "/articles",
        newsletter_signup_url: firstRow.newsletter_signup_url || "#",
        kakao_url: firstRow.kakao_url || "",
        naver_store_url: firstRow.naver_store_url || "",
        business_info_url: firstRow.business_info_url || "",
        
        // social_links 객체로 만들기
        social_links: {
          facebook: firstRow.facebook_url || "",
          instagram: firstRow.instagram_url || "",
          youtube: firstRow.youtube_url || "",
          blog: firstRow.blog_url || ""
        },
        
        // 추가 텍스트 설정
        ...textSettings
      }
      
      console.log("📋 Final settings loaded:", finalSettings)
      setSettings(finalSettings)
    } else if (error) {
      console.error("❌ Error fetching settings:", error)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    console.log("💾 Starting save process...")
    console.log("Current settings to save:", settings)
    
    let hasError = false
    
    // URL 필드들을 직접 컬럼으로 업데이트
    const urlColumns = [
      'nav_link_1_url', 'nav_link_2_url', 'nav_link_3_url', 'nav_link_4_url',
      'header_cta_1_url', 'header_cta_2_url',
      'instagram_url', 'youtube_url', 'facebook_url', 'twitter_url', 'blog_url',
      'footer_privacy_url', 'footer_terms_url', 'footer_contact_url',
      'admin_panel_url', 'all_articles_url', 'newsletter_signup_url',
      'kakao_url', 'naver_store_url', 'business_info_url'
    ]
    
    // URL 업데이트 객체 생성
    const urlUpdates: any = {}
    urlColumns.forEach(col => {
      if (col in settings) {
        urlUpdates[col] = settings[col as keyof SiteSettings] || ''
      }
    })
    
    // social_links 객체 처리
    if (settings.social_links) {
      if (settings.social_links.facebook) urlUpdates.facebook_url = settings.social_links.facebook
      if (settings.social_links.instagram) urlUpdates.instagram_url = settings.social_links.instagram
      if (settings.social_links.youtube) urlUpdates.youtube_url = settings.social_links.youtube
      if (settings.social_links.blog) urlUpdates.blog_url = settings.social_links.blog
    }
    
    // 모든 행에 URL 업데이트 (URL은 모든 행에 동일하게 저장됨)
    if (Object.keys(urlUpdates).length > 0) {
      console.log("Updating URLs:", urlUpdates)
      const { error: urlError } = await supabase
        .from("kmong_12_site_settings")
        .update(urlUpdates)
        .not('id', 'is', null) // 모든 행 업데이트
      
      if (urlError) {
        console.error("❌ Error updating URLs:", urlError)
        hasError = true
      } else {
        console.log("✅ URLs updated successfully")
      }
    }
    
    // 텍스트 설정들은 setting_key/setting_value로 저장
    const textSettings = [
      'site_title', 'site_description', 'contact_email', 'contact_phone',
      'footer_text', 'footer_term', 'footer_privacy', 'footer_address',
      'footer_phone', 'footer_email', 'footer_copyright'
    ]
    
    for (const key of textSettings) {
      if (key in settings) {
        const value = settings[key as keyof SiteSettings]
        console.log(`Saving text setting: ${key} =`, value)
        
        // 기존 레코드 확인
        const { data: existing } = await supabase
          .from("kmong_12_site_settings")
          .select("*")
          .eq("setting_key", key)
          .single()
        
        if (existing) {
          // UPDATE
          const { error } = await supabase
            .from("kmong_12_site_settings")
            .update({
              setting_value: value,
              updated_at: new Date().toISOString()
            })
            .eq("setting_key", key)
          
          if (error) {
            console.error(`❌ Error updating ${key}:`, error)
            hasError = true
          } else {
            console.log(`✅ Updated ${key}`)
          }
        } else if (value) {
          // INSERT (값이 있을 때만)
          const { error } = await supabase
            .from("kmong_12_site_settings")
            .insert({
              setting_key: key,
              setting_value: value,
              setting_type: 'text',
              // URL 컬럼들도 기본값 설정 (모든 행에 동일)
              ...urlUpdates
            })
          
          if (error) {
            console.error(`❌ Error inserting ${key}:`, error)
            hasError = true
          } else {
            console.log(`✅ Inserted ${key}`)
          }
        }
      }
    }

    setSaving(false)
    
    if (hasError) {
      alert("일부 설정 저장 중 오류가 발생했습니다. 콘솔을 확인해주세요.")
    } else {
      alert("설정이 저장되었습니다!")
      console.log("🎉 All settings saved successfully!")
      // 저장 후 데이터 다시 불러오기
      console.log("🔄 Reloading settings after save...")
      await fetchSettings()
    }
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

      {/* 푸터 텍스트 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            푸터 텍스트 관리
          </CardTitle>
          <CardDescription>웹사이트 푸터에 표시되는 텍스트를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>이용약관 텍스트</Label>
              <Input 
                value={settings.footer_term || ""}
                onChange={(e) => setSettings({ ...settings, footer_term: e.target.value })}
                placeholder="이용약관"
              />
            </div>
            <div>
              <Label>개인정보처리방침 텍스트</Label>
              <Input 
                value={settings.footer_privacy || ""}
                onChange={(e) => setSettings({ ...settings, footer_privacy: e.target.value })}
                placeholder="개인정보 수집 및 이용방침"
              />
            </div>
            <div>
              <Label>회사 주소</Label>
              <Input 
                value={settings.footer_address || ""}
                onChange={(e) => setSettings({ ...settings, footer_address: e.target.value })}
                placeholder="서울특별시 강남구 선릉로 648"
              />
            </div>
            <div>
              <Label>대표 전화번호</Label>
              <Input 
                value={settings.footer_phone || ""}
                onChange={(e) => setSettings({ ...settings, footer_phone: e.target.value })}
                placeholder="070-7825-0749"
              />
            </div>
            <div>
              <Label>대표 이메일</Label>
              <Input 
                type="email"
                value={settings.footer_email || ""}
                onChange={(e) => setSettings({ ...settings, footer_email: e.target.value })}
                placeholder="info@gogumafarm.kr"
              />
            </div>
            <div>
              <Label>저작권 표시</Label>
              <Input 
                value={settings.footer_copyright || ""}
                onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
                placeholder="©2025. The SMC all rights reserved."
              />
            </div>
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

      {/* URL 관리 - 네비게이션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            네비게이션 URL 관리
          </CardTitle>
          <CardDescription>메뉴와 버튼의 링크를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{settings.nav_link_1 || "최신 밈과 트렌드"} - URL</Label>
              <Input 
                value={settings.nav_link_1_url || "#"}
                onChange={(e) => setSettings({ ...settings, nav_link_1_url: e.target.value })}
                placeholder="URL 입력 (예: /articles, https://example.com)"
              />
            </div>
            <div>
              <Label>{settings.nav_link_2 || "핵심 전략과 레퍼런스"} - URL</Label>
              <Input 
                value={settings.nav_link_2_url || "#"}
                onChange={(e) => setSettings({ ...settings, nav_link_2_url: e.target.value })}
                placeholder="URL 입력"
              />
            </div>
            <div>
              <Label>{settings.nav_link_3 || "일잘러 스킬셋"} - URL</Label>
              <Input 
                value={settings.nav_link_3_url || "#"}
                onChange={(e) => setSettings({ ...settings, nav_link_3_url: e.target.value })}
                placeholder="URL 입력"
              />
            </div>
            <div>
              <Label>{settings.nav_link_4 || "슴씨피드"} - URL</Label>
              <Input 
                value={settings.nav_link_4_url || "#"}
                onChange={(e) => setSettings({ ...settings, nav_link_4_url: e.target.value })}
                placeholder="URL 입력"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URL 관리 - CTA 버튼 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            CTA 버튼 URL 관리
          </CardTitle>
          <CardDescription>헤더 CTA 버튼의 링크를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{settings.header_cta_1 || "문의하기"} - URL</Label>
            <Input 
              value={settings.header_cta_1_url || "#"}
              onChange={(e) => setSettings({ ...settings, header_cta_1_url: e.target.value })}
              placeholder="URL 입력 (예: /contact, mailto:email@example.com)"
            />
          </div>
          <div>
            <Label>{settings.header_cta_2 || "뉴스레터 구독하기"} - URL</Label>
            <Input 
              value={settings.header_cta_2_url || "#"}
              onChange={(e) => setSettings({ ...settings, header_cta_2_url: e.target.value })}
              placeholder="URL 입력 (예: /newsletter, https://forms.google.com/...)"
            />
          </div>
        </CardContent>
      </Card>

      {/* URL 관리 - 기타 링크 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            기타 페이지 URL 관리
          </CardTitle>
          <CardDescription>푸터 및 기타 페이지 링크를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>개인정보처리방침 URL</Label>
              <Input 
                value={settings.footer_privacy_url || "/privacy"}
                onChange={(e) => setSettings({ ...settings, footer_privacy_url: e.target.value })}
                placeholder="/privacy"
              />
            </div>
            <div>
              <Label>이용약관 URL</Label>
              <Input 
                value={settings.footer_terms_url || "/terms"}
                onChange={(e) => setSettings({ ...settings, footer_terms_url: e.target.value })}
                placeholder="/terms"
              />
            </div>
            <div>
              <Label>문의하기 URL</Label>
              <Input 
                value={settings.footer_contact_url || "/contact"}
                onChange={(e) => setSettings({ ...settings, footer_contact_url: e.target.value })}
                placeholder="/contact"
              />
            </div>
            <div>
              <Label>관리자 패널 URL</Label>
              <Input 
                value={settings.admin_panel_url || "/admin"}
                onChange={(e) => setSettings({ ...settings, admin_panel_url: e.target.value })}
                placeholder="/admin"
              />
            </div>
            <div>
              <Label>전체 아티클 페이지 URL</Label>
              <Input 
                value={settings.all_articles_url || "/articles"}
                onChange={(e) => setSettings({ ...settings, all_articles_url: e.target.value })}
                placeholder="/articles"
              />
            </div>
            <div>
              <Label>인스타그램 URL</Label>
              <Input 
                value={settings.instagram_url || "https://instagram.com"}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="https://instagram.com/youraccount"
              />
            </div>
            <div>
              <Label>카카오톡 채널 URL</Label>
              <Input 
                value={settings.kakao_url || ""}
                onChange={(e) => setSettings({ ...settings, kakao_url: e.target.value })}
                placeholder="https://pf.kakao.com/_xYxYxY"
              />
            </div>
            <div>
              <Label>네이버 스토어 URL</Label>
              <Input 
                value={settings.naver_store_url || ""}
                onChange={(e) => setSettings({ ...settings, naver_store_url: e.target.value })}
                placeholder="https://smartstore.naver.com/yourstorename"
              />
            </div>
            <div>
              <Label>사업자정보확인 URL</Label>
              <Input 
                value={settings.business_info_url || ""}
                onChange={(e) => setSettings({ ...settings, business_info_url: e.target.value })}
                placeholder="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=..."
              />
            </div>
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