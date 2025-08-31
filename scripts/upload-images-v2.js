const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// 환경 변수 로드
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL 또는 Key가 없습니다. .env.local 파일을 확인하세요.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 업로드할 이미지 매핑 (원본 파일명 -> 영문 파일명)
const imageMapping = {
  // Hero 이미지
  'youtube-content-1.png': 'hero-1.png',
  'youtube-content-2.jpg': 'hero-2.jpg',
  'youtube-content-3.jpg': 'hero-3.jpg',
  
  // 뉴스 클리핑 이미지
  '0812.png': 'news-1.png',
  '0813_new.png': 'news-2.png',
  '0814.png': 'news-3.png',
  '0818.png': 'news-4.png',
  '0819.png': 'news-5.png',
  '0820.png': 'news-6.png',
  '0821.png': 'news-7.png',
  '0822.png': 'news-8.png',
  
  // 아티클 이미지 (한글 파일명을 영문으로)
  '고구마팜썸네일-0822-700x401.jpg': 'article-1.jpg',
  '고구마팜-말랭이썸네일_250821-700x400.jpg': 'article-2.jpg',
  '고구마팜썸네일-0820-700x401.png': 'article-3.png',
  '고구마팜-시니어는-이렇게-삽니다_대지-1-사본-700x400.png': 'article-4.png',
  '고구마팜-말랭이썸네일_250819-01-700x400.jpg': 'article-5.jpg',
  '고구마팜-말랭이썸네일_250814-700x400.png': 'article-6.png',
  
  // 기타 필요한 이미지
  'hero-bottom-bg.png': 'hero-bottom-bg.png',
  'footer-goguma.webp': 'footer-goguma.webp',
  'broken-goguma.webp': 'broken-goguma.webp',
  'read-now.webp': 'read-now.webp',
  'logo-1.svg': 'logo.svg'
}

