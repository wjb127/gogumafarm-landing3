-- ============================================
-- 방문자 및 조회수 트래킹을 위한 테이블 생성
-- ============================================

-- 1. 페이지 조회 기록 테이블
CREATE TABLE IF NOT EXISTS kmong_12_page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_type VARCHAR(50) NOT NULL, -- 'home', 'article', 'tag', 'admin'
    page_id VARCHAR(255), -- 아티클 ID 또는 태그명
    visitor_id VARCHAR(255), -- 방문자 식별 ID (익명)
    ip_address VARCHAR(45), -- IP 주소 (선택사항)
    user_agent TEXT, -- 브라우저 정보
    referrer TEXT, -- 유입 경로
    session_id VARCHAR(255), -- 세션 ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 아티클별 조회수 통계 테이블 (집계용)
CREATE TABLE IF NOT EXISTS kmong_12_article_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES kmong_12_articles(id) ON DELETE CASCADE,
    view_count INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id)
);

-- 3. 일별 방문자 통계 테이블
CREATE TABLE IF NOT EXISTS kmong_12_daily_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    new_visitors INTEGER DEFAULT 0,
    returning_visitors INTEGER DEFAULT 0,
    page_views_home INTEGER DEFAULT 0,
    page_views_articles INTEGER DEFAULT 0,
    page_views_tags INTEGER DEFAULT 0,
    most_viewed_article_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 실시간 온라인 방문자 테이블
CREATE TABLE IF NOT EXISTS kmong_12_active_visitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id VARCHAR(255) UNIQUE NOT NULL,
    page_type VARCHAR(50),
    page_id VARCHAR(255),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 인기 태그 통계 테이블
CREATE TABLE IF NOT EXISTS kmong_12_tag_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag_name VARCHAR(100) UNIQUE NOT NULL,
    view_count INTEGER DEFAULT 0,
    article_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_page_views_created ON kmong_12_page_views(created_at DESC);
CREATE INDEX idx_page_views_visitor ON kmong_12_page_views(visitor_id);
CREATE INDEX idx_page_views_page ON kmong_12_page_views(page_type, page_id);
CREATE INDEX idx_article_stats_views ON kmong_12_article_stats(view_count DESC);
CREATE INDEX idx_daily_stats_date ON kmong_12_daily_stats(date DESC);
CREATE INDEX idx_active_visitors_activity ON kmong_12_active_visitors(last_activity DESC);
CREATE INDEX idx_tag_stats_views ON kmong_12_tag_stats(view_count DESC);

-- RLS 정책 설정
ALTER TABLE kmong_12_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_article_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_active_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_tag_stats ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 조회 가능, anon 사용자가 삽입 가능
CREATE POLICY "Public can view page views" ON kmong_12_page_views FOR SELECT USING (true);
CREATE POLICY "Anon can insert page views" ON kmong_12_page_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view article stats" ON kmong_12_article_stats FOR SELECT USING (true);
CREATE POLICY "Anon can manage article stats" ON kmong_12_article_stats FOR ALL USING (true);

CREATE POLICY "Public can view daily stats" ON kmong_12_daily_stats FOR SELECT USING (true);
CREATE POLICY "Anon can manage daily stats" ON kmong_12_daily_stats FOR ALL USING (true);

CREATE POLICY "Public can view active visitors" ON kmong_12_active_visitors FOR SELECT USING (true);
CREATE POLICY "Anon can manage active visitors" ON kmong_12_active_visitors FOR ALL USING (true);

CREATE POLICY "Public can view tag stats" ON kmong_12_tag_stats FOR SELECT USING (true);
CREATE POLICY "Anon can manage tag stats" ON kmong_12_tag_stats FOR ALL USING (true);

-- 기존 아티클 테이블에 조회수 컬럼 추가 (없으면)
ALTER TABLE kmong_12_articles 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_article_view_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 아티클 통계 업데이트
    INSERT INTO kmong_12_article_stats (article_id, view_count, unique_visitors, last_viewed_at)
    VALUES (NEW.page_id::uuid, 1, 1, NOW())
    ON CONFLICT (article_id) 
    DO UPDATE SET 
        view_count = kmong_12_article_stats.view_count + 1,
        last_viewed_at = NOW();
    
    -- 아티클 테이블의 view_count도 업데이트
    UPDATE kmong_12_articles 
    SET view_count = view_count + 1 
    WHERE id = NEW.page_id::uuid;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_article_views
AFTER INSERT ON kmong_12_page_views
FOR EACH ROW
WHEN (NEW.page_type = 'article' AND NEW.page_id IS NOT NULL)
EXECUTE FUNCTION update_article_view_count();

-- 완료 메시지
SELECT '✅ Analytics 테이블 생성 완료!' AS message;