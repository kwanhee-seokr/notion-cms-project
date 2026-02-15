# Jangs 리빙 스마트스토어 홍보 사이트 MVP 개발 로드맵

Notion CMS 기반으로 네이버 스마트스토어 'Jangs 리빙'의 상품을 카테고리별 Dashboard 형태로 홍보하고, 방문자를 스마트스토어 구매 페이지로 유도하는 웹사이트

## 개요

Jangs 리빙 스마트스토어 홍보 사이트는 일반 소비자 및 잠재 고객을 위한 상품 홍보 플랫폼으로 다음 기능을 제공합니다:

- **상품 목록 조회 (F001)**: Notion DB에서 상품 데이터를 가져와 카드 형태로 표시
- **카테고리별 필터링 (F002)**: 8개 카테고리(가구/인테리어, 생활/건강 등)별 상품 분류
- **상품 상세 조회 (F003)**: 이미지, 가격, 할인율, 설명 등 상세 정보 표시
- **스마트스토어 링크 연결 (F004)**: "네이버에서 구매하기" 버튼으로 스마트스토어 이동
- **상품 검색 (F005)**: 상품명 기반 키워드 검색
- **반응형 레이아웃 (F006)**: 모바일/태블릿/데스크톱 대응
- **상품 정렬 (F007)**: 최신순, 가격순, 할인율순 정렬
- **우선 상품 노출 (F008)**: BEST/NEW 태그 상품 우선 표시

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
   - 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **테스트 수행 절차 (3단계)**:
     1. **구현 전**: 테스트 시나리오 작성 (Happy Path, 에러 케이스, 경계값)
     2. **구현 중**: 각 기능 단위 완료 시 Playwright MCP로 즉시 검증
     3. **구현 후**: 전체 E2E 테스트 실행 및 결과를 작업 파일에 기록
   - **테스트 통과가 Task 완료의 필수 조건** — 미통과 시 다음 단계 진행 불가
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 프로젝트 초기 설정 및 환경 구성** - 완료
  - See: `/tasks/001-project-setup.md`
  - Next.js 15.5.3 (App Router + Turbopack) 프로젝트 설정
  - TypeScript 5, TailwindCSS v4, shadcn/ui (new-york style) 구성
  - ESLint + Prettier + Husky + lint-staged 개발 도구 설정
  - 환경 변수 검증 (Zod 기반 env.ts, NOTION_API_KEY, NOTION_DATABASE_ID)
  - @notionhq/client v5 패키지 설치 및 Notion API 클라이언트 초기화

- **Task 002: 라우팅 구조 및 페이지 골격 생성** - 완료
  - See: `/tasks/002-routing-structure.md`
  - App Router 기반 전체 라우트 구조 생성 (/, /category/[slug], /product/[id])
  - 홈 페이지 (page.tsx), 카테고리 페이지, 상품 상세 페이지 골격 생성
  - 카테고리 페이지 error.tsx, loading.tsx 에러 경계 및 로딩 상태 구성
  - 상품 상세 페이지 error.tsx, loading.tsx, not-found.tsx 구성
  - 공통 레이아웃 (layout.tsx) 및 404 페이지 (not-found.tsx) 구성
  - generateStaticParams를 통한 8개 카테고리 정적 생성 설정

