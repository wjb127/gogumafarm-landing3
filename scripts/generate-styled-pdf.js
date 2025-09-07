const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateStyledPDF() {
  console.log('🎨 스타일이 적용된 PDF 생성을 시작합니다...');
  
  try {
    // Markdown을 HTML로 변환한 스타일 문서
    const styledMarkdown = fs.readFileSync(path.join(__dirname, '../docs/DASHBOARD_USER_GUIDE_STYLED.md'), 'utf8');
    
    // HTML 템플릿 생성
    const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>고구마팜 관리자 대시보드 사용 가이드</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.8;
      color: #333;
      background: #fff;
      padding: 40px;
    }
    
    h1 {
      color: #FF6B6B;
      font-size: 36px;
      margin: 30px 0;
      padding-bottom: 15px;
      border-bottom: 3px solid #FF6B6B;
    }
    
    h2 {
      color: #4ECDC4;
      font-size: 28px;
      margin: 25px 0 15px;
    }
    
    h3 {
      color: #764ba2;
      font-size: 22px;
      margin: 20px 0 10px;
    }
    
    h4 {
      color: #667eea;
      font-size: 18px;
      margin: 15px 0 10px;
    }
    
    p {
      margin: 12px 0;
      text-align: justify;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #eee;
    }
    
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    tr:hover {
      background: #f0f0f0;
    }
    
    code {
      background: #f4f4f4;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Consolas', monospace;
      color: #e83e8c;
    }
    
    pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 20px 0;
    }
    
    blockquote {
      border-left: 4px solid #FF6B6B;
      padding-left: 20px;
      margin: 20px 0;
      font-style: italic;
      color: #666;
      background: #fff5f5;
      padding: 15px 20px;
    }
    
    ul, ol {
      margin: 15px 0 15px 30px;
    }
    
    li {
      margin: 8px 0;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      margin: 30px 0;
    }
    
    .highlight-box h2, .highlight-box h3 {
      color: white;
      margin-top: 0;
    }
    
    .warning-box {
      background: #FFF3CD;
      border: 2px solid #FFC107;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .info-box {
      background: #E3F2FD;
      border: 2px solid #2196F3;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .success-box {
      background: #E8F5E9;
      border: 2px solid #4CAF50;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .step-number {
      background: #FF6B6B;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 15px;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    
    .feature-card {
      background: white;
      border: 2px solid #4ECDC4;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      transition: transform 0.3s;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    
    .emoji-large {
      font-size: 48px;
      margin: 10px 0;
    }
    
    hr {
      border: none;
      height: 2px;
      background: linear-gradient(to right, #FF6B6B, #4ECDC4);
      margin: 40px 0;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .highlight-box {
        page-break-inside: avoid;
      }
      
      table {
        page-break-inside: avoid;
      }
      
      h1, h2, h3 {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="highlight-box" style="text-align: center; padding: 60px 30px;">
    <h1 style="color: white; font-size: 48px; border: none;">🍠 고구마팜</h1>
    <h2 style="color: white; font-size: 32px;">관리자 대시보드 사용 가이드</h2>
    <p style="font-size: 18px; margin-top: 20px;">Version 1.0.0 | 2025년 1월</p>
  </div>
  
  <h1>📋 목차</h1>
  <ol>
    <li><a href="#start">시작하기</a></li>
    <li><a href="#dashboard">대시보드 둘러보기</a></li>
    <li><a href="#carousel">메인 캐러셀 관리</a></li>
    <li><a href="#articles">아티클 관리</a></li>
    <li><a href="#news">뉴스클리핑 관리</a></li>
    <li><a href="#top10">TOP 10 관리</a></li>
    <li><a href="#settings">사이트 설정</a></li>
    <li><a href="#troubleshooting">문제 해결</a></li>
    <li><a href="#support">지원 및 문의</a></li>
  </ol>
  
  <hr>
  
  <h1 id="start">🚀 시작하기</h1>
  
  <div class="info-box">
    <h3>📍 접속 주소</h3>
    <code style="font-size: 18px;">https://your-domain.com/admin</code>
  </div>
  
  <h2>로그인 절차</h2>
  
  <div class="feature-grid">
    <div class="feature-card">
      <div class="step-number">1</div>
      <h4>관리자 페이지 접속</h4>
      <p>/admin URL로 이동</p>
    </div>
    <div class="feature-card">
      <div class="step-number" style="background: #4ECDC4;">2</div>
      <h4>비밀번호 입력</h4>
      <p>gogumafarm_2025!</p>
    </div>
    <div class="feature-card">
      <div class="step-number" style="background: #95E1D3;">3</div>
      <h4>로그인 완료</h4>
      <p>대시보드 진입</p>
    </div>
  </div>
  
  <div class="warning-box">
    <h4>⚠️ 보안 주의사항</h4>
    <ul>
      <li>비밀번호를 타인과 공유하지 마세요</li>
      <li>공용 PC 사용 후 반드시 로그아웃</li>
      <li>3개월마다 비밀번호 변경 권장</li>
    </ul>
  </div>
  
  <hr>
  
  <h1 id="dashboard">📊 대시보드 둘러보기</h1>
  
  <h2>메인 대시보드 구성요소</h2>
  
  <table>
    <thead>
      <tr>
        <th>구성요소</th>
        <th>설명</th>
        <th>주요 기능</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>📊 통계 카드</strong></td>
        <td>콘텐츠 현황 요약</td>
        <td>실시간 통계 확인</td>
      </tr>
      <tr>
        <td><strong>⚡ 빠른 실행</strong></td>
        <td>자주 사용하는 기능</td>
        <td>원클릭 실행</td>
      </tr>
      <tr>
        <td><strong>📝 최근 활동</strong></td>
        <td>변경 이력</td>
        <td>활동 추적</td>
      </tr>
      <tr>
        <td><strong>📂 사이드바</strong></td>
        <td>전체 메뉴</td>
        <td>페이지 네비게이션</td>
      </tr>
    </tbody>
  </table>
  
  <hr>
  
  <h1 id="carousel">🎠 메인 캐러셀 관리</h1>
  
  <div class="highlight-box">
    <h3>메인 페이지의 얼굴</h3>
    <p>방문자가 가장 먼저 보는 대형 슬라이드로, 브랜드의 첫인상을 결정합니다.</p>
  </div>
  
  <h2>슬라이드 추가 방법</h2>
  
  <ol>
    <li><span class="step-number">1</span> 메인 캐러셀 메뉴 클릭</li>
    <li><span class="step-number">2</span> "새 콘텐츠 추가" 버튼 클릭</li>
    <li><span class="step-number">3</span> 필수 정보 입력
      <ul>
        <li>제목 (최대 100자)</li>
        <li>설명 (최대 200자)</li>
        <li>이미지 URL</li>
        <li>링크 URL</li>
      </ul>
    </li>
    <li><span class="step-number">4</span> 저장 버튼 클릭</li>
  </ol>
  
  <div class="success-box">
    <h4>✨ 프로 팁</h4>
    <ul>
      <li>이미지는 1920x1080 해상도 권장</li>
      <li>파일 크기는 500KB 이하로 최적화</li>
      <li>모바일 화면도 고려한 텍스트 배치</li>
    </ul>
  </div>
  
  <hr>
  
  <h1 id="articles">📝 아티클 관리</h1>
  
  <h2>아티클 작성 체크리스트</h2>
  
  <table>
    <thead>
      <tr>
        <th>항목</th>
        <th>권장사항</th>
        <th>체크</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>제목</td>
        <td>40-60자, 키워드 포함</td>
        <td>☐</td>
      </tr>
      <tr>
        <td>요약</td>
        <td>120-150자, 핵심 내용</td>
        <td>☐</td>
      </tr>
      <tr>
        <td>본문</td>
        <td>1500-3000자, 단락 구분</td>
        <td>☐</td>
      </tr>
      <tr>
        <td>썸네일</td>
        <td>1200x630px, 고화질</td>
        <td>☐</td>
      </tr>
      <tr>
        <td>태그</td>
        <td>3-5개, 관련 키워드</td>
        <td>☐</td>
      </tr>
    </tbody>
  </table>
  
  <hr>
  
  <h1 id="news">📰 뉴스클리핑 관리</h1>
  
  <div class="feature-grid">
    <div class="feature-card">
      <div class="emoji-large">📐</div>
      <h4>권장 크기</h4>
      <p><strong>800x600</strong> 픽셀</p>
    </div>
    <div class="feature-card">
      <div class="emoji-large">📁</div>
      <h4>파일 크기</h4>
      <p><strong>&lt; 500KB</strong> 권장</p>
    </div>
    <div class="feature-card">
      <div class="emoji-large">🎨</div>
      <h4>파일 형식</h4>
      <p><strong>JPG/PNG</strong> WebP 권장</p>
    </div>
  </div>
  
  <hr>
  
  <h1 id="top10">🏆 TOP 10 관리</h1>
  
  <h2>순위 변경 방법</h2>
  
  <div class="info-box">
    <h4>두 가지 방법으로 순위를 변경할 수 있습니다</h4>
    <ol>
      <li><strong>드래그 앤 드롭:</strong> 마우스로 항목을 끌어서 이동</li>
      <li><strong>번호 입력:</strong> 순위 필드에 직접 숫자 입력</li>
    </ol>
  </div>
  
  <hr>
  
  <h1 id="settings">⚙️ 사이트 설정</h1>
  
  <h2>URL 관리 시스템</h2>
  
  <table>
    <thead>
      <tr>
        <th>URL 타입</th>
        <th>형식</th>
        <th>예시</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>외부 링크</td>
        <td><code>https://</code></td>
        <td><code>https://example.com</code></td>
      </tr>
      <tr>
        <td>내부 링크</td>
        <td><code>/</code>로 시작</td>
        <td><code>/articles/123</code></td>
      </tr>
      <tr>
        <td>이메일</td>
        <td><code>mailto:</code></td>
        <td><code>mailto:info@site.com</code></td>
      </tr>
      <tr>
        <td>앵커</td>
        <td><code>#</code></td>
        <td><code>#section-1</code></td>
      </tr>
    </tbody>
  </table>
  
  <hr>
  
  <h1 id="troubleshooting">🚨 문제 해결</h1>
  
  <h2>자주 발생하는 문제</h2>
  
  <div class="warning-box">
    <h4>🔧 로그인이 계속 풀려요</h4>
    <p><strong>원인:</strong> 보안을 위한 세션 타임아웃</p>
    <p><strong>해결:</strong> 정상적인 동작입니다. 재로그인하세요.</p>
  </div>
  
  <div class="warning-box">
    <h4>🔧 이미지가 표시되지 않아요</h4>
    <p><strong>원인:</strong> 잘못된 URL 또는 CORS 정책</p>
    <p><strong>해결:</strong> HTTPS URL 사용, 이미지 호스팅 서비스 활용</p>
  </div>
  
  <div class="warning-box">
    <h4>🔧 저장이 되지 않아요</h4>
    <p><strong>원인:</strong> 네트워크 오류 또는 필수 필드 누락</p>
    <p><strong>해결:</strong> 모든 필수 필드 확인, 네트워크 연결 확인</p>
  </div>
  
  <hr>
  
  <h1 id="support">📞 지원 및 문의</h1>
  
  <div class="highlight-box" style="text-align: center;">
    <h2>도움이 필요하신가요?</h2>
    <div class="feature-grid" style="margin-top: 30px;">
      <div style="color: white;">
        <h3>📧 이메일</h3>
        <p style="font-size: 18px;">admin@gogumafarm.com</p>
      </div>
      <div style="color: white;">
        <h3>📞 전화</h3>
        <p style="font-size: 18px;">070-7825-0749</p>
      </div>
      <div style="color: white;">
        <h3>⏰ 업무시간</h3>
        <p style="font-size: 18px;">평일 09:00-18:00</p>
      </div>
    </div>
  </div>
  
  <hr>
  
  <div class="highlight-box" style="text-align: center; margin-top: 50px;">
    <h2 style="color: white;">감사합니다! 🙏</h2>
    <p>고구마팜 관리자 대시보드와 함께 더 나은 콘텐츠를 만들어가세요!</p>
    <p style="margin-top: 20px; opacity: 0.9;">
      Version 1.0.0 | 2025년 1월<br>
      © 2025 고구마팜. All rights reserved.
    </p>
  </div>
</body>
</html>
    `;
    
    // Puppeteer 브라우저 실행
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // HTML 콘텐츠 설정
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    // PDF 생성 옵션
    const pdfOptions = {
      path: path.join(__dirname, '../docs/DASHBOARD_USER_GUIDE_STYLED.pdf'),
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 9px; width: 100%; text-align: center; color: #999; padding-top: 5mm;">
          고구마팜 관리자 대시보드 사용 가이드
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 9px; width: 100%; text-align: center; color: #999; padding-bottom: 5mm;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    };
    
    // PDF 생성
    await page.pdf(pdfOptions);
    
    await browser.close();
    
    console.log('✅ 스타일이 적용된 PDF 파일이 성공적으로 생성되었습니다!');
    console.log('📍 경로: docs/DASHBOARD_USER_GUIDE_STYLED.pdf');
    
  } catch (error) {
    console.error('❌ PDF 생성 중 오류 발생:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
generateStyledPDF();