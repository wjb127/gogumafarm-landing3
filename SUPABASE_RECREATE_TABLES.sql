-- ============================================
-- 기존 테이블 삭제 및 재생성
-- 실제 스키마에 맞춰서 작성
-- ============================================

-- 1. 기존 테이블 삭제 (CASCADE로 관련 제약조건도 함께 삭제)
DROP TABLE IF EXISTS kmong_12_hero_contents CASCADE;
DROP TABLE IF EXISTS kmong_12_articles CASCADE;
DROP TABLE IF EXISTS kmong_12_news_clippings CASCADE;
DROP TABLE IF EXISTS kmong_12_top10_items CASCADE;
DROP TABLE IF EXISTS kmong_12_site_settings CASCADE;
DROP TABLE IF EXISTS kmong_12_activity_logs CASCADE;
DROP TABLE IF EXISTS kmong_12_admin_sessions CASCADE;

-- 2. 테이블 재생성

-- Hero 콘텐츠 테이블 (subtitle 없음, image와 badges 사용)
CREATE TABLE kmong_12_hero_contents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,  -- image_url이 아닌 image
    badges JSONB,  -- JSON 배열로 뱃지 저장
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 아티클 테이블 (image와 badges 사용)
CREATE TABLE kmong_12_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT NOT NULL,  -- image_url이 아닌 image
    badges JSONB,  -- badge_text와 badge_type 대신 badges 사용
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 클리핑 테이블 (image 사용)
CREATE TABLE kmong_12_news_clippings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255),
    image TEXT NOT NULL,  -- image_url이 아닌 image
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOP 10 아이템 테이블
CREATE TABLE kmong_12_top10_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    rank INTEGER NOT NULL UNIQUE CHECK (rank >= 1 AND rank <= 10),
    category VARCHAR(100),
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사이트 설정 테이블
CREATE TABLE kmong_12_site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 활동 로그 테이블 (선택사항)
CREATE TABLE kmong_12_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 인덱스 생성 (성능 최적화)
CREATE INDEX idx_hero_order ON kmong_12_hero_contents(order_index);
CREATE INDEX idx_hero_active ON kmong_12_hero_contents(is_active);
CREATE INDEX idx_articles_order ON kmong_12_articles(order_index);
CREATE INDEX idx_articles_active ON kmong_12_articles(is_active);
CREATE INDEX idx_news_order ON kmong_12_news_clippings(order_index);
CREATE INDEX idx_news_active ON kmong_12_news_clippings(is_active);
CREATE INDEX idx_top10_rank ON kmong_12_top10_items(rank);
CREATE INDEX idx_top10_active ON kmong_12_top10_items(is_active);
CREATE INDEX idx_settings_key ON kmong_12_site_settings(setting_key);

-- 4. 업데이트 시간 자동 갱신 트리거
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

-- 5. RLS (Row Level Security) 정책 설정

-- RLS 활성화
ALTER TABLE kmong_12_hero_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_news_clippings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_top10_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_activity_logs ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Anon can insert logs" ON kmong_12_activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can view logs" ON kmong_12_activity_logs FOR SELECT USING (true);

-- 완료 메시지
SELECT '✅ 테이블 재생성 완료!' AS message;