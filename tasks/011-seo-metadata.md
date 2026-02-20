# Task 011: SEO 및 메타데이터 최적화

## 목표

페이지별 동적 메타데이터 최적화, JSON-LD 구조화 데이터, sitemap.xml, robots.txt, canonical URL, 소셜 미디어 공유 최적화를 구현하여 검색 엔진 노출 및 소셜 공유 품질을 향상한다.

## 배경

- Phase 3까지 핵심 기능 구현 완료 (Notion API 연동, 검색/정렬, 데이터 연동)
- 현재 `generateMetadata`가 일부 페이지에 구현되어 있으나 OG tags, Twitter Card, JSON-LD 미적용
- sitemap.xml, robots.txt 미존재
- Lighthouse SEO 점수 향상을 위한 체계적인 메타데이터 개선 필요

## 관련 파일

| 파일                                  | 작업 유형 | 설명                                                |
| ------------------------------------- | --------- | --------------------------------------------------- |
| `src/app/layout.tsx`                  | 수정      | 기본 메타데이터 및 OG 태그 개선                     |
| `src/app/sitemap.ts`                  | 생성      | Next.js 15 sitemap.xml 자동 생성                    |
| `src/app/robots.ts`                   | 생성      | robots.txt 설정                                     |
| `src/app/page.tsx`                    | 수정      | 홈 페이지 generateMetadata 개선                     |
| `src/app/category/[slug]/page.tsx`    | 수정      | 카테고리 OG tags, canonical, BreadcrumbList JSON-LD |
| `src/app/product/[id]/page.tsx`       | 수정      | 상품 Product JSON-LD, OG Image, Twitter Card        |
| `src/lib/constants.ts`                | 참조      | CATEGORIES, REVALIDATE 상수                         |
| `src/lib/services/product.service.ts` | 참조      | 상품 목록 조회 (sitemap 생성 활용)                  |

## 구현 단계

### 단계 1: 기반 설정 (layout.tsx 및 constants)

- [ ] `src/lib/constants.ts`에 `SITE_CONFIG` 상수 추가 (siteName, baseUrl, description)
- [ ] `src/app/layout.tsx`의 `metadata` 객체에 기본 OG tags, Twitter Card 추가
- [ ] `metadataBase` 설정 (NEXT_PUBLIC_BASE_URL 환경변수 활용)

### 단계 2: sitemap.ts 및 robots.ts 생성

- [ ] `src/app/sitemap.ts` 생성
  - 정적 URL: 홈(`/`), 8개 카테고리(`/category/[slug]`)
  - 동적 URL: 전체 상품(`/product/[id]`) — `getProducts` 서비스 활용
  - `changeFrequency`, `priority`, `lastModified` 설정
- [ ] `src/app/robots.ts` 생성
  - `Allow: /`, `Disallow: /_next/`
  - `sitemap` URL 포함

### 단계 3: 카테고리 페이지 메타데이터

- [ ] `generateMetadata`에 카테고리명 기반 `title`, `description` 개선
- [ ] OG tags: `og:title`, `og:description`, `og:url`
- [ ] canonical URL 설정
- [ ] JSON-LD BreadcrumbList 스키마 추가 (홈 → 카테고리)

### 단계 4: 상품 상세 페이지 메타데이터

- [ ] `generateMetadata`에 상품명/가격 기반 `description` 개선
- [ ] OG tags: `og:image` (상품 이미지), `og:type: product`
- [ ] Twitter Card: `summary_large_image`
- [ ] canonical URL 설정
- [ ] JSON-LD Product 스키마 추가
  - `name`, `description`, `image`, `offers.price`, `offers.priceCurrency`
  - `offers.availability`, `brand`
- [ ] JSON-LD BreadcrumbList 스키마 추가 (홈 → 카테고리 → 상품명)

### 단계 5: 검증 및 빌드

- [ ] `npm run check-all` 통과
- [ ] `npm run build` 성공
- [ ] Playwright MCP 테스트 수행

## 테스트 체크리스트

### Happy Path

- [ ] `http://localhost:3000/sitemap.xml` 접근 시 카테고리 및 상품 URL 목록 반환
- [ ] `http://localhost:3000/robots.txt` 접근 시 Allow/Disallow 규칙 및 sitemap URL 반환
- [ ] 홈 페이지 `<head>`에 `og:title`, `og:description` 메타태그 존재
- [ ] 카테고리 페이지 `<head>`에 canonical URL, BreadcrumbList JSON-LD 존재
- [ ] 상품 상세 페이지 `<head>`에 Product JSON-LD, `og:image` 존재

### 에러 케이스

- [ ] 이미지 없는 상품의 OG Image 폴백 처리 (기본 OG 이미지 또는 미설정)
- [ ] `NEXT_PUBLIC_BASE_URL` 미설정 시 상대 URL로 fallback

### 경계값

- [ ] 상품명에 특수문자 포함 시 JSON-LD 이스케이프 정상 처리
- [ ] 전체 상품 수(3,344개) sitemap 생성 시 타임아웃 없이 완료

## 수락 기준

- [ ] `/sitemap.xml`에 홈, 8개 카테고리, 전체 상품 URL 포함
- [ ] `/robots.txt` 올바른 형식 반환
- [ ] 모든 페이지에 OG tags, Twitter Card 메타태그 적용
- [ ] 상품 상세 페이지에 JSON-LD Product 스키마 적용
- [ ] 카테고리/상품 페이지에 BreadcrumbList JSON-LD 적용
- [ ] `npm run check-all && npm run build` 성공
- [ ] Lighthouse SEO 점수 향상 확인

---

**작업 상태**: 대기 중
**의존성**: Task 010-1 완료 (완료됨)
**다음 작업**: Task 013 (Task 012와 함께 완료 후)