- **Task 003: 타입 정의 및 데이터 모델 설계** - 완료
  - See: `/tasks/003-type-definitions.md`
  - Product 타입 정의 (Product, ProductDetail, ProductListResult, CategoryInfo)
  - 8개 카테고리 타입 (ProductCategory), 태그 타입 (ProductTag), 상태 타입 (ProductStatus)
  - 정렬 옵션 타입 (ProductSortOption: latest, price_asc, price_desc, discount)
  - Notion 페이지 속성 매핑 타입 (ProductPageProperties, NotionPage)
  - isProductPage 타입 가드 함수 구현
  - 전역 상수 정의 (CATEGORIES, SORT_OPTIONS, PAGINATION, REVALIDATE, ERROR_MESSAGES)

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 004: 공통 컴포넌트 라이브러리 구현** - 완료
  - See: `/tasks/004-component-library.md`
  - shadcn/ui 기반 UI 컴포넌트 설치 (Button, Card, Badge, Input, Select, Sheet, Dialog, NavigationMenu, Skeleton, Tooltip 등 20개)
  - 레이아웃 컴포넌트 구현 (Header, Footer, Container, MobileNav)
  - 데스크톱 NavigationMenu 카테고리 드롭다운 및 모바일 Sheet 네비게이션
  - ThemeProvider 및 ThemeToggle (다크/라이트 모드) 구현
  - Mock 데이터 생성 유틸리티 (mock-data.ts: 카테고리별 8개 x 8카테고리 = 64개 샘플 상품)
  - 포맷 유틸리티 (format.ts: 통화, 날짜, 배송비 포맷)

- **Task 005: 홈 페이지 (Dashboard) UI 구현** - 완료
  - See: `/tasks/005-home-page-ui.md`
  - HeroBanner 컴포넌트 (브랜드 이미지 + 스마트스토어 CTA 버튼)
  - SearchBar 컴포넌트 (상품명 키워드 검색, URL 파라미터 연동)
  - CategoryGrid 컴포넌트 (8개 카테고리 아이콘 카드 그리드)
  - FeaturedProducts 컴포넌트 (BEST/NEW 태그 상품 수평 스크롤 섹션)
  - CategoryPreview 컴포넌트 (카테고리별 4개 상품 미리보기 + "전체 보기" 링크)
  - ISR 재검증 주기 설정 (HOME: 300초)

- **Task 006: 카테고리 페이지 UI 구현** - 완료
  - See: `/tasks/006-category-page-ui.md`
  - ProductCard 컴포넌트 (이미지, 태그 뱃지, 카테고리명, 상품명, 가격 정보, 배송 뱃지)
  - ProductGrid 컴포넌트 (반응형 그리드: 모바일 2열, 태블릿 3열, 데스크톱 4열)
  - PriceDisplay 컴포넌트 (원가, 할인가, 할인율 표시)
  - ProductTagBadge / FreeShippingBadge / TodayShipBadge 뱃지 컴포넌트
  - SearchSortBar 컴포넌트 (검색 + SortSelect 정렬 옵션 통합 바)
  - Pagination 컴포넌트 (커서 기반 페이지네이션)
  - EmptyState 컴포넌트 (검색 결과 없음 / 카테고리 빈 상태)
  - ISR 재검증 주기 설정 (CATEGORY: 180초)

- **Task 007: 상품 상세 페이지 UI 구현** - 완료
  - See: `/tasks/007-product-detail-ui.md`
  - 브레드크럼 네비게이션 (홈 > 카테고리 > 상품명)
  - 상품 이미지 (Next.js Image, aspect-square, 확대 뷰)
  - 태그 뱃지 및 카테고리 Badge 표시
  - PriceDisplay 컴포넌트 활용 가격 정보
  - 배송 정보 섹션 (배송비, 무료배송 뱃지, 오늘출발 뱃지)
  - StoreLinkButton CTA 컴포넌트 ("네이버에서 구매하기" 버튼, 새 탭 이동)
  - NotionContentRenderer 컴포넌트 (Notion 블록 콘텐츠 렌더링)
  - 관련 상품 추천 섹션 (같은 카테고리 4개 상품)
  - ProductCardSkeleton 로딩 상태 컴포넌트
  - generateMetadata 동적 메타데이터 (OG 이미지 포함)
  - ISR 재검증 주기 설정 (PRODUCT: 60초)

### Phase 3: 핵심 기능 구현

