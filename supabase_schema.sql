-- Supabase 테이블 생성 쿼리
-- 모든 테이블명에 kmong_12_ 접두사 추가

-- 1. Hero Content (메인 캐러셀)
CREATE TABLE kmong_12_hero_contents (
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
CREATE TABLE kmong_12_articles (
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
CREATE TABLE kmong_12_news_clippings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image TEXT NOT NULL,
    title TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TOP 10 Items
CREATE TABLE kmong_12_top10_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Site Settings (사이트 설정)
CREATE TABLE kmong_12_site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin Sessions (간단한 세션 관리)
CREATE TABLE kmong_12_admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Activity Logs (관리자 활동 로그)
CREATE TABLE kmong_12_activity_logs (
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
CREATE TRIGGER update_kmong_12_hero_contents_updated_at 
    BEFORE UPDATE ON kmong_12_hero_contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kmong_12_articles_updated_at 
    BEFORE UPDATE ON kmong_12_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kmong_12_news_clippings_updated_at 
    BEFORE UPDATE ON kmong_12_news_clippings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kmong_12_top10_items_updated_at 
    BEFORE UPDATE ON kmong_12_top10_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kmong_12_site_settings_updated_at 
    BEFORE UPDATE ON kmong_12_site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책
ALTER TABLE kmong_12_hero_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_news_clippings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_top10_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_activity_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables
CREATE POLICY "Public read access" ON kmong_12_hero_contents 
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON kmong_12_articles 
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON kmong_12_news_clippings 
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON kmong_12_top10_items 
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON kmong_12_site_settings 
    FOR SELECT USING (true);

-- Admin sessions policies (read/write for authenticated)
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

-- Admin write access for content tables (will be managed through API)
CREATE POLICY "Admin insert" ON kmong_12_hero_contents 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update" ON kmong_12_hero_contents 
    FOR UPDATE USING (true);

CREATE POLICY "Admin delete" ON kmong_12_hero_contents 
    FOR DELETE USING (true);

CREATE POLICY "Admin insert" ON kmong_12_articles 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update" ON kmong_12_articles 
    FOR UPDATE USING (true);

CREATE POLICY "Admin delete" ON kmong_12_articles 
    FOR DELETE USING (true);

CREATE POLICY "Admin insert" ON kmong_12_news_clippings 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update" ON kmong_12_news_clippings 
    FOR UPDATE USING (true);

CREATE POLICY "Admin delete" ON kmong_12_news_clippings 
    FOR DELETE USING (true);

CREATE POLICY "Admin insert" ON kmong_12_top10_items 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update" ON kmong_12_top10_items 
    FOR UPDATE USING (true);

CREATE POLICY "Admin delete" ON kmong_12_top10_items 
    FOR DELETE USING (true);

-- 초기 데이터 삽입 (선택사항)
-- 현재 웹사이트의 데이터를 마이그레이션
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

-- TOP 10 아이템 삽입
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