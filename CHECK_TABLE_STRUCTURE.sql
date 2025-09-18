-- ====================================================
-- kmong_12_site_settings 테이블 구조 확인
-- ====================================================

-- 1. 테이블 컬럼 확인
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'kmong_12_site_settings'
ORDER BY ordinal_position;

-- 2. 테이블 제약 조건 확인
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'kmong_12_site_settings';

-- 3. 현재 데이터 확인 (처음 10개)
SELECT * FROM kmong_12_site_settings LIMIT 10;

-- ====================================================
-- 이 쿼리를 실행하면 실제 테이블 구조를 확인할 수 있습니다
-- ====================================================