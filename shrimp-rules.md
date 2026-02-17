# Development Guidelines

## 프로젝트 개요

- **목적**: Notion CMS 기반 네이버 스마트스토어 'Jangs 리빙' 상품 홍보 사이트
- **스택**: Next.js 15.5.3 (App Router + Turbopack), React 19, TypeScript 5, TailwindCSS v4, shadcn/ui (new-york), @notionhq/client v5
- **사용자 플로우**: 홈(Dashboard) → 카테고리 → 상품 상세 → 네이버 스마트스토어(외부)
- **8개 카테고리**: 가구/인테리어, 생활/건강, 패션잡화, 화장품/미용, 디지털/가전, 출산/육아, 스포츠/레저, 패션의류

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
src/
├── app/                        # App Router 페이지 (Server Component 우선)
│   ├── layout.tsx             # 루트 레이아웃 (ThemeProvider, Header, Footer)
│   ├── page.tsx               # 홈 Dashboard
│   ├── not-found.tsx          # 404 페이지
│   ├── category/[slug]/       # 카테고리 페이지 (동적 라우트)
│   │   ├── page.tsx
│   │   ├── error.tsx
│   │   └── loading.tsx
│   └── product/[id]/          # 상품 상세 페이지 (동적 라우트)
│       ├── page.tsx
│       ├── error.tsx
│       ├── loading.tsx
│       └── not-found.tsx
├── components/
│   ├── ui/                    # shadcn/ui 컴포넌트 (**수정 금지**, shadcn CLI로만 관리)
│   ├── layout/                # Header, Footer, Container, MobileNav
│   ├── product/               # ProductCard, ProductGrid, PriceDisplay 등
│   ├── category/              # CategoryCard, CategoryGrid
│   ├── search/                # SearchBar, SortSelect, SearchSortBar
│   ├── sections/              # HeroBanner, FeaturedProducts, CategoryPreview
│   ├── common/                # Pagination, EmptyState
│   └── providers/             # ThemeProvider
├── lib/
│   ├── constants.ts           # **전역 상수** (카테고리, 정렬, 페이지네이션, ISR, 에러메시지)
│   ├── env.ts                 # 환경변수 검증 (Zod 스키마)
│   ├── format.ts              # 포맷 유틸리티 (통화, 날짜, 배송비, 할인율)
│   ├── logger.ts              # 구조화된 로깅 (민감정보 마스킹)
│   ├── mock-data.ts           # Mock 데이터 (Notion 미설정 시 자동 사용)
│   ├── notion.ts              # Notion API 클라이언트 (data_source_id 캐싱)
│   ├── utils.ts               # cn() 유틸리티
│   ├── services/
│   │   └── product.service.ts # **상품 서비스 레이어** (Mock/Notion 자동 전환)
│   └── utils/
│       └── product-parser.ts  # Notion → Product 변환 파서
└── types/
    ├── product.ts             # Product, ProductDetail, CategoryInfo 등
    └── notion.ts              # NotionPage, ProductPageProperties, isProductPage
```

### 데이터 흐름

```
[Notion Database] ──(API v5)──> [notion.ts + product-parser.ts]
                                        ↓
                               [product.service.ts] ←── isNotionConfigured?
                                   ↙         ↘              ↓
                         [Notion API]    [mock-data.ts]  (자동 전환)
                                   ↘         ↙
                              [Server Component]
                                        ↓
                              [UI Components] → 사용자
```

---

## 코드 규칙

### 네이밍

- **파일명**: kebab-case (`product-card.tsx`, `search-bar.tsx`)
- **React 컴포넌트**: PascalCase (`ProductCard`, `SearchBar`)
- **변수/함수**: camelCase (`getProducts`, `formatCurrency`)
- **상수**: UPPER_SNAKE_CASE (`SITE_CONFIG`, `REVALIDATE`)
- **타입/인터페이스**: PascalCase (`Product`, `CategoryInfo`)

### 포맷팅

- 2칸 들여쓰기, 작은따옴표
- Prettier + ESLint 자동 포맷
- 주석/커밋/문서: **한국어**

### 경로 별칭 필수

```typescript
// ✅ 필수
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ❌ 금지
import { Button } from '../../../components/ui/button'
```

---

## 기능 구현 규칙

### Server Component vs Client Component

- **기본**: Server Component 사용
- **Client Component 필요 조건**: `useState`, `useEffect`, `useRouter`, 이벤트 핸들러(`onClick` 등)
- **현재 Client Component**: `SearchBar`, `SortSelect`, `SearchSortBar`, `MobileNav`, `ThemeToggle`, `ThemeProvider`, `Pagination`
- Client Component 파일 최상단에 `'use client'` 선언 필수

### Next.js 15 async request APIs 필수

```typescript
// ✅ 필수: params, searchParams는 Promise로 await
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; sort?: string }>
}) {
  const { slug } = await params
  const { q, sort } = await searchParams
}

