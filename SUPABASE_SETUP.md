# Supabase 초기 설정 가이드

## 목차
1. [Supabase 프로젝트 생성](#supabase-프로젝트-생성)
2. [데이터베이스 테이블 생성](#데이터베이스-테이블-생성)
3. [Storage 버킷 설정](#storage-버킷-설정)
4. [RLS (Row Level Security) 정책 설정](#rls-row-level-security-정책-설정)
5. [환경 변수 설정](#환경-변수-설정)
6. [초기 데이터 삽입](#초기-데이터-삽입)

---

## Supabase 프로젝트 생성

### 1. Supabase 계정 생성
1. [Supabase](https://supabase.com) 접속
2. GitHub 계정으로 회원가입/로그인
3. "New project" 클릭

### 2. 프로젝트 설정
- **Project name**: gogumafarm
- **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
- **Region**: Northeast Asia (Seoul) 선택
- **Pricing Plan**: Free tier로 시작 가능

---

## 데이터베이스 테이블 생성

### SQL Editor에서 실행할 쿼리

```sql
-- 1. Hero 콘텐츠 테이블
CREATE TABLE kmong_12_hero_contents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    badge_text VARCHAR(50),
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 아티클 테이블
CREATE TABLE kmong_12_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    badge_text VARCHAR(50),
    badge_type VARCHAR(50),
    link_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 뉴스 클리핑 테이블
CREATE TABLE kmong_12_news_clippings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    link_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TOP 10 아이템 테이블
CREATE TABLE kmong_12_top10_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 10),
    category VARCHAR(100),
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 사이트 설정 테이블
CREATE TABLE kmong_12_site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 활동 로그 테이블 (선택사항)
CREATE TABLE kmong_12_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_hero_order ON kmong_12_hero_contents(order_index);
CREATE INDEX idx_hero_active ON kmong_12_hero_contents(is_active);
CREATE INDEX idx_articles_order ON kmong_12_articles(order_index);
CREATE INDEX idx_articles_active ON kmong_12_articles(is_active);
CREATE INDEX idx_news_order ON kmong_12_news_clippings(order_index);
CREATE INDEX idx_news_active ON kmong_12_news_clippings(is_active);
CREATE INDEX idx_top10_rank ON kmong_12_top10_items(rank);
CREATE INDEX idx_top10_active ON kmong_12_top10_items(is_active);
CREATE INDEX idx_settings_key ON kmong_12_site_settings(setting_key);

-- 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_updated_at BEFORE UPDATE ON kmong_12_hero_contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON kmong_12_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON kmong_12_news_clippings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_top10_updated_at BEFORE UPDATE ON kmong_12_top10_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON kmong_12_site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Storage 버킷 설정

### 1. Storage 버킷 생성
Supabase 대시보드에서 Storage 섹션으로 이동:

```sql
-- Storage 버킷 생성 (SQL Editor에서 실행)
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('images', 'images', true),
    ('documents', 'documents', false);
```

### 2. Storage 정책 설정

```sql
-- 이미지 버킷 정책 (공개 읽기)
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images" ON storage.objects
    FOR DELETE USING (bucket_id = 'images');
```

---

## RLS (Row Level Security) 정책 설정

### 각 테이블별 RLS 정책

```sql
-- RLS 활성화
ALTER TABLE kmong_12_hero_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_news_clippings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_top10_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_activity_logs ENABLE ROW LEVEL SECURITY;

-- Hero 콘텐츠 정책
CREATE POLICY "Public can view active hero contents" ON kmong_12_hero_contents
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anon can manage hero contents" ON kmong_12_hero_contents
    FOR ALL USING (true);

-- 아티클 정책
CREATE POLICY "Public can view active articles" ON kmong_12_articles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anon can manage articles" ON kmong_12_articles
    FOR ALL USING (true);

-- 뉴스 클리핑 정책
CREATE POLICY "Public can view active news" ON kmong_12_news_clippings
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anon can manage news" ON kmong_12_news_clippings
    FOR ALL USING (true);

-- TOP 10 정책
CREATE POLICY "Public can view active top10" ON kmong_12_top10_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anon can manage top10" ON kmong_12_top10_items
    FOR ALL USING (true);

-- 사이트 설정 정책
CREATE POLICY "Public can view settings" ON kmong_12_site_settings
    FOR SELECT USING (true);

CREATE POLICY "Anon can manage settings" ON kmong_12_site_settings
    FOR ALL USING (true);

-- 활동 로그 정책
CREATE POLICY "Anon can insert logs" ON kmong_12_activity_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon can view logs" ON kmong_12_activity_logs
    FOR SELECT USING (true);
```

---

## 환경 변수 설정

### `.env.local` 파일 생성

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 관리자 비밀번호
ADMIN_PASSWORD=gogumafarm_2025!
```

### Supabase 키 찾기
1. Supabase 대시보드 → Settings → API
2. **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 복사
3. **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사
4. **service_role**: `SUPABASE_SERVICE_ROLE_KEY`에 복사 (비공개 유지!)

---

## 초기 데이터 삽입

### 샘플 데이터 삽입 쿼리

```sql
-- Hero 콘텐츠 샘플
INSERT INTO kmong_12_hero_contents (title, subtitle, image_url, badge_text, order_index, is_active)
VALUES 
    ('고구마팜에 오신 것을 환영합니다', '신선한 고구마를 만나보세요', '/images/hero-1.jpg', '인기', 1, true),
    ('프리미엄 고구마 특가', '오늘만 특별 할인!', '/images/hero-2.jpg', '핫딜', 2, true),
    ('농장 직송 고구마', '산지에서 바로 배송합니다', '/images/hero-3.jpg', '신선', 3, true);

-- 아티클 샘플
INSERT INTO kmong_12_articles (title, description, image_url, badge_text, badge_type, order_index, is_active)
VALUES 
    ('고구마의 놀라운 효능 10가지', '건강에 좋은 고구마의 비밀을 알아보세요', '/images/article-1.jpg', '핫이슈', 'hot', 1, true),
    ('고구마 보관법 완벽 가이드', '신선하게 오래 보관하는 방법', '/images/article-2.jpg', '인기', 'popular', 2, true),
    ('고구마 요리 레시피 모음', '다양한 고구마 요리를 만들어보세요', '/images/article-3.jpg', '새글', 'new', 3, true);

-- 뉴스 클리핑 샘플
INSERT INTO kmong_12_news_clippings (title, image_url, order_index, is_active)
VALUES 
    ('MBC 뉴스 보도', '/images/news-1.jpg', 1, true),
    ('KBS 특집 방송', '/images/news-2.jpg', 2, true),
    ('SBS 생생정보', '/images/news-3.jpg', 3, true);

-- TOP 10 샘플
INSERT INTO kmong_12_top10_items (title, rank, category, is_active)
VALUES 
    ('꿀고구마 vs 밤고구마, 당신의 선택은?', 1, '리뷰', true),
    ('고구마 다이어트 성공 후기', 2, '리뷰', true),
    ('고구마 농사 시작하기', 3, '가이드', true),
    ('고구마 품종별 특징 총정리', 4, '가이드', true),
    ('고구마 시장 가격 동향', 5, '뉴스', true);

-- 사이트 설정 샘플
INSERT INTO kmong_12_site_settings (setting_key, setting_value, setting_type)
VALUES 
    ('site_title', '고구마팜 - 신선한 고구마 직거래', 'text'),
    ('site_description', '농장에서 직접 재배한 신선한 고구마를 만나보세요', 'text'),
    ('contact_email', 'info@gogumafarm.com', 'text'),
    ('contact_phone', '010-1234-5678', 'text');
```

---

## 이미지 업로드 (선택사항)

### Supabase Storage를 통한 이미지 업로드

```javascript
// 이미지 업로드 예제 코드
import { supabase } from '@/lib/supabase'

async function uploadImage(file) {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  // 공개 URL 가져오기
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  return publicUrl
}
```

---

## 문제 해결

### 자주 발생하는 문제

1. **CORS 에러**
   - Supabase 대시보드 → Authentication → URL Configuration
   - Site URL에 도메인 추가 (http://localhost:3000 포함)

2. **RLS 정책 오류**
   - 테이블에 RLS가 활성화되어 있는지 확인
   - 정책이 올바르게 설정되어 있는지 확인

3. **이미지 업로드 실패**
   - Storage 버킷이 public으로 설정되어 있는지 확인
   - 파일 크기 제한 확인 (Free tier: 50MB)

4. **데이터베이스 연결 실패**
   - 환경 변수가 올바르게 설정되어 있는지 확인
   - Supabase 프로젝트가 일시 정지되지 않았는지 확인

---

## 백업 및 복구

### 데이터 백업
```sql
-- 전체 테이블 백업 (CSV 내보내기)
-- Supabase 대시보드 → Table Editor → Export 버튼 사용
```

### 데이터 복구
```sql
-- CSV 파일 가져오기
-- Supabase 대시보드 → Table Editor → Import 버튼 사용
```

---

## 성능 최적화 팁

1. **인덱스 활용**
   - 자주 조회되는 컬럼에 인덱스 생성
   - order_index, is_active 컬럼 인덱싱

2. **쿼리 최적화**
   - 필요한 컬럼만 SELECT
   - LIMIT 사용으로 데이터 제한

3. **캐싱 전략**
   - Next.js의 ISR (Incremental Static Regeneration) 활용
   - 정적 콘텐츠는 CDN 캐싱

---

*마지막 업데이트: 2025년 1월*