- **Task 008: Notion API 연동 및 상품 서비스 구현** - 완료
  - See: `/tasks/008-notion-api-integration.md`
  - Notion API v5 클라이언트 설정 (notion.ts, notionVersion: '2025-09-03')
  - data_source_id 기반 데이터베이스 쿼리 (getDataSourceId 캐싱 로직)
  - 상품 서비스 레이어 구현 (product.service.ts)
    - getProducts: 카테고리/검색/정렬/페이지네이션 통합 조회
    - getProductById: 단일 상품 상세 + Notion 블록 콘텐츠 조회
    - getFeaturedProducts: BEST/NEW 태그 상품 조회
    - getCategoryPreviewProducts: 홈 페이지용 카테고리별 미리보기
    - getRelatedProducts: 같은 카테고리 추천 상품
  - Notion 데이터 파서 (product-parser.ts: transformNotionToProduct 변환 함수)
  - 에러 핸들링 및 재시도 로직 (withRetry, 최대 3회, 지수 백오프)
  - Mock/Notion 자동 전환 (isNotionConfigured 기반)
  - getPageBlocks 페이지 블록 콘텐츠 조회 (페이지네이션 포함)
  - Playwright MCP 테스트:
    - API 엔드포인트별 응답 검증 (상태 코드, 데이터 구조)
    - 상품 목록/상세 조회 E2E 테스트
    - Notion API 장애 시 에러 핸들링 검증

- **Task 009: 검색 및 정렬 기능 구현** - 완료
  - See: `/tasks/009-search-sort.md`
  - 검색 기능: SearchBar 클라이언트 컴포넌트, URL searchParams (q) 연동
  - 정렬 기능: SortSelect 컴포넌트, URL searchParams (sort) 연동
  - Notion API 필터 연동 (상품명 title contains 검색)
  - Notion API 정렬 연동 (latest/price_asc/price_desc/discount)
  - 할인율순 정렬 클라이언트 사이드 후처리 (Notion API 미지원)
  - 카테고리 페이지 내 검색+정렬 통합 동작
  - 홈 페이지 검색 시 카테고리 페이지 리다이렉트
  - Playwright MCP 테스트:
    - 검색어 입력 및 결과 표시 E2E 테스트
    - 정렬 옵션 변경 시 목록 재정렬 검증
    - 빈 검색 결과/특수문자 입력 경계값 테스트

- **Task 010: 데이터 연동 및 더미 데이터 교체** - 우선순위
  - Server Component에서 Notion 데이터 실시간 페칭 검증
  - 모든 페이지의 Mock 데이터를 실제 Notion API 응답으로 교체 확인
  - ISR 재검증 주기 동작 확인 (HOME: 300초, CATEGORY: 180초, PRODUCT: 60초)
  - Notion 데이터베이스 속성명 매핑 최종 검증 (한글 속성명)
  - 이미지 URL 외부 도메인 Next.js Image 설정 (next.config.ts remotePatterns)
  - 커서 기반 페이지네이션 실제 동작 검증
  - Playwright MCP 테스트:
    - Mock → Notion 전환 후 모든 페이지 정상 렌더링 검증
    - ISR 재검증 주기 동작 확인
    - 이미지 로딩 및 폴백 UI 테스트

- **Task 010-1: 핵심 기능 통합 테스트**
  - **Happy Path 테스트**: 전체 사용자 플로우를 처음부터 끝까지 검증
    - 홈 > 카테고리 > 상품 상세 > 스마트스토어 이동 전체 플로우
    - 검색어 입력 > 검색 결과 > 상품 클릭 플로우
    - 정렬 변경 > 상품 목록 재정렬 확인
    - 8개 카테고리별 상품 목록 정상 조회
    - BEST/NEW 태그 상품 우선 노출 확인
  - **에러 시나리오 테스트**: 네트워크 오류 및 서버 에러 응답 처리
    - 존재하지 않는 카테고리 slug 접근 시 404
    - 존재하지 않는 상품 ID 접근 시 404
    - Notion API 장애 시 에러 페이지 표시
  - **경계값 테스트**: 빈 데이터, 대량 데이터, 특수문자 등 엣지 케이스
    - 빈 카테고리 접근 시 EmptyState 표시
    - 검색어 없이 검색 시 전체 목록 표시
    - 가격, 할인율 계산 정확성 검증 (0원, 100% 할인 등)
  - **크로스 기능 테스트**: API + UI가 결합된 복합 시나리오 검증
    - 페이지네이션 + 정렬 + 검색 조합 동작
    - 반응형 레이아웃 (모바일/태블릿/데스크톱) 검증
  - 테스트 결과를 작업 파일에 기록하고 미통과 항목 추적