// ❌ 금지: 동기식 접근
export default function Page({ params }: { params: { slug: string } }) {}
```

### 새 페이지 추가

1. `src/app/` 하위에 라우트 디렉토리 생성
2. `page.tsx` (Server Component) 작성
3. `error.tsx`, `loading.tsx` 에러 경계 추가
4. `export const revalidate = REVALIDATE.XXX` (constants.ts에서 import)
5. `generateMetadata` 함수로 동적 메타데이터 설정
6. 필요 시 `generateStaticParams` 정적 생성 설정

### 새 컴포넌트 추가

1. **용도별 올바른 디렉토리에 배치**:
   - `components/ui/` → **shadcn CLI로만 추가** (`npx shadcn add <component>`)
   - `components/product/` → 상품 관련 UI
   - `components/category/` → 카테고리 관련 UI
   - `components/search/` → 검색/정렬 관련 UI
   - `components/sections/` → 홈 페이지 섹션
   - `components/common/` → 범용 UI (페이지네이션 등)
   - `components/layout/` → 레이아웃 구성요소
2. shadcn/ui 컴포넌트 활용 (`Card`, `Badge`, `Button`, `Input`, `Select` 등)
3. TailwindCSS 유틸리티 클래스 사용, 인라인 스타일 금지
4. Props 인터페이스를 컴포넌트 파일 내부에 정의

### 새 서비스 함수 추가

1. `src/lib/services/product.service.ts`에 추가
2. **Mock/Notion 자동 전환 패턴 준수**:

```typescript
export async function newFunction(args): Promise<ReturnType> {
  if (!isNotionConfigured) {
    return getMockXxx(args) // mock-data.ts에서 제공
  }
  try {
    return await withRetry(() => getNotionXxx(args))
  } catch (error) {
    logger.error('에러 메시지', { context })
    throw new Error(ERROR_MESSAGES.XXX)
  }
}
```

3. Notion API 함수는 **동적 import**로 의존성 격리
4. `withRetry` 래퍼로 에러 재시도 적용 (최대 3회, 지수 백오프)
5. `logger`로 에러 로깅 (`console.log` 직접 사용 금지)

---

## Notion API 연동 규칙

### 한글 속성명 매핑 (**중앙 관리, 하드코딩 금지**)

| Product 필드 | Notion DB 속성명 | Notion 타입  |
| ------------ | ---------------- | ------------ |
| title        | 상품명           | title        |
| category     | 카테고리         | select       |
| price        | 원가             | number       |
| salePrice    | 할인가           | number       |
| imageUrl     | 이미지           | url          |
| storeLink    | 스토어링크       | url          |
| published    | 업데이트일       | date         |
| status       | 상태             | select       |
| tags         | 태그             | multi_select |
| shipping     | 배송비           | number       |
| freeShipping | 무료배송         | checkbox     |
| todayShip    | 오늘출발         | checkbox     |

- **속성명 변경 시 반드시 3개 파일 동시 수정**:
  1. `types/notion.ts` → `ProductPageProperties`
  2. `lib/utils/product-parser.ts` → `transformNotionToProduct`
  3. `lib/services/product.service.ts` → 필터/정렬 쿼리의 `property` 값

### Notion API v5 규칙

- `notion.dataSources.query()` 사용 (**database_id가 아닌 `data_source_id`**)
- `getDataSourceId()` 함수로 data_source_id 조회 및 메모리 캐싱
- `notionVersion: '2025-09-03'` 고정
- 필터 필드명은 **한글 속성명** 사용: `{ property: '상태', select: { equals: '발행됨' } }`
- 할인율순 정렬은 Notion API 미지원 → 클라이언트 사이드 후처리

### ISR 재검증

- `REVALIDATE.HOME = 300` (5분) - 홈 페이지
- `REVALIDATE.CATEGORY = 180` (3분) - 카테고리 페이지
- `REVALIDATE.PRODUCT = 60` (1분) - 상품 상세 페이지
- 페이지 파일에서 `export const revalidate = REVALIDATE.XXX` 패턴 사용

---

## 핵심 파일 상호작용 규칙

### 카테고리 추가/수정 시 동시 수정 필수

1. `src/lib/constants.ts` → `CATEGORIES` 배열에 추가
2. `src/types/product.ts` → `ProductCategory` 유니온 타입에 추가
3. (자동 반영) `generateStaticParams`는 `CATEGORIES` 참조

### 상품 타입 필드 추가 시 동시 수정 필수

1. `src/types/product.ts` → `Product` 인터페이스에 필드 추가
2. `src/types/notion.ts` → `ProductPageProperties`에 Notion 속성 매핑 추가
3. `src/lib/utils/product-parser.ts` → `transformNotionToProduct`에 파싱 로직 추가
4. `src/lib/mock-data.ts` → Mock 데이터에 필드 추가
5. 관련 컴포넌트에서 새 필드 사용

### 환경변수 추가 시

1. `src/lib/env.ts` → Zod 스키마에 추가
2. `.env.local` → 값 설정
3. 필요 시 `next.config.ts` 설정 추가

### 에러 메시지 추가 시

- `src/lib/constants.ts` → `ERROR_MESSAGES` 객체에 추가
- 서비스/컴포넌트에서 **직접 문자열 사용 금지**, 반드시 `ERROR_MESSAGES` 상수 참조

---

## 스타일링 규칙

### TailwindCSS v4 유틸리티 클래스 우선

```typescript
// ✅ 필수: Tailwind 유틸리티 클래스
<div className="flex items-center justify-between rounded-lg bg-background p-4">

