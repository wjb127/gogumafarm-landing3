-- ============================================
-- 실제 스키마에 맞춘 데이터 삽입
-- subtitle 컬럼이 없는 버전
-- ============================================

-- 기존 데이터 삭제 (선택사항)
-- DELETE FROM kmong_12_hero_contents;
-- DELETE FROM kmong_12_articles;
-- DELETE FROM kmong_12_news_clippings;
-- DELETE FROM kmong_12_top10_items;
-- DELETE FROM kmong_12_site_settings;

-- Hero 콘텐츠 (subtitle 없이)
INSERT INTO kmong_12_hero_contents (title, image, badges, order_index, is_active)
VALUES 
('유튜브 필승법 = 귀여운 동물? 공공기관도, AI 크리에이터도 써먹는 콘텐츠 치트키!', 
 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/hero/hero-1.png', 
 '[{"text": "공공기관", "className": "badge-purple"}, {"text": "유튜브", "className": "badge-purple"}, {"text": "콘텐츠", "className": "badge-purple"}]'::jsonb, 
 0, true),
('CEO가 콘텐츠 천재면 벌어지는 일? 대표가 직접 운영하는 SNS의 성공 법칙!', 
 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/hero/hero-2.jpg', 
 '[{"text": "SNS", "className": "badge-purple"}, {"text": "바이럴", "className": "badge-purple"}, {"text": "CEO", "className": "badge-purple"}]'::jsonb, 
 1, true),
