-- Site Settings 테이블에 URL 필드 추가
-- 각종 페이지와 링크들을 관리할 수 있도록 설정

-- 네비게이션 링크 URL 추가
ALTER TABLE kmong_12_site_settings 
ADD COLUMN IF NOT EXISTS nav_link_1_url VARCHAR(500) DEFAULT '#',
ADD COLUMN IF NOT EXISTS nav_link_2_url VARCHAR(500) DEFAULT '#',
ADD COLUMN IF NOT EXISTS nav_link_3_url VARCHAR(500) DEFAULT '#',
ADD COLUMN IF NOT EXISTS nav_link_4_url VARCHAR(500) DEFAULT '#';

-- 헤더 CTA 버튼 URL 추가
ALTER TABLE kmong_12_site_settings
ADD COLUMN IF NOT EXISTS header_cta_1_url VARCHAR(500) DEFAULT '#',
ADD COLUMN IF NOT EXISTS header_cta_2_url VARCHAR(500) DEFAULT '#';

-- 소셜 미디어 링크 추가
ALTER TABLE kmong_12_site_settings
ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500) DEFAULT 'https://instagram.com',
ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(500) DEFAULT 'https://youtube.com',
ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(500) DEFAULT 'https://facebook.com',
ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(500) DEFAULT 'https://twitter.com',
ADD COLUMN IF NOT EXISTS blog_url VARCHAR(500) DEFAULT '#';

-- 푸터 링크 추가
ALTER TABLE kmong_12_site_settings
ADD COLUMN IF NOT EXISTS footer_privacy_url VARCHAR(500) DEFAULT '/privacy',
ADD COLUMN IF NOT EXISTS footer_terms_url VARCHAR(500) DEFAULT '/terms',
ADD COLUMN IF NOT EXISTS footer_contact_url VARCHAR(500) DEFAULT '/contact';

-- 기타 유용한 링크들
ALTER TABLE kmong_12_site_settings
ADD COLUMN IF NOT EXISTS admin_panel_url VARCHAR(500) DEFAULT '/admin',
ADD COLUMN IF NOT EXISTS all_articles_url VARCHAR(500) DEFAULT '/articles',
ADD COLUMN IF NOT EXISTS newsletter_signup_url VARCHAR(500) DEFAULT '#';

-- 기본값 업데이트 (이미 행이 있는 경우)
UPDATE kmong_12_site_settings 
SET 
  nav_link_1_url = COALESCE(nav_link_1_url, '#'),
  nav_link_2_url = COALESCE(nav_link_2_url, '#'),
  nav_link_3_url = COALESCE(nav_link_3_url, '#'),
  nav_link_4_url = COALESCE(nav_link_4_url, '#'),
  header_cta_1_url = COALESCE(header_cta_1_url, '#'),
  header_cta_2_url = COALESCE(header_cta_2_url, '#'),
  instagram_url = COALESCE(instagram_url, 'https://instagram.com'),
  youtube_url = COALESCE(youtube_url, 'https://youtube.com'),
  facebook_url = COALESCE(facebook_url, 'https://facebook.com'),
  twitter_url = COALESCE(twitter_url, 'https://twitter.com'),
  blog_url = COALESCE(blog_url, '#'),
  footer_privacy_url = COALESCE(footer_privacy_url, '/privacy'),
  footer_terms_url = COALESCE(footer_terms_url, '/terms'),
  footer_contact_url = COALESCE(footer_contact_url, '/contact'),
  admin_panel_url = COALESCE(admin_panel_url, '/admin'),
  all_articles_url = COALESCE(all_articles_url, '/articles'),
  newsletter_signup_url = COALESCE(newsletter_signup_url, '#')
WHERE id = (SELECT id FROM kmong_12_site_settings LIMIT 1);