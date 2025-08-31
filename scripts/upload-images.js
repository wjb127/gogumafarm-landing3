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

// 업로드할 이미지 목록 (현재 사용 중인 이미지들)
const imagesToUpload = [
  // Hero 이미지
  'youtube-content-1.png',
  'youtube-content-2.jpg',
  'youtube-content-3.jpg',
  
  // 뉴스 클리핑 이미지
  '0812.png',
  '0813_new.png',
  '0814.png',
  '0818.png',
  '0819.png',
  '0820.png',
  '0821.png',
  '0822.png',
  
  // 아티클 이미지
  '고구마팜썸네일-0822-700x401.jpg',
  '고구마팜-말랭이썸네일_250821-700x400.jpg',
  '고구마팜썸네일-0820-700x401.png',
  '고구마팜-시니어는-이렇게-삽니다_대지-1-사본-700x400.png',
  '고구마팜-말랭이썸네일_250819-01-700x400.jpg',
  '고구마팜-말랭이썸네일_250814-700x400.png',
  
  // 기타 필요한 이미지
  'hero-bottom-bg.png',
  'footer-goguma.webp',
  'broken-goguma.webp',
  'read-now.webp',
  'logo-1.svg'
]

async function uploadImage(fileName) {
  try {
    const filePath = path.join(__dirname, '../public', fileName)
    
    // 파일이 존재하는지 확인
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  파일을 찾을 수 없음: ${fileName}`)
      return null
    }
    
    const fileData = fs.readFileSync(filePath)
    const fileExt = path.extname(fileName)
    const folderName = fileName.includes('youtube') ? 'hero' : 
                       fileName.match(/^\d+/) ? 'news' : 
                       fileName.includes('고구마팜') ? 'articles' : 'misc'
    
    const uploadPath = `${folderName}/${fileName}`
    
    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(uploadPath, fileData, {
        contentType: getContentType(fileExt),
        upsert: true // 이미 존재하면 덮어쓰기
      })
    
    if (error) {
      console.error(`❌ 업로드 실패 ${fileName}:`, error.message)
      return null
    }
    
    // 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(uploadPath)
    
    console.log(`✅ 업로드 성공: ${fileName} → ${publicUrl}`)
    return { fileName, publicUrl, uploadPath }
    
  } catch (error) {
    console.error(`❌ 오류 ${fileName}:`, error.message)
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
  const heroImages = uploadResults.filter(r => r && r.fileName.includes('youtube'))
  if (heroImages.length > 0) {
    for (let i = 0; i < heroImages.length; i++) {
      const { error } = await supabase
        .from('kmong_12_hero_contents')
        .update({ image_url: heroImages[i].publicUrl })
        .eq('order_index', i + 1)
      
      if (!error) {
        console.log(`✅ Hero ${i + 1} 이미지 URL 업데이트`)
      }
    }
  }
  
  // 뉴스 클리핑 업데이트
  const newsImages = uploadResults.filter(r => r && r.fileName.match(/^\d+/))
  if (newsImages.length > 0) {
    for (let i = 0; i < newsImages.length; i++) {
      const { error } = await supabase
        .from('kmong_12_news_clippings')
        .update({ image_url: newsImages[i].publicUrl })
        .eq('order_index', i + 1)
      
      if (!error) {
        console.log(`✅ News ${i + 1} 이미지 URL 업데이트`)
      }
    }
  }
  
  // 아티클 업데이트
  const articleImages = uploadResults.filter(r => r && r.fileName.includes('고구마팜'))
  if (articleImages.length > 0) {
    for (let i = 0; i < articleImages.length && i < 6; i++) {
      const { error } = await supabase
        .from('kmong_12_articles')
        .update({ image_url: articleImages[i].publicUrl })
        .eq('order_index', i + 1)
      
      if (!error) {
        console.log(`✅ Article ${i + 1} 이미지 URL 업데이트`)
      }
    }
  }
  
  // 사이트 설정 업데이트 (로고)
  const logoImage = uploadResults.find(r => r && r.fileName === 'logo-1.svg')
  if (logoImage) {
    const { error } = await supabase
      .from('kmong_12_site_settings')
      .update({ setting_value: logoImage.publicUrl })
      .eq('setting_key', 'logo_url')
    
    if (!error) {
      console.log(`✅ 로고 이미지 URL 업데이트`)
    }
  }
}

async function main() {
  console.log('🚀 이미지 업로드 시작...\n')
  
  // 모든 이미지 업로드
  const uploadPromises = imagesToUpload.map(fileName => uploadImage(fileName))
  const results = await Promise.all(uploadPromises)
  
  // 성공한 업로드만 필터링
  const successfulUploads = results.filter(r => r !== null)
  
  console.log(`\n📊 업로드 결과: ${successfulUploads.length}/${imagesToUpload.length} 성공\n`)
  
  // 데이터베이스 업데이트
  if (successfulUploads.length > 0) {
    await updateDatabase(successfulUploads)
  }
  
  console.log('\n✨ 작업 완료!')
}

// 실행
main().catch(console.error)