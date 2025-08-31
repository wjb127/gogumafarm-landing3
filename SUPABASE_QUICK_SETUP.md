# Supabase 빠른 설정 가이드

이 문서는 Supabase에서 직접 설정해야 하는 모든 작업을 단계별로 안내합니다.

## 📋 목차
1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [데이터베이스 테이블 생성](#2-데이터베이스-테이블-생성)
3. [Storage 버킷 생성](#3-storage-버킷-생성)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [초기 데이터 삽입](#5-초기-데이터-삽입)

---

## 1. Supabase 프로젝트 생성

1. [https://supabase.com](https://supabase.com) 접속
2. "Start your project" 또는 "Dashboard" 클릭
3. "New project" 클릭
4. 다음 정보 입력:
   - **Organization**: 선택 또는 생성
   - **Project name**: `gogumafarm` (원하는 이름)
   - **Database Password**: 강력한 비밀번호 (꼭 저장!)
   - **Region**: `Northeast Asia (Seoul)` 선택
   - **Pricing Plan**: Free

---

## 2. 데이터베이스 테이블 생성

### 방법 1: SQL Editor 사용 (권장)

1. Supabase Dashboard → SQL Editor 클릭
2. "New query" 클릭
3. 아래 전체 SQL을 복사하여 붙여넣기
4. "Run" 버튼 클릭

```sql
-- ============================================
-- 1단계: 테이블 생성
-- ============================================

-- Hero 콘텐츠 테이블
CREATE TABLE IF NOT EXISTS kmong_12_hero_contents (
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

-- 아티클 테이블
CREATE TABLE IF NOT EXISTS kmong_12_articles (
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

-- 뉴스 클리핑 테이블
CREATE TABLE IF NOT EXISTS kmong_12_news_clippings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    link_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOP 10 아이템 테이블
CREATE TABLE IF NOT EXISTS kmong_12_top10_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 10),
    category VARCHAR(100),
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사이트 설정 테이블
CREATE TABLE IF NOT EXISTS kmong_12_site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2단계: RLS (Row Level Security) 설정
-- ============================================

-- RLS 활성화
ALTER TABLE kmong_12_hero_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_news_clippings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_top10_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_site_settings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능, anon 사용자가 모든 작업 가능
CREATE POLICY "Public read access" ON kmong_12_hero_contents FOR SELECT USING (true);
CREATE POLICY "Anon full access" ON kmong_12_hero_contents FOR ALL USING (true);

CREATE POLICY "Public read access" ON kmong_12_articles FOR SELECT USING (true);
CREATE POLICY "Anon full access" ON kmong_12_articles FOR ALL USING (true);

CREATE POLICY "Public read access" ON kmong_12_news_clippings FOR SELECT USING (true);
CREATE POLICY "Anon full access" ON kmong_12_news_clippings FOR ALL USING (true);

CREATE POLICY "Public read access" ON kmong_12_top10_items FOR SELECT USING (true);
CREATE POLICY "Anon full access" ON kmong_12_top10_items FOR ALL USING (true);

CREATE POLICY "Public read access" ON kmong_12_site_settings FOR SELECT USING (true);
CREATE POLICY "Anon full access" ON kmong_12_site_settings FOR ALL USING (true);
```

---

## 3. Storage 버킷 설정

### 이미 존재하는 버킷 사용 (권장)

만약 `post-images` 버킷이 이미 존재한다면 그대로 사용하면 됩니다.

### 새 버킷 생성하는 경우

1. Supabase Dashboard → Storage 클릭
2. "New bucket" 클릭
3. 다음 정보 입력:
   - **Name**: `post-images`
   - **Public bucket**: ✅ 체크 (공개 액세스 허용)
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*` (모든 이미지 형식)
4. "Create bucket" 클릭

### Storage 정책 설정 (중요!)

1. `post-images` 버킷 클릭
2. "Policies" 탭 클릭
3. "New policy" 클릭
4. "For full customization" 선택
5. 다음 정책들을 각각 추가:

#### 정책 1: 공개 읽기
- **Policy name**: `Public Read`
- **Policy definition**: `SELECT`
- **Target roles**: `anon, authenticated`
- **Policy expression**: `true`

#### 정책 2: 업로드 허용
- **Policy name**: `Allow Upload`
- **Policy definition**: `INSERT`
- **Target roles**: `anon, authenticated`
- **Policy expression**: `true`

#### 정책 3: 수정 허용
- **Policy name**: `Allow Update`
- **Policy definition**: `UPDATE`
- **Target roles**: `anon, authenticated`
- **Policy expression**: `true`

#### 정책 4: 삭제 허용
- **Policy name**: `Allow Delete`
- **Policy definition**: `DELETE`
- **Target roles**: `anon, authenticated`
- **Policy expression**: `true`

---

## 4. 환경 변수 설정

### Supabase 키 확인

1. Supabase Dashboard → Settings (⚙️) → API
2. 다음 값들을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (매우 긴 문자열)
   - **service_role key**: `eyJhbGc...` (매우 긴 문자열, 비공개!)

### 프로젝트 `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 입력:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_public_key_붙여넣기
SUPABASE_SERVICE_ROLE_KEY=여기에_service_role_key_붙여넣기

# 관리자 비밀번호
ADMIN_PASSWORD=gogumafarm_2025!
```

⚠️ **주의**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

---

## 5. 초기 데이터 삽입

### 샘플 데이터 추가 (선택사항)

SQL Editor에서 다음 쿼리 실행:

```sql
-- Hero 콘텐츠 샘플 (3개)
INSERT INTO kmong_12_hero_contents (title, subtitle, image_url, badge_text, order_index, is_active)
VALUES 
('고구마팜에 오신 것을 환영합니다', '신선한 고구마를 만나보세요', 'https://images.unsplash.com/photo-1596097635121-14b63a8f91f3', '인기', 1, true),
('프리미엄 고구마 특가', '오늘만 특별 할인!', 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f', '핫딜', 2, true),
('농장 직송 고구마', '산지에서 바로 배송합니다', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5', '신선', 3, true);

-- 아티클 샘플 (6개)
INSERT INTO kmong_12_articles (title, description, image_url, badge_text, badge_type, order_index, is_active)
VALUES 
('고구마의 놀라운 효능 10가지', '건강에 좋은 고구마의 비밀을 알아보세요', 'https://images.unsplash.com/photo-1596097635121-14b63a8f91f3', '핫이슈', 'hot', 1, true),
('고구마 보관법 완벽 가이드', '신선하게 오래 보관하는 방법', 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f', '인기', 'popular', 2, true),
('고구마 요리 레시피 모음', '다양한 고구마 요리를 만들어보세요', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5', '새글', 'new', 3, true),
('고구마 다이어트 성공기', '고구마로 10kg 감량한 비법', 'https://images.unsplash.com/photo-1596097635121-14b63a8f91f3', '추천', 'recommend', 4, true),
('고구마 농사 시작하기', '초보자를 위한 재배 가이드', 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f', '가이드', 'guide', 5, true),
('고구마 시장 동향 분석', '2025년 고구마 가격 전망', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5', '뉴스', 'news', 6, true);

-- 뉴스 클리핑 샘플 (4개)
INSERT INTO kmong_12_news_clippings (title, image_url, order_index, is_active)
VALUES 
('MBC 뉴스 보도', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c', 1, true),
('KBS 특집 방송', 'https://images.unsplash.com/photo-1495020689067-958852a7765e', 2, true),
('SBS 생생정보', 'https://images.unsplash.com/photo-1476242906366-d8eb64c2f661', 3, true),
('JTBC 뉴스룸', 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3', 4, true);

-- TOP 10 샘플 (10개)
INSERT INTO kmong_12_top10_items (title, rank, category, is_active)
VALUES 
('꿀고구마 vs 밤고구마, 당신의 선택은?', 1, '리뷰', true),
('고구마 다이어트 성공 후기', 2, '리뷰', true),
('고구마 농사 시작하기', 3, '가이드', true),
('고구마 품종별 특징 총정리', 4, '가이드', true),
('고구마 시장 가격 동향', 5, '뉴스', true),
('고구마 보관법 꿀팁', 6, '가이드', true),
('고구마 요리 레시피 TOP 5', 7, '요리', true),
('고구마 효능과 부작용', 8, '건강', true),
('고구마 재배 성공 비법', 9, '가이드', true),
('고구마 맛집 전국 투어', 10, '리뷰', true);

-- 사이트 설정 샘플
INSERT INTO kmong_12_site_settings (setting_key, setting_value, setting_type)
VALUES 
('site_title', '고구마팜 - 신선한 고구마 직거래', 'text'),
('site_description', '농장에서 직접 재배한 신선한 고구마를 만나보세요', 'text'),
('logo_url', '/logo-1.svg', 'text'),
('nav_link_1', '최신 밈과 트렌드', 'text'),
('nav_link_2', '핵심 전략과 레퍼런스', 'text'),
('nav_link_3', '일잘러 스킬셋', 'text'),
('nav_link_4', '슴씨피드', 'text'),
('header_cta_1', '문의하기', 'text'),
('header_cta_2', '뉴스레터 구독하기', 'text'),
('top10_title', '인기 아티클 TOP 10', 'text'),
('top10_subtitle', '시간이 없다면? 이것부터 읽어봐도 좋아요', 'text'),
('articles_title', '최신 아티클', 'text'),
('articles_subtitle', '방금 올라온 인사이트 확인하고 한 걸음 앞서가세요', 'text'),
('news_title', '뉴스클리핑', 'text'),
('news_subtitle', '방금 업데이트된 뉴미디어 소식, 여기 다 있어요', 'text'),
('footer_term', '이용약관', 'text'),
('footer_privacy', '개인정보 수집 및 이용방침', 'text'),
('footer_address', '서울특별시 강남구 선릉로 648', 'text'),
('footer_phone', '070-7825-0749', 'text'),
('footer_email', 'info@gogumafarm.kr', 'text'),
('footer_copyright', '©2025. The SMC all rights reserved.', 'text');
```

---

## ✅ 설정 완료 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 비밀번호 저장함
- [ ] SQL로 테이블 생성 완료
- [ ] Storage 버킷 생성 완료
- [ ] Storage 정책 설정 완료
- [ ] `.env.local` 파일 생성 및 키 입력 완료
- [ ] 샘플 데이터 삽입 완료 (선택)

---

## 🚀 다음 단계

1. 로컬에서 개발 서버 실행:
```bash
npm run dev
```

2. 브라우저에서 확인:
- 메인 페이지: http://localhost:3000
- 관리자 패널: http://localhost:3000/admin
- 비밀번호: `gogumafarm_2025!`

3. 관리자 패널에서 콘텐츠 수정 테스트

---

## ❓ 문제 해결

### 이미지 업로드가 안 되는 경우
1. Storage 버킷이 Public으로 설정되어 있는지 확인
2. Storage 정책이 모두 추가되어 있는지 확인
3. `.env.local`의 키가 올바른지 확인

### 데이터가 표시되지 않는 경우
1. RLS 정책이 올바르게 설정되어 있는지 확인
2. 테이블에 데이터가 있는지 확인
3. `is_active`가 `true`인지 확인

### 관리자 패널에서 수정이 안 되는 경우
1. anon key가 올바른지 확인
2. RLS 정책에서 anon 사용자 권한 확인
3. 브라우저 개발자 도구에서 에러 메시지 확인

---

*마지막 업데이트: 2025년 1월*