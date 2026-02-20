# Jangs 리빙 배포 체크리스트

## 📋 배포 전 확인사항

### 코드 품질

- [ ] `npm run check-all` 통과
  - TypeScript 타입 체크
  - ESLint 검사
  - Prettier 포맷 확인
- [ ] `npm run build` 성공
- [ ] 빌드 output 크기 확인 (번들 사이즈)

### 환경 변수 설정

- [ ] 필수 환경 변수 설정 완료:
  - [ ] `NOTION_API_KEY` (`secret_` 또는 `ntn_`로 시작)
  - [ ] `NOTION_DATABASE_ID` (32자 ID)
  - [ ] `NEXT_PUBLIC_BASE_URL` (프로덕션 도메인, 예: `https://jangsliving.vercel.app`)
- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있음
- [ ] 민감한 정보가 코드에 하드코딩되지 않음

### 보안 점검

- [ ] Notion API Key가 Notion Integration에서 발급한 키인지 확인
- [ ] Notion 데이터베이스에 Integration 연결 확인
- [ ] `logger.ts`가 프로덕션에서 JSON 형식으로 로그 출력하는지 확인

---

## 🚀 Vercel 배포

### 1. Vercel 계정 설정

1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. "Add New" → "Project" 클릭

### 2. 프로젝트 Import

1. GitHub 저장소 선택 (notion-cms-project)
2. "Import" 클릭
3. 프로젝트 이름 설정 (예: `jangsliving`)

### 3. 환경 변수 설정

**Vercel Dashboard → Settings → Environment Variables**에서 다음 변수 추가:

#### Production 환경

```bash
# Notion API
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 애플리케이션 URL
NEXT_PUBLIC_BASE_URL=https://jangsliving.vercel.app

# Next.js 환경 (Vercel 자동 설정)
NODE_ENV=production
```

#### Preview 환경 (선택사항)

- Production과 동일한 환경 변수 설정
- 또는 별도의 테스트 Notion 데이터베이스 사용

### 4. 배포 실행

1. "Deploy" 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 대기 (약 2-3분)

### 5. 도메인 설정 (선택사항)

1. Vercel Dashboard → Settings → Domains
2. "Add" 클릭
3. 커스텀 도메인 입력
4. DNS 설정 업데이트

---

## ✅ 배포 후 확인

### 기능 테스트 (Happy Path)

- [ ] 홈 페이지 Dashboard 정상 로드
  - URL: `https://your-domain.vercel.app`
  - 히어로 배너, 카테고리 그리드, BEST 상품 섹션 표시 확인
- [ ] Notion 실제 데이터 정상 표시
  - 카테고리별 상품 목록 표시
  - 상품 이미지, 가격, 할인율 표시
- [ ] 카테고리 클릭 → 카테고리 페이지 상품 목록 표시
  - 8개 카테고리 (가구/인테리어, 생활/건강, 패션잡화, 화장품/미용, 디지털/가전, 출산/육아, 스포츠/레저, 패션의류)
- [ ] 상품 카드 클릭 → 상품 상세 페이지 정상 표시
  - 상품명, 이미지, 가격/할인 정보, 배송 정보 표시
- [ ] '네이버에서 구매하기' 버튼 클릭 → 스마트스토어 새 탭 이동
  - URL: https://smartstore.naver.com/jangsliving
- [ ] 검색 기능 정상 동작
  - 홈 페이지 검색바에서 검색어 입력 → 카테고리 페이지로 이동
  - 카테고리 페이지 내 검색 필터링 동작
- [ ] 정렬 기능 정상 동작
  - 최신순 / 가격 낮은순 / 가격 높은순 / 할인율순

### 에러 시나리오 테스트

- [ ] 존재하지 않는 상품 ID 접근 → 404 페이지 정상 표시
  - URL: `/product/nonexistent-id`
  - 메시지: "요청하신 상품이 존재하지 않거나 삭제되었습니다."
- [ ] 존재하지 않는 카테고리 slug 접근 → 404 페이지 정상 표시
  - URL: `/category/nonexistent-slug`