('SNS 유행 찾다 지친 콘텐츠 기획자를 위해! 인기 릴스 템플릿 전부 모아왔어요', 
 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/hero/hero-3.jpg', 
 '[{"text": "SNS", "className": "badge-purple"}, {"text": "릴스", "className": "badge-purple"}, {"text": "콘텐츠", "className": "badge-purple"}]'::jsonb, 
 2, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  badges = EXCLUDED.badges,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active;

-- 아티클 (image 컬럼명 확인 필요)
INSERT INTO kmong_12_articles (title, description, image, badges, category, is_featured, created_at, order_index, is_active)
VALUES 
('이게 뮤직비디오야 광고야? 강렬한 비주얼로 시선을 사로잡은 [7월 인기 광고 분석]', 
 '2025년 7월 가장 화제가 된 광고들을 분석합니다', 
 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/articles/article-1.jpg', 
 '[{"text": "PPL"}, {"text": "광고"}, {"text": "유튜브"}]'::jsonb,
 '광고', true, '2025-08-22', 0, true),
('게이머들이 뽑은 올해 최고의 광고?! 페이커X윙 만남을 성사시킨 삼성 OLED 캠페인!', 
 '게임과 광고의 성공적인 콜라보레이션', 
 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/articles/article-2.jpg', 
 '[{"text": "광고"}, {"text": "유튜브"}, {"text": "캠페인"}]'::jsonb,
 '광고', true, '2025-08-22', 1, true),
('구매로 전환되는 광고 기획의 비결? 광고에 영업 당한 소비자에게 물어봤습니다', 
 '실제 구매로 이어지는 광고의 비밀', 
 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/articles/article-3.png', 
 '[{"text": "SNS"}, {"text": "광고"}, {"text": "인터뷰"}]'::jsonb,
 '인터뷰', true, '2025-08-20', 2, true),
('5060 연프에 이어 이젠 초고령 유튜버까지?! 시니어 마케팅 하기 전에 꼭 알아야 할 변화들', 
 '시니어 시장의 새로운 트렌드', 
 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/articles/article-4.png', 
 '[{"text": "시니어마케팅"}, {"text": "캠페인"}, {"text": "트렌드"}]'::jsonb,
 '트렌드', true, '2025-08-19', 3, true),
('AI가 되살려낸 80년 전 만세 소리! 올해 광복절 캠페인이 보여준 새로운 시도', 
 '기술과 역사가 만나는 특별한 캠페인', 
 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/articles/article-5.jpg', 
 '[{"text": "CSR"}, {"text": "시즈널마케팅"}, {"text": "캠페인"}]'::jsonb,
 'CSR', true, '2025-08-19', 4, true),
('나영석&김태호가 연프 패널로?! PD판 사옥미팅으로 보는 콘텐츠 인사이트', 
 'PD들의 특별한 만남이 주는 인사이트', 
 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/articles/article-6.png', 
 '[{"text": "유튜브"}, {"text": "콘텐츠"}]'::jsonb,
 '콘텐츠', true, '2025-08-14', 5, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  badges = EXCLUDED.badges,
  category = EXCLUDED.category,
  is_featured = EXCLUDED.is_featured,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active;

-- 뉴스 클리핑 (image 컬럼명 확인 필요)
INSERT INTO kmong_12_news_clippings (title, image, order_index, is_active)
VALUES 
('MBC 뉴스데스크', 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/news/news-1.png', 0, true),
('KBS 9시 뉴스', 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/news/news-2.png', 1, true),
('SBS 8시 뉴스', 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/news/news-3.png', 2, true),
('JTBC 뉴스룸', 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/news/news-4.png', 3, true),
('채널A 뉴스', 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/news/news-5.png', 4, true),
('TV조선 뉴스', 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/news/news-6.png', 5, true),
('MBN 종합뉴스', 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/news/news-7.png', 6, true),
('YTN 24시간 뉴스', 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/news/news-8.png', 7, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active;

-- TOP 10 아이템
INSERT INTO kmong_12_top10_items (title, rank, category, is_active)
VALUES 
('저희는 합의 끝에 이 챌린지로 골랐습니다. 알고리즘 탑승 직행하는 인기 릴스 모음!', 1, '트렌드', true),
('이건 첫 번째 레슨~ 요즘 유행하는 밈은 알고 가기! [2025년 7월 최신 밈 모음]', 2, '밈', true),
('추성훈, 권또또, 카니··· 지금 유튜브에서 협업하기 좋은 셀럽 채널 14선!', 3, '유튜브', true),
('29CM는 브랜딩, 올리브영은 콜라보? 각자 다른 마케팅으로 승부하는 플랫폼 시장!', 4, '마케팅', true),
('바야흐로 생성형 AI 콘텐츠의 전성시대! 지금 주목받는 AI 활용 트렌드 살펴보기', 5, 'AI', true),
('나영석&김태호가 연프 패널로?! PD판 사옥미팅으로 보는 콘텐츠 인사이트', 6, '콘텐츠', true),
('웬즈데이가 역대급 콜라보와 함께 돌아왔다! 웬디스, 치토스 사례로 보는 IP 활용 전략', 7, 'IP', true),
('2025 상반기 마케팅 트렌드·이슈 총결산! 실무자가 주목해야 할 변화는?', 8, '트렌드', true),
('인기 밈 알면 하룰라라 날아서 궁전으로 갈 수도 있어~ [2025년 6월 최신 밈 모음]', 9, '밈', true),
('여름 가고 부국제, 최강야구 온다! 9월 시즈널 이슈 담은 마케팅 캘린더 보기', 10, '캘린더', true)
ON CONFLICT (rank) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active;

-- 사이트 설정
INSERT INTO kmong_12_site_settings (setting_key, setting_value, setting_type)
VALUES 
('site_title', '고구마팜 by. The SMC', 'text'),
('logo_url', 'https://bzzjkcrbwwrqlumxigag.supabase.co/storage/v1/object/public/post-images/misc/logo.svg', 'text'),
('nav_link_1', '최신 밈과 트렌드', 'text'),
('nav_link_2', '핵심 전략과 레퍼런스', 'text'),
('nav_link_3', '일잘러 스킬셋', 'text'),
('nav_link_4', '슴씨피드', 'text'),
('header_cta_1', '문의하기', 'text'),
('header_cta_2', '뉴스레터 구독하기', 'text'),
('top10_title', '인기 아티클 TOP 10', 'text'),
('top10_subtitle', '시간이 없다면? 이것부터 읽어봐도 좋아요', 'text'),
('articles_title', '최신 아티클', 'text'),
('articles_subtitle', '방금 올라온 인사이트 확인하고 한 걸음 앞서가세요', 'text'),
('news_title', '뉴스클리핑', 'text'),
('news_subtitle', '방금 업데이트된 뉴미디어 소식,\n여기 다 있어요', 'text'),
('footer_term', '이용약관', 'text'),
('footer_privacy', '개인정보 수집 및 이용방침', 'text'),
('footer_address', '서울특별시 강남구 선릉로 648', 'text'),
('footer_phone', '070-7825-0749', 'text'),
('footer_email', 'info@gogumafarm.kr', 'text'),
('footer_copyright', '©2025. The SMC all rights reserved.', 'text')
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value,
    updated_at = NOW();

-- 완료 메시지
SELECT '✅ 데이터 삽입 완료!' AS message;