### Phase 4: 고급 기능 및 최적화 (Playwright MCP 기반 회귀 테스트 및 성능 테스트 포함)

- **Task 011: SEO 및 메타데이터 최적화**
  - 페이지별 동적 메타데이터 최적화 (title, description, OG tags)
  - JSON-LD 구조화 데이터 추가 (Product, BreadcrumbList)
  - sitemap.xml 자동 생성 (카테고리별 + 상품별 URL)
  - robots.txt 설정
  - canonical URL 설정
  - 소셜 미디어 공유 최적화 (OG Image, Twitter Card)

- **Task 012: 성능 최적화 및 사용자 경험 향상**
  - Next.js Image 최적화 (sizes, priority, placeholder blur)
  - Notion API 호출 최적화 (병렬 페칭, 불필요한 속성 제외)
  - React Suspense 경계 세분화 및 스트리밍 SSR 적용
  - 스켈레톤 로딩 UI 개선 (ProductCardSkeleton 활용)
  - 무한 스크롤 또는 "더 보기" 버튼 UX 개선
  - 웹 폰트 최적화 (next/font)
  - Lighthouse 성능 점수 90+ 달성
  - Playwright MCP 테스트:
    - 최적화 전/후 성능 비교 검증
    - 기존 기능 회귀 테스트 (최적화로 인한 기능 손상 방지)
    - 페이지 로딩 시간 및 Core Web Vitals 측정

- **Task 013: 배포 및 운영 준비**
  - Vercel 배포 설정 및 환경 변수 구성
  - 프로덕션 환경 Notion API 키 설정
  - 에러 모니터링 구성 (Vercel Analytics 또는 Sentry)
  - 구조화된 로깅 시스템 운영 환경 설정 (logger.ts 활용)
  - 배포 체크리스트 최종 검증 (docs/deployment-checklist.md 기반)
  - 크로스 브라우저 테스트 (Chrome, Firefox, Safari, Edge)
  - 모바일 디바이스 반응형 최종 검증

## 기술적 의존성 관계

```
Phase 1: 골격 구축
  Task 001 (환경 설정) ──> Task 002 (라우팅) ──> Task 003 (타입 정의)

Phase 2: UI/UX (더미 데이터)
  Task 003 ──> Task 004 (공통 컴포넌트)
  Task 004 ──> Task 005 (홈 UI)
  Task 004 ──> Task 006 (카테고리 UI)
  Task 004 ──> Task 007 (상품 상세 UI)

Phase 3: 핵심 기능
  Task 003 ──> Task 008 (Notion API)
  Task 005/006 ──> Task 009 (검색/정렬)
  Task 008 ──> Task 009
  Task 008/009 ──> Task 010 (데이터 교체)
  Task 010 ──> Task 010-1 (통합 테스트)

Phase 4: 최적화/배포
  Task 010-1 ──> Task 011 (SEO)
  Task 010-1 ──> Task 012 (성능)
  Task 011/012 ──> Task 013 (배포)
```

## MVP 체크리스트

### 핵심 기능 구현 확인

- [x] **F001**: 상품 목록 조회 - Notion DB에서 상품 카드 형태로 표시
- [x] **F002**: 카테고리별 필터링 - 8개 카테고리별 상품 분류
- [x] **F003**: 상품 상세 조회 - 이미지, 가격, 할인율, 설명 표시
- [x] **F004**: 스마트스토어 링크 연결 - "네이버에서 구매하기" CTA 버튼
- [x] **F005**: 상품 검색 - 상품명 기반 키워드 검색

