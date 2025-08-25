-- ============================================
-- 고구마팜 Admin Panel 데이터베이스 구축 쿼리
-- Supabase SQL Editor에서 이 쿼리를 실행하세요
-- ============================================

-- 1. Hero Content (메인 캐러셀) 테이블
CREATE TABLE IF NOT EXISTS kmong_12_hero_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image TEXT NOT NULL,
    title TEXT NOT NULL,
    badges JSONB DEFAULT '[]',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Articles (아티클) 테이블
CREATE TABLE IF NOT EXISTS kmong_12_articles (
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

-- 3. News Clipping 테이블
CREATE TABLE IF NOT EXISTS kmong_12_news_clippings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image TEXT NOT NULL,
    title TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TOP 10 Items 테이블
CREATE TABLE IF NOT EXISTS kmong_12_top10_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Site Settings 테이블
CREATE TABLE IF NOT EXISTS kmong_12_site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin Sessions 테이블
CREATE TABLE IF NOT EXISTS kmong_12_admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Activity Logs 테이블
CREATE TABLE IF NOT EXISTS kmong_12_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    changes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Updated_at 트리거 함수
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_kmong_12_hero_contents_updated_at ON kmong_12_hero_contents;
CREATE TRIGGER update_kmong_12_hero_contents_updated_at 
    BEFORE UPDATE ON kmong_12_hero_contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kmong_12_articles_updated_at ON kmong_12_articles;
CREATE TRIGGER update_kmong_12_articles_updated_at 
    BEFORE UPDATE ON kmong_12_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kmong_12_news_clippings_updated_at ON kmong_12_news_clippings;
CREATE TRIGGER update_kmong_12_news_clippings_updated_at 
    BEFORE UPDATE ON kmong_12_news_clippings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kmong_12_top10_items_updated_at ON kmong_12_top10_items;
CREATE TRIGGER update_kmong_12_top10_items_updated_at 
    BEFORE UPDATE ON kmong_12_top10_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kmong_12_site_settings_updated_at ON kmong_12_site_settings;
CREATE TRIGGER update_kmong_12_site_settings_updated_at 
    BEFORE UPDATE ON kmong_12_site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security) 설정
-- ============================================
ALTER TABLE kmong_12_hero_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_news_clippings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_top10_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_activity_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables
CREATE POLICY "Public read access hero" ON kmong_12_hero_contents 
    FOR SELECT USING (true);

CREATE POLICY "Public read access articles" ON kmong_12_articles 
    FOR SELECT USING (true);

CREATE POLICY "Public read access news" ON kmong_12_news_clippings 
    FOR SELECT USING (true);

CREATE POLICY "Public read access top10" ON kmong_12_top10_items 
    FOR SELECT USING (true);

CREATE POLICY "Public read access settings" ON kmong_12_site_settings 
    FOR SELECT USING (true);

-- Admin sessions policies
CREATE POLICY "Admin sessions insert" ON kmong_12_admin_sessions 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin sessions select" ON kmong_12_admin_sessions 
    FOR SELECT USING (true);

CREATE POLICY "Admin sessions delete" ON kmong_12_admin_sessions 
    FOR DELETE USING (true);

-- Activity logs policies
CREATE POLICY "Activity logs insert" ON kmong_12_activity_logs 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Activity logs select" ON kmong_12_activity_logs 
    FOR SELECT USING (true);

-- Admin write access for content tables
CREATE POLICY "Admin insert hero" ON kmong_12_hero_contents 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update hero" ON kmong_12_hero_contents 
    FOR UPDATE USING (true);

CREATE POLICY "Admin delete hero" ON kmong_12_hero_contents 
    FOR DELETE USING (true);

CREATE POLICY "Admin insert articles" ON kmong_12_articles 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update articles" ON kmong_12_articles 
    FOR UPDATE USING (true);

CREATE POLICY "Admin delete articles" ON kmong_12_articles 
    FOR DELETE USING (true);