### Vercel Analytics 확인

- [ ] Vercel Dashboard → Analytics 탭에서 페이지뷰 수집 확인
- [ ] 실시간 트래픽 모니터링 정상 동작

---

## 🎨 성능 및 품질 확인

### Lighthouse 점수

- [ ] Performance: ≥ 90
- [ ] Accessibility: ≥ 90
- [ ] Best Practices: ≥ 90
- [ ] SEO: ≥ 90

### Core Web Vitals

- [ ] LCP (Largest Contentful Paint): < 2.5초
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1

### SEO 확인

- [ ] `/sitemap.xml` 정상 응답 (카테고리 + 상품 URL 포함)
- [ ] `/robots.txt` 정상 응답
- [ ] 상품 상세 페이지 JSON-LD (Product 스키마) 적용 확인
- [ ] 카테고리 페이지 JSON-LD (BreadcrumbList 스키마) 적용 확인

---

## 📱 반응형 & 크로스 브라우저

### 반응형 테스트

- [ ] 모바일(375px): 햄버거 메뉴, 2열 상품 그리드
- [ ] 태블릿(768px): 3열 상품 그리드
- [ ] 데스크톱(1280px): 4열 상품 그리드, 데스크톱 네비게이션

### 브라우저 호환성

- [ ] Chrome 최신 버전
- [ ] Firefox 최신 버전
- [ ] Edge 최신 버전 (가능 시)
- [ ] 모바일 Safari (iOS) (가능 시)
- [ ] 모바일 Chrome (Android) (가능 시)

---

## 🔄 업데이트 배포

### 자동 배포

- `main` 브랜치에 push 시 자동 배포
- Pull Request 생성 시 Preview 배포

### 수동 배포

1. Vercel Dashboard → Deployments
2. "Redeploy" 버튼 클릭

---

## 🐛 문제 해결

### 배포 실패

**증상**: 빌드 에러 발생

**해결방법**:

1. Vercel 빌드 로그 확인
2. 환경 변수 누락 확인 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
3. 로컬에서 `npm run build` 테스트

### 환경 변수 오류

**증상**: "NOTION_API_KEY는 필수입니다" 에러

**해결방법**:

1. Vercel Dashboard → Settings → Environment Variables
2. `NOTION_API_KEY`, `NOTION_DATABASE_ID` 설정 확인
3. "Redeploy" 실행

### Notion 연동 실패

**증상**: 상품 목록이 표시되지 않음

**해결방법**:

1. Notion Integration 권한 확인
2. 데이터베이스에 Integration 연결 확인
3. `NOTION_DATABASE_ID` 정확성 확인 (32자 확인)
4. `withRetry` 재시도 로직: 최대 3회, 지수 백오프

### ISR 캐시 문제

**증상**: 최신 데이터가 반영되지 않음

**해결방법**:

1. Vercel Dashboard → Deployments → "Invalidate Cache"
2. 또는 코드 변경 후 재배포 (캐시 자동 갱신)
3. ISR 재검증 주기 확인 (HOME: 300초, CATEGORY: 180초, PRODUCT: 60초)

---

## 📊 배포 후 모니터링

### Vercel Analytics

1. Vercel Dashboard → Analytics 활성화
2. 실시간 트래픽 모니터링
3. 성능 메트릭 확인

### 에러 모니터링

1. Vercel Dashboard → Logs 확인
2. 런타임 에러 모니터링
3. Notion API 실패 로그 확인 (`logger.ts` 구조화 로그)

---

## 📝 배포 기록

| 날짜       | 버전 | 변경사항      | 배포자 |
| ---------- | ---- | ------------- | ------ |
| 2026-02-20 | v1.0 | MVP 초기 배포 | -      |

---

## 📞 참고 링크

- Vercel 공식 문서: https://vercel.com/docs
- Next.js 공식 문서: https://nextjs.org/docs
- Notion API 문서: https://developers.notion.com
- 스마트스토어 URL: https://smartstore.naver.com/jangsliving
