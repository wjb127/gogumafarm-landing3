# 고구마팜 Admin Panel 구현 가이드
> 프로급 풀스택 관리자 대시보드 구현 문서

## 🎯 목표
- **URL**: `/admin`
- **비밀번호**: `gogumafarm_2025!`
- **목표**: Sanity/Strapi 같은 상용 CMS 수준의 UX/UI 제공

---

## 📋 구현 작업 목록 (우선순위 순)

### Phase 1: 기초 인프라 구축

#### 1.1 데이터베이스 설정
```bash
# 필요한 패키지 설치
npm install @prisma/client prisma
npm install @supabase/supabase-js  # 또는 다른 DB
```

**작업 내용**:
- [ ] Supabase/Planetscale/Neon 중 DB 선택 및 계정 생성
- [ ] Prisma 스키마 정의
- [ ] 데이터베이스 연결 설정

**Prisma Schema (schema.prisma)**:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model HeroContent {
  id        String   @id @default(cuid())
  image     String
  title     String   @db.Text
  badges    Json     // [{text: "SNS", className: "badge-purple"}]
  order     Int
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Article {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  image       String
  badges      Json
  date        DateTime
  featured    Boolean  @default(false)
  category    String
  slug        String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model NewsClipping {
  id        String   @id @default(cuid())
  image     String
  title     String?
  order     Int
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Top10Item {
  id        String   @id @default(cuid())
  title     String   @db.Text
  order     Int
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SiteSettings {
  id              String   @id @default(cuid())
  siteName        String
  siteDescription String?
  logo            String?
  socialLinks     Json     // {instagram: "", newsletter: ""}
  analytics       Json     // {googleId: "", vercelId: ""}
  updatedAt       DateTime @updatedAt
}
```

---

#### 1.2 인증 시스템
```bash
# 필요한 패키지
npm install next-auth @auth/prisma-adapter
npm install bcryptjs @types/bcryptjs
npm install iron-session  # 대안: 더 간단한 세션 관리
```

**작업 내용**:
- [ ] NextAuth 설정 또는 자체 인증 구현
- [ ] 로그인 페이지 UI
- [ ] 세션 관리
- [ ] 보안 미들웨어

**API Routes 필요**:
- `/api/auth/login` - 로그인 처리
- `/api/auth/logout` - 로그아웃
- `/api/auth/session` - 세션 확인

---

### Phase 2: Admin UI/UX 구축

#### 2.1 Admin 레이아웃
```bash
# 필요한 패키지
npm install @tremor/react  # 대시보드 차트
npm install react-hot-toast  # 알림 토스트
npm install @tanstack/react-table  # 테이블 컴포넌트
npm install react-hook-form zod  # 폼 관리
```

**작업 내용**:
- [ ] Admin 레이아웃 컴포넌트
- [ ] 사이드바 네비게이션
- [ ] 헤더 with 로그아웃
- [ ] 대시보드 홈 (통계)

**페이지 구조**:
```
/admin
  ├── /dashboard (대시보드)
  ├── /hero (메인 캐러셀 관리)
  ├── /articles (아티클 관리)
  ├── /news (뉴스클리핑 관리)
  ├── /top10 (TOP 10 관리)
  ├── /settings (사이트 설정)
  └── /analytics (방문자 통계)
```

---

#### 2.2 컴포넌트 라이브러리

**고급 컴포넌트 필요 목록**:
```typescript
// 1. DataTable 컴포넌트
interface DataTableProps {
  columns: ColumnDef[]
  data: any[]
  searchable?: boolean
  sortable?: boolean
  pagination?: boolean
  actions?: ActionButtons[]
}

// 2. ImageUploader 컴포넌트
interface ImageUploaderProps {
  onUpload: (url: string) => void
  preview?: boolean
  multiple?: boolean
  maxSize?: number
}

// 3. RichTextEditor 컴포넌트
interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  toolbar?: ToolbarOptions[]
}

// 4. DragDropList 컴포넌트
interface DragDropListProps {
  items: any[]
  onReorder: (items: any[]) => void
  renderItem: (item: any) => ReactNode
}
```

---

### Phase 3: CRUD 기능 구현

#### 3.1 API Routes 구조

**필요한 API 엔드포인트**:

```typescript
// Hero Content Management
GET    /api/admin/hero          // 리스트 조회
POST   /api/admin/hero          // 새 콘텐츠 추가
PUT    /api/admin/hero/[id]     // 수정
DELETE /api/admin/hero/[id]     // 삭제
PUT    /api/admin/hero/reorder  // 순서 변경

// Articles Management
GET    /api/admin/articles      // 리스트 조회 (페이지네이션)
POST   /api/admin/articles      // 새 아티클 추가
PUT    /api/admin/articles/[id] // 수정
DELETE /api/admin/articles/[id] // 삭제
PUT    /api/admin/articles/[id]/feature // 메인 노출 설정

// News Clipping
GET    /api/admin/news
POST   /api/admin/news
PUT    /api/admin/news/[id]
DELETE /api/admin/news/[id]
PUT    /api/admin/news/reorder

// TOP 10
GET    /api/admin/top10
POST   /api/admin/top10
PUT    /api/admin/top10/[id]
DELETE /api/admin/top10/[id]
PUT    /api/admin/top10/reorder

// Site Settings
GET    /api/admin/settings
PUT    /api/admin/settings

// Analytics
GET    /api/admin/analytics/overview
GET    /api/admin/analytics/visitors
GET    /api/admin/analytics/content
```

---

#### 3.2 이미지 업로드 시스템

**옵션 1: Cloudinary**
```bash
npm install cloudinary multer
```

**옵션 2: Vercel Blob**
```bash
npm install @vercel/blob
```

**옵션 3: Supabase Storage**
```bash
# Supabase 사용시 자동 포함
```

**구현 필요**:
- [ ] 이미지 업로드 API
- [ ] 이미지 압축/리사이징
- [ ] 드래그앤드롭 UI
- [ ] 업로드 진행률 표시

---

### Phase 4: 고급 기능

#### 4.1 실시간 프리뷰
```typescript
// 실시간 프리뷰 시스템
interface PreviewSystemProps {
  // iframe으로 메인 사이트 표시
  // postMessage로 데이터 전송
  // 실시간 업데이트
}
```

**작업 내용**:
- [ ] Split view (편집기 + 프리뷰)
- [ ] 실시간 데이터 동기화
- [ ] 반응형 프리뷰 (모바일/태블릿/데스크톱)

---

#### 4.2 버전 관리 & 히스토리
```typescript
model ContentHistory {
  id          String   @id @default(cuid())
  contentType String   // 'hero', 'article', etc.
  contentId   String
  data        Json     // 이전 버전 데이터
  changedBy   String   // User ID
  createdAt   DateTime @default(now())
}
```

**작업 내용**:
- [ ] 변경 이력 저장
- [ ] 롤백 기능
- [ ] 변경사항 비교 (diff view)

---

#### 4.3 검색 & 필터링
**고급 검색 기능**:
- [ ] 전체 텍스트 검색
- [ ] 다중 필터 (날짜, 카테고리, 상태)
- [ ] 검색 결과 하이라이팅
- [ ] 검색 히스토리

---

#### 4.4 대시보드 위젯
```typescript
// 대시보드에 표시할 위젯들
interface DashboardWidgets {
  visitorsToday: number
  totalArticles: number
  weeklyGrowth: percentage
  popularContent: Article[]
  recentChanges: History[]
  systemHealth: Status
}
```

---

### Phase 5: 성능 최적화

#### 5.1 캐싱 전략
```bash
npm install @vercel/kv  # Redis 캐싱
# 또는
npm install lru-cache  # 메모리 캐싱
```

**구현 내용**:
- [ ] API 응답 캐싱
- [ ] 이미지 CDN 최적화
- [ ] 정적 생성 (ISR) 활용
- [ ] 데이터베이스 쿼리 최적화

---

#### 5.2 보안 강화
```bash
npm install helmet  # 보안 헤더
npm install express-rate-limit  # Rate limiting
npm install joi  # 입력 검증
```

**보안 체크리스트**:
- [ ] CSRF 토큰
- [ ] XSS 방지
- [ ] SQL Injection 방지
- [ ] Rate Limiting
- [ ] 입력 데이터 검증
- [ ] 파일 업로드 검증

---

### Phase 6: UX 개선

#### 6.1 토스트 알림 시스템
```typescript
// 모든 액션에 대한 피드백
toast.success('저장되었습니다')
toast.error('오류가 발생했습니다')
toast.loading('처리 중...')
```

#### 6.2 단축키 시스템
```typescript
// 키보드 단축키
Cmd+S: 저장
Cmd+Z: 실행취소
Cmd+Shift+P: 프리뷰
Esc: 취소/닫기
```

#### 6.3 자동 저장
```typescript
// 5초마다 자동 저장
// localStorage 임시 저장
// 충돌 감지 및 해결
```

---

## 🚀 구현 순서 (추천)

### Week 1: 기초
1. **Day 1-2**: DB 설정 + Prisma 스키마
2. **Day 3-4**: 인증 시스템 + 로그인 페이지
3. **Day 5-7**: Admin 레이아웃 + 네비게이션

### Week 2: CRUD
1. **Day 8-9**: Hero 콘텐츠 관리
2. **Day 10-11**: Articles 관리
3. **Day 12-14**: News & TOP10 관리

### Week 3: 고급 기능
1. **Day 15-16**: 이미지 업로드 시스템
2. **Day 17-18**: 실시간 프리뷰
3. **Day 19-21**: 대시보드 & 통계

### Week 4: 마무리
1. **Day 22-23**: 성능 최적화
2. **Day 24-25**: 보안 강화
3. **Day 26-28**: 테스트 & 버그 수정

---

## 📦 전체 패키지 리스트

```json
{
  "dependencies": {
    // Database & ORM
    "@prisma/client": "latest",
    "prisma": "latest",
    
    // Authentication
    "next-auth": "latest",
    "bcryptjs": "latest",
    
    // UI Components
    "@tremor/react": "latest",
    "@tanstack/react-table": "latest",
    "react-hot-toast": "latest",
    "react-hook-form": "latest",
    "zod": "latest",
    
    // Editor
    "@tiptap/react": "latest",
    "@tiptap/starter-kit": "latest",
    
    // File Upload
    "@vercel/blob": "latest",
    "react-dropzone": "latest",
    
    // Utils
    "date-fns": "latest",
    "clsx": "latest",
    "slugify": "latest"
  }
}
```

---

## 💡 다음 단계

이 문서를 참고하여 단계별로 구현을 요청해 주세요. 
예시: "Phase 1.1 데이터베이스 설정부터 시작하자"

각 단계마다 상세한 코드와 함께 구현해드리겠습니다!