-- ====================================================
-- Supabase RLS 완전 비활성화 스크립트
-- 주의: 개발 환경에서만 사용하세요!
-- ====================================================

-- 1. 모든 테이블의 RLS 비활성화
ALTER TABLE kmong_12_hero_contents DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_news_clippings DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_top10_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE kmong_12_activity_logs DISABLE ROW LEVEL SECURITY;

-- Analytics 테이블들도 비활성화 (있는 경우)
ALTER TABLE IF EXISTS kmong_12_page_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kmong_12_article_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kmong_12_daily_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kmong_12_active_visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kmong_12_tag_stats DISABLE ROW LEVEL SECURITY;

-- 2. Storage 버킷 정책 설정
-- 이 부분은 Supabase Dashboard에서 직접 설정해야 합니다!

-- ====================================================
-- Storage 버킷 RLS 해결 방법:
-- ====================================================
-- 
-- 방법 1: Supabase Dashboard에서 설정 (권장)
-- 1. https://supabase.com/dashboard 로그인
-- 2. 프로젝트 선택
-- 3. Storage 섹션 클릭
-- 4. "post-images" 버킷 클릭
-- 5. Configuration 탭에서 "Public bucket" 토글을 ON으로 설정
-- 6. Policies 탭으로 이동
-- 7. "New Policy" 클릭
-- 8. "For full customization" 선택
-- 9. 다음과 같이 설정:
--    - Policy name: Allow All
--    - Allowed operation: SELECT, INSERT, UPDATE, DELETE 모두 체크
--    - Target roles: anon 체크
--    - WITH CHECK (for INSERTs): true 입력
--    - USING (for SELECTs, UPDATEs, DELETEs): true 입력
-- 10. "Review" 클릭 후 "Save policy" 클릭

-- 방법 2: SQL로 Storage 정책 추가 (작동하지 않을 수 있음)
-- Storage 정책은 storage.objects 테이블에 적용됩니다
DO $$
BEGIN
    -- storage.objects 테이블 RLS 비활성화 시도
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
    ) THEN
        -- RLS 정책 모두 삭제
        DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
        DROP POLICY IF EXISTS "Enable insert access for all users" ON storage.objects;
        DROP POLICY IF EXISTS "Enable update access for all users" ON storage.objects;
        DROP POLICY IF EXISTS "Enable delete access for all users" ON storage.objects;
        DROP POLICY IF EXISTS "Allow All" ON storage.objects;
        DROP POLICY IF EXISTS "Public Access" ON storage.objects;
        
        -- 새 정책 생성 (모든 작업 허용)
        CREATE POLICY "Allow All Operations" ON storage.objects
        FOR ALL 
        USING (bucket_id = 'post-images')
        WITH CHECK (bucket_id = 'post-images');
        
        -- 또는 더 간단하게
        CREATE POLICY "Public Access" ON storage.objects
        FOR ALL 
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- 3. 버킷 메타데이터 업데이트 (public 설정)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'post-images';

-- 4. 확인 쿼리
SELECT 
    id as bucket_name,
    public as is_public,
    created_at
FROM storage.buckets
WHERE id = 'post-images';

-- 정책 확인
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
WHERE schemaname = 'storage' AND tablename = 'objects';

-- ====================================================
-- 중요: 위 SQL이 작동하지 않으면 Dashboard 사용!
-- ====================================================
-- Storage RLS는 Supabase Dashboard에서 설정하는 것이 가장 확실합니다.
-- 위의 "방법 1"을 따라주세요.