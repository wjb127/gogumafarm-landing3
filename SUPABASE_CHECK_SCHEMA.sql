-- 현재 테이블 구조 확인
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'kmong_12_hero_contents'
ORDER BY 
    ordinal_position;

-- 다른 테이블들도 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'kmong_12_%'
ORDER BY table_name;