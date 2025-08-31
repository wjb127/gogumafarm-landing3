# Supabase 필수 설정 (기존 프로젝트용)

이미 Supabase 프로젝트와 환경변수가 설정되어 있다면, **테이블 생성**만 하면 됩니다.

## 📌 필요한 작업

### 1. 데이터베이스 테이블 생성 (필수!)

Supabase Dashboard → SQL Editor에서 아래 SQL 실행:

```sql
-- ============================================
-- 테이블 생성 및 RLS 설정 (한번에 실행)
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

### 2. Storage 버킷 확인 (이미 있다면 건너뛰기)

`post-images` 버킷이 이미 있고 Public으로 설정되어 있다면 추가 작업 불필요!

만약 정책이 없다면 Storage → post-images → Policies에서 추가:
- **Public Read**: SELECT, anon/authenticated, `true`
- **Allow Upload**: INSERT, anon/authenticated, `true`
- **Allow Update**: UPDATE, anon/authenticated, `true`
- **Allow Delete**: DELETE, anon/authenticated, `true`

### 3. 초기 데이터 추가 (선택사항)

테스트를 위한 샘플 데이터:

```sql
-- Hero 콘텐츠 샘플 (3개)
INSERT INTO kmong_12_hero_contents (title, subtitle, image_url, badge_text, order_index, is_active)
VALUES 
('고구마팜에 오신 것을 환영합니다', '신선한 고구마를 만나보세요', '/youtube-content-1.png', '공공기관,유튜브,콘텐츠', 1, true),
('프리미엄 고구마 특가', '오늘만 특별 할인!', '/youtube-content-2.jpg', 'SNS,바이럴,CEO', 2, true),
('농장 직송 고구마', '산지에서 바로 배송합니다', '/youtube-content-3.jpg', 'SNS,릴스,콘텐츠', 3, true);

-- 아티클 샘플 (6개)
INSERT INTO kmong_12_articles (title, description, image_url, badge_text, badge_type, order_index, is_active)
VALUES 
('이게 뮤직비디오야 광고야?', '강렬한 비주얼로 시선을 사로잡은 7월 인기 광고 분석', '/고구마팜썸네일-0822-700x401.jpg', 'PPL,광고,유튜브', 'hot', 1, true),
('게이머들이 뽑은 올해 최고의 광고?!', '페이커X윙 만남을 성사시킨 삼성 OLED 캠페인!', '/고구마팜-말랭이썸네일_250821-700x400.jpg', '광고,유튜브,캠페인', 'popular', 2, true),
('구매로 전환되는 광고 기획의 비결?', '광고에 영업 당한 소비자에게 물어봤습니다', '/고구마팜썸네일-0820-700x401.png', 'SNS,광고,인터뷰', 'new', 3, true),
('5060 연프에 이어 이젠 초고령 유튜버까지?!', '시니어 마케팅 하기 전에 꼭 알아야 할 변화들', '/고구마팜-시니어는-이렇게-삽니다_대지-1-사본-700x400.png', '시니어마케팅,캠페인,트렌드', 'recommend', 4, true),
('AI가 되살려낸 80년 전 만세 소리!', '올해 광복절 캠페인이 보여준 새로운 시도', '/고구마팜-말랭이썸네일_250819-01-700x400.jpg', 'CSR,시즈널마케팅,캠페인', 'hot', 5, true),
('나영석&김태호가 연프 패널로?!', 'PD판 연프 사옥미팅으로 보는 콘텐츠 인사이트', '/고구마팜-말랭이썸네일_250814-700x400.png', '유튜브,콘텐츠', 'popular', 6, true);

-- 뉴스 클리핑 샘플 (4개)
INSERT INTO kmong_12_news_clippings (title, image_url, order_index, is_active)
VALUES 
('MBC 뉴스', '/0812.png', 1, true),
('KBS 특집', '/0813_new.png', 2, true),
('SBS 생생정보', '/0814.png', 3, true),
('JTBC 뉴스룸', '/0818.png', 4, true);

-- TOP 10 샘플 (10개)
INSERT INTO kmong_12_top10_items (title, rank, category, is_active)
VALUES 
('저희는 합의 끝에 이 챌린지로 골랐습니다. 알고리즘 탑승 직행하는 인기 릴스 모음!', 1, '트렌드', true),
('이건 첫 번째 레슨~ 요즘 유행하는 밈은 알고 가기! [2025년 7월 최신 밈 모음]', 2, '밈', true),
('추성훈, 권또또, 카니··· 지금 유튜브에서 협업하기 좋은 셀럽 채널 14선!', 3, '유튜브', true),
('29CM는 브랜딩, 올리브영은 콜라보? 각자 다른 마케팅으로 승부하는 플랫폼 시장!', 4, '마케팅', true),
('바야흐로 생성형 AI 콘텐츠의 전성시대! 지금 주목받는 AI 활용 트렌드 살펴보기', 5, 'AI', true),
('나영석&김태호가 연프 패널로?! PD판 사옥미팅으로 보는 콘텐츠 인사이트', 6, '콘텐츠', true),
('웬즈데이가 역대급 콜라보와 함께 돌아왔다! 웬디스, 치토스 사례로 보는 IP 활용 전략', 7, 'IP', true),
('2025 상반기 마케팅 트렌드·이슈 총결산! 실무자가 주목해야 할 변화는?', 8, '트렌드', true),
('인기 밈 알면 하룰라라 날아서 궁전으로 갈 수도 있어~ [2025년 6월 최신 밈 모음]', 9, '밈', true),
('여름 가고 부국제, 최강야구 온다! 9월 시즈널 이슈 담은 마케팅 캘린더 보기', 10, '캘린더', true);

-- 사이트 설정
INSERT INTO kmong_12_site_settings (setting_key, setting_value)
VALUES 
('site_title', '고구마팜 by. The SMC'),
('nav_link_1', '최신 밈과 트렌드'),
('nav_link_2', '핵심 전략과 레퍼런스'),
('nav_link_3', '일잘러 스킬셋'),
('nav_link_4', '슴씨피드'),
('header_cta_1', '문의하기'),
('header_cta_2', '뉴스레터 구독하기'),
('top10_title', '인기 아티클 TOP 10'),
('top10_subtitle', '시간이 없다면? 이것부터 읽어봐도 좋아요'),
('articles_title', '최신 아티클'),
('articles_subtitle', '방금 올라온 인사이트 확인하고 한 걸음 앞서가세요'),
('news_title', '뉴스클리핑'),
('news_subtitle', '방금 업데이트된 뉴미디어 소식,\n여기 다 있어요');
```

## ✅ 완료!

위 SQL만 실행하면 바로 사용 가능합니다.
- 관리자 패널: `/admin`
- 비밀번호: `gogumafarm_2025!`