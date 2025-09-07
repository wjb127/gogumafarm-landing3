const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  console.log('📄 PDF 생성을 시작합니다...');
  
  try {
    // HTML 파일 경로
    const htmlPath = path.join(__dirname, '../docs/DASHBOARD_USER_GUIDE.html');
    
    // HTML 파일이 존재하는지 확인
    if (!fs.existsSync(htmlPath)) {
      throw new Error('HTML 파일을 찾을 수 없습니다.');
    }
    
    // Puppeteer 브라우저 실행
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // HTML 파일 로드
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    // PDF 생성 옵션
    const pdfOptions = {
      path: path.join(__dirname, '../docs/DASHBOARD_USER_GUIDE.pdf'),
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; width: 100%; text-align: center; color: #666;">
          고구마팜 관리자 대시보드 사용 가이드
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; width: 100%; text-align: center; color: #666;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    };
    
    // PDF 생성
    await page.pdf(pdfOptions);
    
    await browser.close();
    
    console.log('✅ PDF 파일이 성공적으로 생성되었습니다!');
    console.log('📍 경로: docs/DASHBOARD_USER_GUIDE.pdf');
    
  } catch (error) {
    console.error('❌ PDF 생성 중 오류 발생:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
generatePDF();