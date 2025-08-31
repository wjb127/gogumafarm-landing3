-- Storage 버킷 상태 확인
SELECT 
    id as bucket_name,
    name as display_name,
    public as is_public,
    created_at,
    updated_at
FROM storage.buckets
WHERE id = 'post-images';

-- Storage 정책 확인
SELECT 
    name as policy_name,
    definition,
    check_expression
FROM storage.policies
WHERE bucket_id = 'post-images';

-- 모든 Storage 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as operation,
    qual as using_expression,
    with_check as check_expression
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- 버킷을 Public으로 설정 (Dashboard에서 안 되면 이 SQL 실행)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'post-images';

-- 간단한 정책 추가 (Dashboard에서 안 되면 이 SQL 실행)
CREATE POLICY "Allow all for post-images" ON storage.objects
FOR ALL
TO anon
USING (bucket_id = 'post-images')
WITH CHECK (bucket_id = 'post-images');