CREATE POLICY "Admin insert news" ON kmong_12_news_clippings 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update news" ON kmong_12_news_clippings 
    FOR UPDATE USING (true);

CREATE POLICY "Admin delete news" ON kmong_12_news_clippings 
    FOR DELETE USING (true);

CREATE POLICY "Admin insert top10" ON kmong_12_top10_items 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update top10" ON kmong_12_top10_items 
    FOR UPDATE USING (true);

CREATE POLICY "Admin delete top10" ON kmong_12_top10_items 
    FOR DELETE USING (true);

-- ============================================
-- 초기 데이터 삽입
-- ============================================

-- Hero Contents 초기 데이터
INSERT INTO kmong_12_hero_contents (image, title, badges, order_index, is_active) VALUES
(
    '/youtube-content-1.png',
    '유튜브 필승법 = 귀여운 동물? 공공기관도, AI 크리에이터도 써먹는 콘텐츠 치트키!',
    '[{"text": "공공기관", "className": "badge-purple"}, {"text": "유튜브", "className": "badge-purple"}, {"text": "콘텐츠", "className": "badge-purple"}]'::jsonb,
    0,
    true
),
(
    '/youtube-content-2.jpg',
    'CEO가 콘텐츠 천재면 벌어지는 일? 대표가 직접 운영하는 SNS의 성공 법칙!',
    '[{"text": "SNS", "className": "badge-purple"}, {"text": "바이럴", "className": "badge-purple"}, {"text": "CEO", "className": "badge-purple"}]'::jsonb,
    1,
    true
),
(
    '/youtube-content-3.jpg',
    'SNS 유행 찾다 지친 콘텐츠 기획자를 위해! 인기 릴스 템플릿 전부 모아왔어요',
    '[{"text": "SNS", "className": "badge-purple"}, {"text": "릴스", "className": "badge-purple"}, {"text": "콘텐츠", "className": "badge-purple"}]'::jsonb,
    2,
    true
);

-- TOP 10 Items 초기 데이터
INSERT INTO kmong_12_top10_items (title, order_index, is_active) VALUES
('저희는 합의 끝에 이 챌린지로 골랐습니다. 알고리즘 탑승 직행하는 인기 릴스 모음!', 0, true),
('이건 첫 번째 레슨~ 요즘 유행하는 밈은 알고 가기! [2025년 7월 최신 밈 모음]', 1, true),
('1시간 뚝딱 편집 가능! 숏폼 퀄리티 2배 올리는 프리미어 프로 꿀팁 대방출', 2, true),
('무료 폰트인 줄 알았는데 상업용 금지라고? 저작권 안전한 무료 폰트 사이트 모음', 3, true),
('앞광고, 뒷광고 다 필요 없다! 브랜디드 콘텐츠가 돈이 되는 이유', 4, true),
('29CM는 브랜딩, 올리브영은 콜라보? 각자 다른 마케팅으로 승부하는 플랫폼 시장!', 5, true),
('무신사 스탠다드는 어떻게 밈이 됐을까? 역주행 마케팅의 정석을 보여준 사례 분석', 6, true),
('추성훈, 권또또, 카니··· 지금 유튜브에서 협업하기 좋은 셀럽 채널 14선!', 7, true),
('2025 상반기 마케팅 트렌드·이슈 총결산! 실무자가 주목해야 할 변화는?', 8, true),
('여름 가고 부국제, 최강야구 온다! 9월 시즈널 이슈 담은 마케팅 캘린더 보기', 9, true);

-- News Clippings 초기 데이터
INSERT INTO kmong_12_news_clippings (image, title, order_index, is_active) VALUES
('/0812.png', '뉴스 클리핑 1', 0, true),
('/0813_new.png', '뉴스 클리핑 2', 1, true),
('/0814.png', '뉴스 클리핑 3', 2, true),
('/0818.png', '뉴스 클리핑 4', 3, true),
('/0819.png', '뉴스 클리핑 5', 4, true),
('/0820.png', '뉴스 클리핑 6', 5, true),
('/0821.png', '뉴스 클리핑 7', 6, true),
('/0822.png', '뉴스 클리핑 8', 7, true);

