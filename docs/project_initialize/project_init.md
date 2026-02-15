# Jangs 리빙 스마트스토어 홍보 사이트 - 프로젝트 초기화 계획

## Context

현재 프로젝트는 **견적서(Invoice) 관리 시스템**으로 구성되어 있으나, PRD(`docs/PRD.md`)에 따르면 **Jangs 리빙 네이버 스마트스토어 상품 홍보 사이트**를 구축해야 합니다. 기존 인프라(Next.js 15.5.3, TailwindCSS v4, shadcn/ui, ESLint, Prettier, Husky, Notion SDK)는 그대로 유지하면서, 견적서 관련 비즈니스 로직을 모두 제거하고 상품 쇼케이스 기능으로 교체합니다.

**핵심 차단 이슈**: `src/lib/env.ts`에서 `ADMIN_PASSWORD`와 `SESSION_SECRET`을 필수로 검증하므로, 이를 제거하지 않으면 서버가 기동되지 않습니다.

---

## Phase 1: 정리 (Clean) - 견적서 코드 제거

### 1-1. 파일/폴더 삭제

**앱 라우트:**

- `src/app/(auth)/` - 관리자 로그인
- `src/app/(admin)/` - 관리자 대시보드 (admin/, invoices/, actions.ts)
- `src/app/api/` - PDF 생성 API
- `src/app/invoice/` - 견적서 페이지 (guide, [id])

**컴포넌트:**

- `src/components/admin/` - 관리자 UI (10개 파일)
- `src/components/invoice/` - 견적서 컴포넌트 (7개 파일)
- `src/components/pdf/` - PDF 템플릿

**라이브러리:**

- `src/lib/auth/` - 인증 (password.ts, session.ts)
- `src/lib/cache.ts` - Invoice 타입 의존 캐시
- `src/lib/mock-data.ts` - 견적서 목데이터
- `src/lib/rate-limit.ts` - Rate limiting
- `src/lib/services/invoice.service.ts`
- `src/lib/utils/link-generator.ts`
- `src/lib/utils/notion-parser.ts` - 견적서 전용 파서

**타입:**

- `src/types/auth.ts`, `src/types/invoice.ts`, `src/types/notion.ts`, `src/types/pdf.ts`

**기타:**

- `src/middleware.ts` - 관리자 인증 미들웨어
- `src/hooks/use-clipboard.ts`
- `tests/e2e/invoice.spec.ts`
- `src/components/ui/calendar.tsx` - react-day-picker 의존
- `src/components/ui/form.tsx` - react-hook-form 의존

**문서:**

- `docs/admin-guide.md`, `docs/api-documentation.md`

### 1-2. npm 의존성 제거

```bash
npm uninstall @hookform/resolvers @react-pdf/renderer jose react-day-picker react-hook-form
```

### 1-3. 환경변수 차단 해소 (BLOCKER)

**수정: `src/lib/env.ts`**

- `ADMIN_PASSWORD`, `SESSION_SECRET` 스키마 필드 및 parse 블록 제거
- 프로덕션 보안 검증 블록(46~68줄) 전체 제거
- NOTION_API_KEY, NOTION_DATABASE_ID만 필수 유지

**수정: `.env.local.example`**

- ADMIN_PASSWORD, SESSION_SECRET 라인 제거

---

## Phase 2: 기반 구축 (Foundation) - 타입, 상수, 서비스

### 2-1. 타입 정의

**생성: `src/types/product.ts`**

- `ProductCategory` - 8개 카테고리 유니온 타입
- `ProductTag` - `'BEST' | 'NEW'`
- `ProductStatus` - `'초안' | '발행됨'`
- `ProductSortOption` - `'latest' | 'price_asc' | 'price_desc' | 'discount'`
- `Product` - id, title, category, price, salePrice, discountRate, imageUrl, storeLink, published, status, tags, shipping, freeShipping, todayShip
- `ProductDetail extends Product` - content (Notion 블록 배열)
- `ProductListResult` - products, nextCursor, hasMore
- `CategoryInfo` - name, slug, icon, description

**생성: `src/types/notion.ts`** (교체)

- `ProductPageProperties` - Notion DB 한글 속성명 매핑 (상품명, 카테고리, 원가, 할인가, 이미지, 스토어링크, 업데이트일, 상태, 태그, 배송비, 무료배송, 오늘출발)
- `isProductPage()` 타입 가드

### 2-2. 상수 정의

**수정: `src/lib/constants.ts`** (전면 교체)

