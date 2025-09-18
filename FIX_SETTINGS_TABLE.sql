-- ====================================================
-- kmong_12_site_settings 테이블 권한 문제 해결
-- ====================================================

-- 1. RLS 비활성화
ALTER TABLE kmong_12_site_settings DISABLE ROW LEVEL SECURITY;

-- 2. 모든 기존 정책 삭제
DROP POLICY IF EXISTS "Enable read access for all users" ON kmong_12_site_settings;
DROP POLICY IF EXISTS "Enable insert for all users" ON kmong_12_site_settings;
DROP POLICY IF EXISTS "Enable update for all users" ON kmong_12_site_settings;
DROP POLICY IF EXISTS "Enable delete for all users" ON kmong_12_site_settings;
DROP POLICY IF EXISTS "Allow all operations" ON kmong_12_site_settings;

-- 3. RLS 다시 활성화 (정책 없이)
ALTER TABLE kmong_12_site_settings ENABLE ROW LEVEL SECURITY;

-- 4. 모든 작업을 허용하는 단순 정책 추가
CREATE POLICY "Allow all operations for everyone" ON kmong_12_site_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- 5. 테이블 권한 설정
GRANT ALL ON kmong_12_site_settings TO anon;
GRANT ALL ON kmong_12_site_settings TO authenticated;
GRANT ALL ON kmong_12_site_settings TO service_role;

-- 6. 테이블 구조 확인
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'kmong_12_site_settings';

-- 7. 현재 정책 확인
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'kmong_12_site_settings';

-- 8. 테스트 데이터 삽입 (이미 있으면 업데이트)
INSERT INTO kmong_12_site_settings (key, value, updated_at)
VALUES 
    ('test_key', '"test_value"'::jsonb, NOW())
ON CONFLICT (key) 
DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 9. 확인
SELECT * FROM kmong_12_site_settings WHERE key = 'test_key';

-- ====================================================
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요:
-- 1. Supabase Dashboard 로그인
-- 2. SQL Editor 메뉴 클릭
-- 3. New Query 버튼 클릭
-- 4. 이 전체 스크립트 복사/붙여넣기
-- 5. Run 버튼 클릭
-- ====================================================