const { createClient } = require('@supabase/supabase-js')

// Supabase 설정
const supabaseUrl = 'https://bzzjkcrbwwrqlumxigag.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6emprY3Jid3dycWx1bXhpZ2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4MTM0OTUsImV4cCI6MjA0NDM4OTQ5NX0.yuQ9Ofc-s2sSHcRSU2_p9ZtcIL0yracXfVa48ZlmUNY'
const supabase = createClient(supabaseUrl, supabaseKey)

// 원본 데이터 백업
let originalData = {}

async function backupData() {
  console.log('📦 원본 데이터 백업 중...')
  
  const tables = [
    'kmong_12_hero_contents',
    'kmong_12_articles', 
    'kmong_12_news_clippings',
    'kmong_12_top10_items',
    'kmong_12_site_settings'
  ]
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*')
    if (!error) {
      originalData[table] = data
      console.log(`✅ ${table}: ${data.length}개 항목 백업 완료`)
    }
  }
}

async function testCRUD() {
  console.log('\n🧪 CRUD 테스트 시작...\n')
  
  // 1. CREATE 테스트
  console.log('1️⃣ CREATE 테스트')
  
  // Hero Content 추가
  const { data: newHero, error: heroError } = await supabase
    .from('kmong_12_hero_contents')
    .insert({
      image: '/test-hero.jpg',
      title: '테스트 히어로 콘텐츠',
      badges: [{ text: 'TEST', className: 'badge-purple' }],
      order_index: 999,
      is_active: true
    })
    .select()
  
  if (!heroError) {
    console.log('✅ Hero Content 생성 성공:', newHero[0].id)
  } else {
    console.log('❌ Hero Content 생성 실패:', heroError)
  }
  
  // Article 추가
  const { data: newArticle, error: articleError } = await supabase
    .from('kmong_12_articles')
    .insert({
      title: '테스트 아티클',
      description: '테스트 설명입니다',
      image: '/test-article.jpg',
      badges: [{ text: 'TEST', className: 'badge-purple' }],
      category: 'Test',
      is_featured: true,
      published_date: new Date().toISOString()
    })
    .select()
  
  if (!articleError) {
    console.log('✅ Article 생성 성공:', newArticle[0].id)
  } else {
    console.log('❌ Article 생성 실패:', articleError)
  }
  
  // 2. READ 테스트
  console.log('\n2️⃣ READ 테스트')
  
  const { data: heroes, error: readHeroError } = await supabase
    .from('kmong_12_hero_contents')
    .select('*')
    .order('order_index')
  
  if (!readHeroError) {
    console.log(`✅ Hero Contents 조회 성공: ${heroes.length}개 항목`)
  }
  
  const { data: articles, error: readArticleError } = await supabase
    .from('kmong_12_articles')
    .select('*')
    .order('published_date', { ascending: false })
  
  if (!readArticleError) {
    console.log(`✅ Articles 조회 성공: ${articles.length}개 항목`)
  }
  
  // 3. UPDATE 테스트
  console.log('\n3️⃣ UPDATE 테스트')
  
  if (newHero && newHero[0]) {
    const { error: updateError } = await supabase
      .from('kmong_12_hero_contents')
      .update({
        title: '업데이트된 테스트 히어로',
        is_active: false
      })
      .eq('id', newHero[0].id)
    
    if (!updateError) {
      console.log('✅ Hero Content 업데이트 성공')
    } else {
      console.log('❌ Hero Content 업데이트 실패:', updateError)
    }
  }
  
  if (newArticle && newArticle[0]) {
    const { error: updateError } = await supabase
      .from('kmong_12_articles')
      .update({
        title: '업데이트된 테스트 아티클',
        is_featured: false
      })
      .eq('id', newArticle[0].id)
    
    if (!updateError) {
      console.log('✅ Article 업데이트 성공')
    } else {
      console.log('❌ Article 업데이트 실패:', updateError)
    }
  }
  
  // 4. DELETE 테스트
  console.log('\n4️⃣ DELETE 테스트')
  
  if (newHero && newHero[0]) {
    const { error: deleteError } = await supabase
      .from('kmong_12_hero_contents')
      .delete()
      .eq('id', newHero[0].id)
    
    if (!deleteError) {
      console.log('✅ Hero Content 삭제 성공')
    } else {
      console.log('❌ Hero Content 삭제 실패:', deleteError)
    }
  }
  
  if (newArticle && newArticle[0]) {
    const { error: deleteError } = await supabase
      .from('kmong_12_articles')
      .delete()
      .eq('id', newArticle[0].id)
    
    if (!deleteError) {
      console.log('✅ Article 삭제 성공')
    } else {
      console.log('❌ Article 삭제 실패:', deleteError)
    }
  }
  
  // 5. TOP 10 순서 변경 테스트
  console.log('\n5️⃣ TOP 10 순서 변경 테스트')
  
  const { data: top10Items } = await supabase
    .from('kmong_12_top10_items')
    .select('*')
    .order('order_index')
    .limit(2)
  
  if (top10Items && top10Items.length >= 2) {
    // 첫 두 항목의 순서 바꾸기
    await Promise.all([
      supabase.from('kmong_12_top10_items')
        .update({ order_index: 1 })
        .eq('id', top10Items[0].id),
      supabase.from('kmong_12_top10_items')
        .update({ order_index: 0 })
        .eq('id', top10Items[1].id)
    ])
    
    console.log('✅ TOP 10 순서 변경 성공')
    
    // 원래대로 복구
    await Promise.all([
      supabase.from('kmong_12_top10_items')
        .update({ order_index: 0 })
        .eq('id', top10Items[0].id),
      supabase.from('kmong_12_top10_items')
        .update({ order_index: 1 })
        .eq('id', top10Items[1].id)
    ])
    
    console.log('✅ TOP 10 순서 복구 완료')
  }
}

async function restoreData() {
  console.log('\n🔄 원본 데이터 복구 중...')
  
  // 모든 테이블의 데이터를 삭제하고 원본으로 복구
  for (const [table, data] of Object.entries(originalData)) {
    // 기존 데이터 모두 삭제
    await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 원본 데이터 복구
    if (data && data.length > 0) {
      const { error } = await supabase.from(table).insert(data)
      if (!error) {
        console.log(`✅ ${table}: ${data.length}개 항목 복구 완료`)
      } else {
        console.log(`❌ ${table} 복구 실패:`, error)
      }
    }
  }
}

async function main() {
  try {
    await backupData()
    await testCRUD()
    await restoreData()
    console.log('\n✅ 모든 테스트 완료!')
  } catch (error) {
    console.error('테스트 중 오류 발생:', error)
    await restoreData()
  }
}

main()