- `SITE_CONFIG` - 사이트명, 슬로건, 스토어 URL
- `CATEGORIES` - 8개 카테고리 배열 (name, slug, icon, description)
- `SLUG_TO_CATEGORY` / `CATEGORY_TO_SLUG` - 슬러그↔카테고리명 양방향 맵
- `SORT_OPTIONS` - 정렬 옵션 4개
- `PAGINATION` - 기본 페이지 사이즈(12), 홈 미리보기 수(4)
- `REVALIDATE` - ISR 주기 (홈 300초, 카테고리 180초, 상품 60초)
- `ERROR_MESSAGES` - 상품 관련 에러 메시지

### 2-3. Notion API 확장

**수정: `src/lib/notion.ts`**

- 기존 `notion`, `getNotionPage()`, `getDataSourceId()` 유지
- `getPageBlocks(pageId)` 추가 - 상품 상세 페이지 본문 블록 조회

### 2-4. 데이터 파서

**생성: `src/lib/utils/product-parser.ts`**

- `transformNotionToProduct(page)` - Notion PageObjectResponse → Product 변환
- 할인율 자동 계산: `Math.round(((price - salePrice) / price) * 100)`

### 2-5. 상품 서비스 레이어

**생성: `src/lib/services/product.service.ts`**

기존 `invoice.service.ts`의 `notion.dataSources.query()` 패턴을 그대로 활용:

| 함수                                             | 용도                               |
| ------------------------------------------------ | ---------------------------------- |
| `getProducts(options)`                           | 목록 조회 (필터/정렬/페이지네이션) |
| `getProductById(pageId)`                         | 단일 상세 조회 + 블록 콘텐츠       |
| `getProductsByCategory(category, options)`       | 카테고리별 조회                    |
| `getFeaturedProducts(tag, limit)`                | BEST/NEW 상품                      |
| `getCategoryPreviewProducts(category, limit)`    | 카테고리 미리보기 (홈용)           |
| `getRelatedProducts(category, excludeId, limit)` | 추천 상품                          |

내부: `buildFilters()`, `buildSorts()` 헬퍼

### 2-6. 포맷 유틸리티

**수정: `src/lib/format.ts`**

- `formatDate()`, `formatCurrency()` 유지
- `formatInvoiceStatus()`, `sanitizeFilename()` 삭제
- `formatDiscountRate()`, `formatShipping()` 추가

---

## Phase 3: 컴포넌트 구축

### 3-1. 레이아웃

| 파일                                   | 타입   | 설명                                                        |
| -------------------------------------- | ------ | ----------------------------------------------------------- |
| `src/components/layout/header.tsx`     | Server | 로고, 데스크톱 네비 (NavigationMenu), 검색바, 다크모드 토글 |
| `src/components/layout/mobile-nav.tsx` | Client | Sheet 기반 모바일 사이드 메뉴                               |
| `src/components/layout/footer.tsx`     | Server | 수정 - Jangs 리빙 브랜드, 스마트스토어 링크                 |

### 3-2. 상품 컴포넌트 (`src/components/product/`)

| 파일                          | 타입   | 설명                                            |
| ----------------------------- | ------ | ----------------------------------------------- |
| `product-card.tsx`            | Server | 상품 카드 (이미지, 이름, 가격, 태그, 구매 링크) |
| `product-card-skeleton.tsx`   | Server | 로딩 스켈레톤                                   |
| `product-grid.tsx`            | Server | 상품 그리드 (2/3/4열 반응형)                    |
| `product-tag-badge.tsx`       | Server | BEST/NEW/무료배송/오늘출발 뱃지                 |
| `price-display.tsx`           | Server | 원가(취소선) + 할인가 + 할인율 표시             |
| `store-link-button.tsx`       | Client | "네이버에서 구매하기" CTA 버튼                  |
| `notion-content-renderer.tsx` | Server | Notion 블록 → HTML 렌더러                       |

### 3-3. 카테고리 컴포넌트 (`src/components/category/`)

| 파일                | 설명                                 |
| ------------------- | ------------------------------------ |
| `category-card.tsx` | 카테고리 카드 (아이콘 + 이름 + 설명) |
| `category-grid.tsx` | 8개 카테고리 그리드                  |

### 3-4. 검색/필터 (`src/components/search/`)

| 파일                  | 타입   | 설명                                      |
| --------------------- | ------ | ----------------------------------------- |
| `search-bar.tsx`      | Client | 검색 입력 (useDebounceValue + URL params) |
| `sort-select.tsx`     | Client | 정렬 선택 (Select + URL params)           |
| `search-sort-bar.tsx` | Client | SearchBar + SortSelect 조합               |

### 3-5. 공통 (`src/components/common/`)

| 파일              | 설명                   |
| ----------------- | ---------------------- |
| `pagination.tsx`  | 커서 기반 페이지네이션 |
| `empty-state.tsx` | 데이터 없음 상태       |