// ❌ 금지: 인라인 스타일
<div style={{ display: 'flex', padding: '16px' }}>
```

### 시맨틱 색상 변수 (다크모드 대응)

```typescript
// ✅ 필수: CSS 변수 기반 시맨틱 색상
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">설명</p>
</div>

// ❌ 금지: 하드코딩된 색상
<div className="bg-white text-black dark:bg-black dark:text-white">
```

### cn() 함수로 클래스 조합

```typescript
import { cn } from '@/lib/utils'

// ✅ 필수
<div className={cn('base-classes', isActive && 'active-classes', className)}>

// ❌ 금지: 문자열 직접 조합
<div className={`base ${isActive ? 'active' : ''}`}>
```

---

## 외부 의존성 사용 규칙

### shadcn/ui

- `npx shadcn add <component>` 명령으로만 설치
- `src/components/ui/` 디렉토리 파일 **직접 수정 금지**
- new-york 스타일 적용됨

### Next.js Image

- 외부 이미지 도메인은 `next.config.ts` → `images.remotePatterns`에 등록 필수
- 현재 등록: `*.pstatic.net`, `prod-files-secure.s3.us-west-2.amazonaws.com`, `*.notion.so`
- 이미지 없음 폴백 UI 항상 제공

### Lucide React

- 아이콘은 `lucide-react`에서 import
- `next.config.ts`에서 `optimizePackageImports: ['lucide-react']` 설정됨

---

## 작업 워크플로우

```
1. 작업 계획 → ROADMAP.md 확인 및 업데이트
2. 작업 파일 생성 → /tasks/XXX-description.md
3. 구현 → 작업 파일 명세서 따름
4. 검증 → npm run check-all && npm run build
5. 테스트 → Playwright MCP 기반 E2E 테스트
6. 로드맵 업데이트 → 완료 상태 반영
```

### 검증 명령어

```bash
npm run check-all   # typecheck + lint + format:check (모두 통과 필수)
npm run build       # 프로덕션 빌드 성공 확인
```

---

## AI 의사결정 기준

### Server vs Client Component

```
이벤트 핸들러/React Hook 필요? → Client Component ('use client')
그 외 모든 경우              → Server Component (기본)
```

### Mock vs Notion 데이터

```
NOTION_API_KEY + NOTION_DATABASE_ID 존재? → Notion API 사용
둘 중 하나라도 없음?                      → Mock 데이터 자동 사용
```

### 에러 처리

```
상품/카테고리 없음? → notFound() 호출 (Next.js 404)
API 오류?          → withRetry로 재시도 (최대 3회, 지수 백오프)
재시도 실패?       → error.tsx 에러 경계에서 처리
```

---

## 금지 사항

### 절대 금지

- `src/components/ui/` 파일 직접 수정 (**shadcn CLI만 사용**)
- Notion DB 속성명을 코드 여러 곳에 하드코딩 (**product-parser.ts에서만 매핑**)
- `console.log` 직접 사용 (**logger.ts의 logger 객체 사용**)
- 환경변수를 `process.env`에서 직접 접근 (**env.ts의 env 객체 사용**)
- `ERROR_MESSAGES` 상수 대신 에러 문자열 직접 사용
- Mock 데이터 삭제 (**개발 환경에서 Notion 키 없이도 동작해야 함**)
- `REVALIDATE` 상수를 무시하고 직접 숫자 하드코딩
- 인라인 스타일 (`style={{}}`) 사용
- 하드코딩된 색상 클래스 (`bg-white`, `text-black`)
- Pages Router, `getServerSideProps`, `getStaticProps` 사용
- params/searchParams 동기 접근

### 지양 사항

- `any` 타입 남용 (불가피한 경우만 `eslint-disable` 주석과 함께)
- Server Component에 불필요한 `'use client'` 추가
- 카테고리 추가 시 `constants.ts`만 수정하고 `types/product.ts` 누락
- 단일 파일 300줄 초과

---

**문서 버전**: v2.0
**작성일**: 2026-02-16
**프로젝트**: Jangs 리빙 스마트스토어 홍보 사이트 MVP