-- Articles 초기 데이터
INSERT INTO kmong_12_articles (title, description, image, badges, published_date, is_featured, category) VALUES
(
    '이게 뮤직비디오야 광고야? 강렬한 비주얼로 시선을 사로잡은 [7월 인기 광고 분석]',
    '7월 인기 광고 분석',
    '/고구마팜썸네일-0822-700x401.jpg',
    '[{"text": "PPL", "className": "badge-purple"}, {"text": "광고", "className": "badge-purple"}, {"text": "유튜브", "className": "badge-purple"}]'::jsonb,
    '2025-08-22',
    true,
    'marketing'
),
(
    '게이머들이 뽑은 올해 최고의 광고?! 페이커X윙 만남을 성사시킨 삼성 OLED 캠페인!',
    '삼성 OLED 캠페인 분석',
    '/고구마팜-말랭이썸네일_250821-700x400.jpg',
    '[{"text": "광고", "className": "badge-purple"}, {"text": "유튜브", "className": "badge-purple"}, {"text": "캠페인", "className": "badge-purple"}]'::jsonb,
    '2025-08-22',
    true,
    'marketing'
),
(
    '구매로 전환되는 광고 기획의 비결? 광고에 영업 당한 소비자에게 물어봤습니다',
    '광고 기획 인사이트',
    '/고구마팜썸네일-0820-700x401.png',
    '[{"text": "SNS", "className": "badge-purple"}, {"text": "광고", "className": "badge-purple"}, {"text": "인터뷰", "className": "badge-purple"}]'::jsonb,
    '2025-08-20',
    false,
    'marketing'
),
(
    '5060 연프에 이어 이젠 초고령 유튜버까지?! 시니어 마케팅 하기 전에 꼭 알아야 할 변화들',
    '시니어 마케팅 트렌드',
    '/고구마팜-시니어는-이렇게-삽니다_대지-1-사본-700x400.png',
    '[{"text": "시니어마케팅", "className": "badge-purple"}, {"text": "캠페인", "className": "badge-purple"}, {"text": "트렌드", "className": "badge-purple"}]'::jsonb,
    '2025-08-19',
    false,
    'trend'
),
(
    '광복 80주년을 빛낸 브랜드들의 특별한 캠페인 모음',
    '광복절 캠페인 분석',
    '/고구마팜-말랭이썸네일_250819-01-700x400.jpg',
    '[{"text": "CSR", "className": "badge-purple"}, {"text": "시즈널마케팅", "className": "badge-purple"}, {"text": "캠페인", "className": "badge-purple"}]'::jsonb,
    '2025-08-19',
    false,
    'campaign'
),
(
    '나영석&김태호가 연프 패널로?! PD판 연프 사옥미팅으로 보는 콘텐츠 인사이트',
    '콘텐츠 인사이트',
    '/고구마팜-말랭이썸네일_250814-700x400.png',
    '[{"text": "유튜브", "className": "badge-purple"}, {"text": "콘텐츠", "className": "badge-purple"}]'::jsonb,
    '2025-08-14',
    false,
    'content'
);

-- Site Settings 초기 데이터
INSERT INTO kmong_12_site_settings (key, value) VALUES
('site_name', '"고구마팜"'::jsonb),
('site_description', '"뜨거운 뉴미디어 이야기"'::jsonb),
('social_links', '{"instagram": "https://instagram.com/gogumafarm", "youtube": "https://youtube.com/@gogumafarm"}'::jsonb);

-- ============================================
-- 쿼리 실행 완료!
-- 이제 /admin 페이지에서 로그인할 수 있습니다.
-- 비밀번호: gogumafarm_2025!
-- ============================================