### 3-6. 홈 섹션 (`src/components/sections/`)

| 파일                    | 설명                                    |
| ----------------------- | --------------------------------------- |
| `hero-banner.tsx`       | 히어로 배너 (브랜드 소개 + 스토어 링크) |
| `featured-products.tsx` | BEST/NEW 상품 섹션                      |
| `category-preview.tsx`  | 카테고리별 미리보기 (4개 + "전체 보기") |

---

## Phase 4: 페이지 구축

### 4-1. 루트 레이아웃

**수정: `src/app/layout.tsx`**

- metadata를 "Jangs 리빙" 브랜드로 교체
- body에 `<Header />` + `<main>{children}</main>` + `<Footer />` 공통 구조 추가
- `min-h-screen flex flex-col` 적용

### 4-2. 홈 페이지 (Dashboard)

**수정: `src/app/page.tsx`** (전면 교체)

- Server Component, `revalidate = 300`
- `Promise.all`로 BEST/NEW 상품 + 카테고리별 미리보기 병렬 페칭
- HeroBanner → SearchBar → CategoryGrid → FeaturedProducts → CategoryPreviews

### 4-3. 카테고리 페이지

**생성: `src/app/category/[slug]/page.tsx`**

- Server Component, `revalidate = 180`
- `generateStaticParams()` - 8개 카테고리 사전 생성
- `generateMetadata()` - 카테고리별 동적 메타데이터
- SearchSortBar → ProductGrid → Pagination

**생성: `src/app/category/[slug]/loading.tsx`**, `error.tsx`

### 4-4. 상품 상세 페이지

**생성: `src/app/product/[id]/page.tsx`**

- Server Component, `revalidate = 60`
- `generateMetadata()` - 상품별 OG 이미지 포함
- 2열 레이아웃: 이미지 | 정보(가격, 태그, 배송, CTA)
- NotionContentRenderer로 상세 설명
- 추천 상품 섹션

**생성: `src/app/product/[id]/loading.tsx`**, `not-found.tsx`, `error.tsx`

### 4-5. 전역 404

**수정: `src/app/not-found.tsx`** - 텍스트만 수정

---

## Phase 5: 마무리 (Polish)

### 5-1. 폰트 수정

**수정: `src/app/globals.css`**

- `--font-sans` 를 `Libre Baskerville, serif`에서 `var(--font-noto-sans-kr), 'Noto Sans KR', system-ui, sans-serif`로 변경 (`:root`와 `.dark` 모두)

### 5-2. 이미지 도메인

**수정: `next.config.ts`**

- `images.remotePatterns`에 네이버/Notion 이미지 도메인 추가

### 5-3. 프로젝트 메타

- **수정: `CLAUDE.md`** - 프로젝트 설명을 홍보 사이트로 교체
- **수정: `package.json`** - name을 `jangs-living-smartstore`로 변경

---

## Phase 6: 검증 (Verify)

```bash
npm run typecheck      # TypeScript 타입 검사
npm run lint           # ESLint 검사
npm run format         # Prettier 포맷 적용
npm run build          # 프로덕션 빌드
npm run dev            # 개발 서버 실행 확인
```

---

## 핵심 파일 참조

| 용도                        | 파일 경로                             |
| --------------------------- | ------------------------------------- |
| 환경변수 (BLOCKER)          | `src/lib/env.ts`                      |
| Notion API 클라이언트       | `src/lib/notion.ts`                   |
| 기존 서비스 패턴 참고       | `src/lib/services/invoice.service.ts` |
| 기존 검색바 패턴 참고       | `src/components/admin/search-bar.tsx` |
| 기존 페이지네이션 패턴 참고 | `src/components/admin/pagination.tsx` |
| 유틸리티 (cn 헬퍼)          | `src/lib/utils.ts`                    |
| 로거 (유지)                 | `src/lib/logger.ts`                   |
| 포맷 (수정)                 | `src/lib/format.ts`                   |
| globals CSS (폰트 수정)     | `src/app/globals.css`                 |
| PRD 문서                    | `docs/PRD.md`                         |

---

## 설계 결정 요약

1. **Server Components 기본** - Client는 SearchBar, SortSelect, Pagination, MobileNav, ThemeToggle, StoreLinkButton만
2. **ISR** - 홈(5분), 카테고리(3분), 상세(1분) 차등 캐싱
3. **Notion API v5** - `dataSources.query()` 패턴 재활용
4. **기존 패턴 재활용** - 검색(useDebounceValue+URL params), 페이지네이션(커서), 서비스 레이어(withRetry, buildFilters)
5. **할인율 정렬** - Notion API 미지원이므로 fetch 후 JS 정렬 (MVP 허용)
