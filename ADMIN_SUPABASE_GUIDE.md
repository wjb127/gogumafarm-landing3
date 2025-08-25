# 고구마팜 Admin Panel 구현 가이드 (Supabase Version)
> Supabase + 간단한 비밀번호 인증 시스템

## 🎯 목표
- **URL**: `/admin`
- **비밀번호**: `gogumafarm_2025!`
- **Database**: Supabase (URL & API Key 제공 예정)
- **특징**: Prisma/NextAuth 없이 순수 Supabase 클라이언트 사용

---

## 📋 구현 작업 목록 (우선순위 순)

### Phase 1: Supabase 설정 & 테이블 구조

#### 1.1 Supabase 클라이언트 설정
```bash
# 필요한 패키지만 설치
npm install @supabase/supabase-js
npm install js-cookie  # 세션 관리용
```

**환경변수 설정 (.env.local)**:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_api_key_here
```

**Supabase 클라이언트 (lib/supabase.ts)**:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

#### 1.2 데이터베이스 테이블 구조

**Supabase SQL Editor에서 실행할 테이블 생성 쿼리**:

```sql
-- 1. Hero Content (메인 캐러셀)
CREATE TABLE hero_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image TEXT NOT NULL,
    title TEXT NOT NULL,
    badges JSONB DEFAULT '[]',  -- [{text: "SNS", className: "badge-purple"}]
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Articles (아티클)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    badges JSONB DEFAULT '[]',
    published_date DATE DEFAULT CURRENT_DATE,
    is_featured BOOLEAN DEFAULT false,
    category VARCHAR(100),
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. News Clipping
CREATE TABLE news_clippings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image TEXT NOT NULL,
    title TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TOP 10 Items
CREATE TABLE top10_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Site Settings (사이트 설정)
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin Sessions (간단한 세션 관리)
CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Activity Logs (관리자 활동 로그)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    changes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updated_at 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 트리거 적용
CREATE TRIGGER update_hero_contents_updated_at BEFORE UPDATE ON hero_contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_clippings_updated_at BEFORE UPDATE ON news_clippings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_top10_items_updated_at BEFORE UPDATE ON top10_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책
ALTER TABLE hero_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_clippings ENABLE ROW LEVEL SECURITY;
ALTER TABLE top10_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON hero_contents FOR SELECT USING (true);
CREATE POLICY "Public read access" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news_clippings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON top10_items FOR SELECT USING (true);
```

---

### Phase 2: 간단한 비밀번호 인증 시스템

#### 2.1 인증 로직 (lib/auth.ts)
```typescript
import { supabase } from './supabase'
import Cookies from 'js-cookie'
import crypto from 'crypto'

const ADMIN_PASSWORD = 'gogumafarm_2025!'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24시간

export const auth = {
  // 로그인
  async login(password: string): Promise<boolean> {
    if (password !== ADMIN_PASSWORD) return false
    
    // 세션 토큰 생성
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + SESSION_DURATION)
    
    // Supabase에 세션 저장
    const { error } = await supabase
      .from('admin_sessions')
      .insert({
        token,
        expires_at: expiresAt.toISOString()
      })
    
    if (error) return false
    
    // 쿠키에 토큰 저장
    Cookies.set('admin_token', token, { expires: 1 })
    return true
  },
  
  // 세션 확인
  async checkSession(): Promise<boolean> {
    const token = Cookies.get('admin_token')
    if (!token) return false
    
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    return !error && !!data
  },
  
  // 로그아웃
  async logout() {
    const token = Cookies.get('admin_token')
    if (token) {
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('token', token)
    }
    Cookies.remove('admin_token')
  },
  
  // 오래된 세션 정리 (cron job용)
  async cleanupSessions() {
    await supabase
      .from('admin_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())
  }
}
```

---

#### 2.2 API Routes

**app/api/admin/auth/login/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const { password } = await request.json()
  
  const success = await auth.login(password)
  
  if (success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
}
```

**app/api/admin/auth/logout/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST() {
  await auth.logout()
  return NextResponse.json({ success: true })
}
```

**app/api/admin/auth/check/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  const isValid = await auth.checkSession()
  return NextResponse.json({ authenticated: isValid })
}
```

---

### Phase 3: Admin 페이지 구조

#### 3.1 미들웨어 (middleware.ts)
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // /admin 경로 보호
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')
    
    // 로그인 페이지는 제외
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
```

---

### Phase 4: CRUD Operations (Supabase 직접 사용)

#### 4.1 Hero Content 관리 예시

**lib/supabase-queries.ts**:
```typescript
import { supabase } from './supabase'