async function uploadImage(originalFileName, newFileName) {
  try {
    const filePath = path.join(__dirname, '../public', originalFileName)
    
    // 파일이 존재하는지 확인
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  파일을 찾을 수 없음: ${originalFileName}`)
      return null
    }
    
    const fileData = fs.readFileSync(filePath)
    const fileExt = path.extname(newFileName)
    
    // 폴더 구분
    let folderName = 'misc'
    if (newFileName.startsWith('hero-')) folderName = 'hero'
    else if (newFileName.startsWith('news-')) folderName = 'news'
    else if (newFileName.startsWith('article-')) folderName = 'articles'
    
    const uploadPath = `${folderName}/${newFileName}`
    
    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(uploadPath, fileData, {
        contentType: getContentType(fileExt),
        upsert: true // 이미 존재하면 덮어쓰기
      })
    
    if (error) {
      console.error(`❌ 업로드 실패 ${originalFileName}:`, error.message)
      return null
    }
    
    // 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(uploadPath)
    
    console.log(`✅ 업로드 성공: ${originalFileName} → ${newFileName} (${publicUrl})`)
    return { 
      originalFileName, 
      newFileName, 
      publicUrl, 
      uploadPath,
      folderName 
    }
    
  } catch (error) {
    console.error(`❌ 오류 ${originalFileName}:`, error.message)
    return null
  }
}

function getContentType(ext) {
  const types = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  }
  return types[ext.toLowerCase()] || 'application/octet-stream'
}

async function updateDatabase(uploadResults) {
  console.log('\n📝 데이터베이스 업데이트 중...\n')
  
  // Hero 콘텐츠 업데이트
  const heroImages = uploadResults.filter(r => r && r.folderName === 'hero' && r.newFileName.match(/^hero-\d/))
  for (let i = 0; i < heroImages.length; i++) {
    const { error } = await supabase
      .from('kmong_12_hero_contents')
      .update({ image_url: heroImages[i].publicUrl })
      .eq('order_index', i + 1)
    
    if (!error) {
      console.log(`✅ Hero ${i + 1} 이미지 URL 업데이트: ${heroImages[i].publicUrl}`)
    } else {
      console.log(`❌ Hero ${i + 1} 업데이트 실패:`, error.message)
    }
  }
  
  // 뉴스 클리핑 업데이트
  const newsImages = uploadResults.filter(r => r && r.folderName === 'news')
  for (let i = 0; i < newsImages.length; i++) {
    const { error } = await supabase
      .from('kmong_12_news_clippings')
      .update({ image_url: newsImages[i].publicUrl })
      .eq('order_index', i + 1)
    
    if (!error) {
      console.log(`✅ News ${i + 1} 이미지 URL 업데이트: ${newsImages[i].publicUrl}`)
    } else {
      console.log(`❌ News ${i + 1} 업데이트 실패:`, error.message)
    }
  }
  
  // 아티클 업데이트
  const articleImages = uploadResults.filter(r => r && r.folderName === 'articles')
  for (let i = 0; i < articleImages.length && i < 6; i++) {
    const { error } = await supabase
      .from('kmong_12_articles')
      .update({ image_url: articleImages[i].publicUrl })
      .eq('order_index', i + 1)
    
    if (!error) {
      console.log(`✅ Article ${i + 1} 이미지 URL 업데이트: ${articleImages[i].publicUrl}`)
    } else {
      console.log(`❌ Article ${i + 1} 업데이트 실패:`, error.message)
    }
  }
  
  // 사이트 설정 업데이트 (로고)
  const logoImage = uploadResults.find(r => r && r.newFileName === 'logo.svg')
  if (logoImage) {
    // 로고 설정이 없으면 추가
    const { data: existing } = await supabase
      .from('kmong_12_site_settings')
      .select('*')
      .eq('setting_key', 'logo_url')
      .single()
    
    if (existing) {
      const { error } = await supabase
        .from('kmong_12_site_settings')
        .update({ setting_value: logoImage.publicUrl })
        .eq('setting_key', 'logo_url')
      
      if (!error) {
        console.log(`✅ 로고 이미지 URL 업데이트: ${logoImage.publicUrl}`)
      }
    } else {
      const { error } = await supabase
        .from('kmong_12_site_settings')
        .insert({ 
          setting_key: 'logo_url',
          setting_value: logoImage.publicUrl,
          setting_type: 'text'
        })
      
      if (!error) {
        console.log(`✅ 로고 이미지 설정 추가: ${logoImage.publicUrl}`)
      }
    }
  }
  
  // 기타 이미지 URL 정보 출력
  const miscImages = uploadResults.filter(r => r && r.folderName === 'misc' && r.newFileName !== 'logo.svg')
  if (miscImages.length > 0) {
    console.log('\n📌 기타 이미지 URL (코드에서 직접 사용):')
    miscImages.forEach(img => {
      console.log(`  - ${img.newFileName}: ${img.publicUrl}`)
    })
  }
}

async function main() {
  console.log('🚀 이미지 업로드 시작...\n')
  
  // 모든 이미지 업로드
  const uploadPromises = Object.entries(imageMapping).map(([original, newName]) => 
    uploadImage(original, newName)
  )
  const results = await Promise.all(uploadPromises)
  
  // 성공한 업로드만 필터링
  const successfulUploads = results.filter(r => r !== null)
  
  console.log(`\n📊 업로드 결과: ${successfulUploads.length}/${Object.keys(imageMapping).length} 성공\n`)
  
  // 데이터베이스 업데이트
  if (successfulUploads.length > 0) {
    await updateDatabase(successfulUploads)
  }
  
  // 메인 페이지에서 사용할 정적 이미지 URL 출력
  console.log('\n📄 메인 페이지 정적 이미지 경로 업데이트 필요:')
  console.log('  - /hero-bottom-bg.png → ' + successfulUploads.find(r => r?.newFileName === 'hero-bottom-bg.png')?.publicUrl)
  console.log('  - /footer-goguma.webp → ' + successfulUploads.find(r => r?.newFileName === 'footer-goguma.webp')?.publicUrl)
  console.log('  - /broken-goguma.webp → ' + successfulUploads.find(r => r?.newFileName === 'broken-goguma.webp')?.publicUrl)
  console.log('  - /read-now.webp → ' + successfulUploads.find(r => r?.newFileName === 'read-now.webp')?.publicUrl)
  
  console.log('\n✨ 작업 완료!')
}

// 실행
main().catch(console.error)