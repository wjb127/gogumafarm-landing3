-- Supabase RLS 정책 수정 스크립트
-- 이미지 업로드 및 데이터 수정을 위한 정책 설정

-- ================================================
-- 1. Storage (post-images 버킷) 정책 설정
-- ================================================

-- Storage 정책 확인 및 생성
-- Supabase Dashboard > Storage > Policies에서 설정하거나 아래 SQL 실행

-- post-images 버킷에 대한 공개 접근 정책
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('post-images', 'Public Access', 'true', NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- ================================================
-- 2. 테이블 RLS 정책 수정 (모든 CRUD 작업 허용)
-- ================================================

-- Hero Contents 테이블
ALTER TABLE kmong_12_hero_contents ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public read access" ON kmong_12_hero_contents;
DROP POLICY IF EXISTS "Public write access" ON kmong_12_hero_contents;
DROP POLICY IF EXISTS "Public insert access" ON kmong_12_hero_contents;
DROP POLICY IF EXISTS "Public update access" ON kmong_12_hero_contents;
DROP POLICY IF EXISTS "Public delete access" ON kmong_12_hero_contents;

-- 새 정책 생성 (모든 작업 허용)
CREATE POLICY "Enable all operations" ON kmong_12_hero_contents
  FOR ALL USING (true) WITH CHECK (true);

-- Articles 테이블
ALTER TABLE kmong_12_articles ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public read access" ON kmong_12_articles;
DROP POLICY IF EXISTS "Public write access" ON kmong_12_articles;
DROP POLICY IF EXISTS "Public insert access" ON kmong_12_articles;
DROP POLICY IF EXISTS "Public update access" ON kmong_12_articles;
DROP POLICY IF EXISTS "Public delete access" ON kmong_12_articles;

-- 새 정책 생성 (모든 작업 허용)
CREATE POLICY "Enable all operations" ON kmong_12_articles
  FOR ALL USING (true) WITH CHECK (true);

-- News Clippings 테이블
ALTER TABLE kmong_12_news_clippings ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public read access" ON kmong_12_news_clippings;
DROP POLICY IF EXISTS "Public write access" ON kmong_12_news_clippings;
DROP POLICY IF EXISTS "Public insert access" ON kmong_12_news_clippings;
DROP POLICY IF EXISTS "Public update access" ON kmong_12_news_clippings;
DROP POLICY IF EXISTS "Public delete access" ON kmong_12_news_clippings;

-- 새 정책 생성 (모든 작업 허용)
CREATE POLICY "Enable all operations" ON kmong_12_news_clippings
  FOR ALL USING (true) WITH CHECK (true);

-- Top 10 Items 테이블
ALTER TABLE kmong_12_top10_items ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public read access" ON kmong_12_top10_items;
DROP POLICY IF EXISTS "Public write access" ON kmong_12_top10_items;
DROP POLICY IF EXISTS "Public insert access" ON kmong_12_top10_items;
DROP POLICY IF EXISTS "Public update access" ON kmong_12_top10_items;
DROP POLICY IF EXISTS "Public delete access" ON kmong_12_top10_items;

-- 새 정책 생성 (모든 작업 허용)
CREATE POLICY "Enable all operations" ON kmong_12_top10_items
  FOR ALL USING (true) WITH CHECK (true);

-- Site Settings 테이블
ALTER TABLE kmong_12_site_settings ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public read access" ON kmong_12_site_settings;
DROP POLICY IF EXISTS "Public write access" ON kmong_12_site_settings;
DROP POLICY IF EXISTS "Public insert access" ON kmong_12_site_settings;
DROP POLICY IF EXISTS "Public update access" ON kmong_12_site_settings;
DROP POLICY IF EXISTS "Public delete access" ON kmong_12_site_settings;

-- 새 정책 생성 (모든 작업 허용)
CREATE POLICY "Enable all operations" ON kmong_12_site_settings
  FOR ALL USING (true) WITH CHECK (true);

-- Activity Logs 테이블
ALTER TABLE kmong_12_activity_logs ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public read access" ON kmong_12_activity_logs;
DROP POLICY IF EXISTS "Public write access" ON kmong_12_activity_logs;
DROP POLICY IF EXISTS "Public insert access" ON kmong_12_activity_logs;

-- 새 정책 생성 (모든 작업 허용)
CREATE POLICY "Enable all operations" ON kmong_12_activity_logs
  FOR ALL USING (true) WITH CHECK (true);

-- ================================================
-- 3. 간단한 RLS 비활성화 방법 (임시 해결책)
-- ================================================
-- 만약 위 방법이 작동하지 않으면 아래 명령으로 RLS를 완전히 비활성화할 수 있습니다.
-- 주의: 보안상 권장하지 않으며, 개발 환경에서만 사용하세요.

/*
-- RLS 완전 비활성화 (권장하지 않음)
ALTER TABLE kmong_12_hero_contents DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_news_clippings DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_top10_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_activity_logs DISABLE ROW LEVEL SECURITY;
*/

-- ================================================
-- 4. Storage 버킷 공개 설정 (Dashboard에서 설정)
-- ================================================
-- Supabase Dashboard에서:
-- 1. Storage 섹션으로 이동
-- 2. post-images 버킷 선택
-- 3. 버킷 설정에서 "Public bucket" 토글 활성화
-- 4. RLS Policies에서 다음 정책 추가:
--    - Policy name: "Public Access"
--    - Allowed operation: SELECT, INSERT, UPDATE, DELETE
--    - Target roles: anon, authenticated
--    - WITH CHECK expression: true
--    - USING expression: true

-- ================================================
-- 5. 테스트 쿼리
-- ================================================
-- 정책이 제대로 적용되었는지 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename LIKE 'kmong_12_%'
ORDER BY tablename, policyname;