export const heroContent = {
  // 전체 조회
  async getAll() {
    const { data, error } = await supabase
      .from('hero_contents')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
    
    return { data, error }
  },
  
  // 생성
  async create(content: any) {
    const { data, error } = await supabase
      .from('hero_contents')
      .insert(content)
      .select()
      .single()
    
    return { data, error }
  },
  
  // 수정
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('hero_contents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },
  
  // 삭제
  async delete(id: string) {
    const { error } = await supabase
      .from('hero_contents')
      .delete()
      .eq('id', id)
    
    return { error }
  },
  
  // 순서 변경
  async reorder(items: { id: string, order_index: number }[]) {
    const promises = items.map(item => 
      supabase
        .from('hero_contents')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    )
    
    const results = await Promise.all(promises)
    return results
  }
}

// Articles, News, Top10도 동일한 패턴으로 구현
export const articles = { /* ... */ }
export const newsClippings = { /* ... */ }
export const top10Items = { /* ... */ }
```

---

### Phase 5: 이미지 업로드 (Supabase Storage)

#### 5.1 Storage 버킷 생성 (Supabase Dashboard에서)
```sql
-- Storage 버킷 생성 (Dashboard에서 수동으로)
-- 1. hero-images
-- 2. article-images  
-- 3. news-images
```

#### 5.2 이미지 업로드 함수
```typescript
// lib/storage.ts
import { supabase } from './supabase'

export const storage = {
  async uploadImage(file: File, bucket: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('Upload error:', error)
      return null
    }
    
    // Public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return publicUrl
  },
  
  async deleteImage(url: string, bucket: string) {
    const fileName = url.split('/').pop()
    if (!fileName) return
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])
    
    return { error }
  }
}
```

---

### Phase 6: Admin UI 컴포넌트

#### 6.1 필요한 UI 패키지
```bash
# UI 컴포넌트
npm install react-hot-toast  # 알림
npm install @tanstack/react-table  # 테이블
npm install react-hook-form  # 폼
npm install @dnd-kit/sortable  # 드래그앤드롭
npm install recharts  # 차트 (대시보드용)
npm install react-dropzone  # 파일 업로드
```

#### 6.2 Admin 레이아웃 구조
```
/app/admin/
  ├── login/
  │   └── page.tsx          # 로그인 페이지
  ├── dashboard/
  │   └── page.tsx          # 대시보드
  ├── hero/
  │   ├── page.tsx          # Hero 콘텐츠 목록
  │   └── [id]/
  │       └── page.tsx      # Hero 편집
  ├── articles/
  │   ├── page.tsx          # 아티클 목록
  │   ├── new/
  │   │   └── page.tsx      # 새 아티클
  │   └── [id]/
  │       └── page.tsx      # 아티클 편집
  ├── news/
  │   └── page.tsx          # 뉴스클리핑 관리
  ├── top10/
  │   └── page.tsx          # TOP 10 관리
  └── settings/
      └── page.tsx          # 사이트 설정
```

---

### Phase 7: 실시간 기능 (Supabase Realtime)

#### 7.1 실시간 업데이트 구독
```typescript
// 실시간 변경사항 감지
useEffect(() => {
  const channel = supabase
    .channel('admin-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'hero_contents' },
      (payload) => {
        console.log('Change received!', payload)
        // 데이터 새로고침
        fetchData()
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

---

## 🚀 구현 순서 (추천)

### Step 1: 기초 설정 (Day 1)
1. Supabase 클라이언트 설정
2. 테이블 생성 SQL 실행
3. 환경변수 설정

### Step 2: 인증 시스템 (Day 2)
1. 로그인 페이지 UI
2. 인증 API routes
3. 미들웨어 설정

### Step 3: Admin 레이아웃 (Day 3)
1. 사이드바 네비게이션
2. 기본 페이지 구조
3. 라우팅 설정

### Step 4: CRUD 기능 (Day 4-6)
1. Hero 콘텐츠 관리
2. Articles 관리
3. News & TOP10 관리

### Step 5: 이미지 업로드 (Day 7)
1. Storage 버킷 설정
2. 드래그앤드롭 UI
3. 이미지 최적화

### Step 6: 고급 기능 (Day 8-10)
1. 대시보드 통계
2. 실시간 프리뷰
3. 활동 로그

---

## 📦 최소 패키지 리스트

```json
{
  "dependencies": {
    // Core
    "@supabase/supabase-js": "^2.x",
    "js-cookie": "^3.x",
    
    // UI Essentials
    "react-hot-toast": "^2.x",
    "@tanstack/react-table": "^8.x",
    "react-hook-form": "^7.x",
    "react-dropzone": "^14.x",
    
    // Optional (고급 기능)
    "@dnd-kit/sortable": "^7.x",
    "recharts": "^2.x"
  }
}
```

---

## 💡 다음 단계

URL과 API Key를 제공해 주시면:
1. Supabase 클라이언트 설정
2. 테이블 생성 쿼리 실행
3. 간단한 로그인 페이지부터 구현

어느 부분부터 시작하실까요?