### 필수 지원 기능 구현 확인

- [x] **F006**: 반응형 레이아웃 - 모바일/태블릿/데스크톱 대응
- [x] **F007**: 상품 정렬 - 최신순, 가격순, 할인율순
- [x] **F008**: 우선 상품 노출 - BEST/NEW 태그 상품 우선 표시

### 품질 검증

- [ ] 모든 페이지가 Notion 실제 데이터로 정상 로드됨
- [ ] ISR 재검증이 올바르게 동작함
- [ ] 에러 처리가 사용자 친화적임 (404, API 에러)
- [ ] 반응형 디자인이 모든 기기에서 작동함
- [ ] Lighthouse 성능 점수 90+ 달성
- [ ] 크로스 브라우저 호환성 확인

### 테스트 검증

- [ ] API 연동 및 비즈니스 로직에 Playwright MCP 테스트 수행되었는가?
- [ ] 모든 사용자 플로우가 E2E 테스트되었는가?
- [ ] **테스트 시나리오 유형별 커버리지**:
  - [ ] Happy Path: 정상 동작 시나리오가 모두 포함되었는가?
  - [ ] 에러 핸들링: 네트워크 오류, 잘못된 입력, 서버 에러 시나리오가 있는가?
  - [ ] 경계값: 빈 데이터, 대량 데이터, 특수문자 등 엣지 케이스가 고려되었는가?
  - [ ] 성능: 응답 시간 및 렌더링 성능 기준이 정의되었는가?
- [ ] 구현 완료 후 테스트 미수행 Task가 없는지 확인했는가?
- [ ] Playwright MCP 테스트 결과가 작업 파일에 기록되었는가?

## 예상 개발 일정

**총 예상 기간**: 2-3주 (1인 개발 기준)

- **Week 1**: Phase 1 + Phase 2 (Task 001-007) - 완료
  - 프로젝트 환경 설정 및 라우팅 구조 구축
  - 타입 정의 및 공통 컴포넌트 라이브러리 구현
  - 모든 페이지 UI 완성 (Mock 데이터 기반)

- **Week 2**: Phase 3 (Task 008-010-1)
  - Notion API 연동 및 상품 서비스 레이어 구현
  - 검색, 정렬 기능 완성
  - 실제 데이터 교체 및 통합 테스트

- **Week 3**: Phase 4 (Task 011-013)
  - SEO 및 성능 최적화
  - 배포 준비 및 운영 환경 구성

## 위험 요소 및 대응 방안

### 기술적 위험

1. **Notion API Rate Limit**
   - 초당 3회 요청 제한
   - 대응: ISR 캐싱 전략 (300/180/60초 재검증), 병렬 요청 최적화

2. **Notion API v5 data_source_id 변경**
   - database_id 대신 data_source_id 사용 필요
   - 대응: getDataSourceId 캐싱 함수로 1회 조회 후 메모리 캐싱

3. **대량 상품 데이터 처리**
   - 3,344개 상품 조회 시 성능 저하
   - 대응: 커서 기반 페이지네이션 (12개 단위), 카테고리별 분할 조회

4. **외부 이미지 URL 처리**
   - Notion/스마트스토어 이미지 도메인 다양성
   - 대응: next.config.ts remotePatterns 설정, 이미지 없음 폴백 UI

### 비즈니스 위험

1. **Notion 데이터베이스 속성명 불일치**
   - 한글 속성명 변경 시 전체 파서 수정 필요
   - 대응: product-parser.ts 중앙 집중 변환, 상수화

2. **스마트스토어 링크 유효성**
   - 상품 삭제/품절 시 링크 무효
   - 대응: 외부 링크 새 탭 이동, 에러는 스마트스토어 측에서 처리

---

**문서 버전**: v1.0
**작성일**: 2026-02-15
**목표**: MVP 핵심 기능 구현을 통한 빠른 상품 홍보 시작
**진행 상황**: Phase 1-2 완료, Phase 3 진행 중 (Task 010 우선순위)
