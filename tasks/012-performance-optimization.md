# Task 012: 성능 최적화 및 사용자 경험 향상

## 목표

Next.js Image 최적화, Notion API 병렬 페칭, React Suspense 세분화, 스켈레톤 UI 개선, '더 보기' 버튼 UX, 웹 폰트 최적화를 구현하여 Lighthouse 성능 점수 90+를 달성한다.

## 배경

- Phase 3까지 모든 핵심 기능 구현 완료
- 홈 페이지에서 `getCategoryPreviewProducts`와 `getFeaturedProducts`를 순차 호출 중 (병렬화 필요)
- 상품 이미지 `<Image>`에 `sizes` 미설정으로 불필요한 대용량 이미지 로드 가능성 있음
- 카테고리 페이지 페이지네이션이 커서 기반이나 UX가 불편함
- 웹 폰트 최적화 미적용

## 관련 파일

| 파일                                            | 작업 유형 | 설명                                             |
| ----------------------------------------------- | --------- | ------------------------------------------------ |
| `src/app/layout.tsx`                            | 수정      | next/font 웹 폰트 최적화                         |
| `src/app/page.tsx`                              | 수정      | 홈 페이지 Promise.all 병렬 페칭, Suspense 세분화 |
| `src/app/category/[slug]/page.tsx`              | 수정      | '더 보기' 버튼 UX, Suspense 세분화               |
| `src/app/category/[slug]/loading.tsx`           | 수정      | ProductCardSkeleton 활용 스켈레톤 UI 개선        |
| `src/components/product/product-card.tsx`       | 수정      | Image sizes, priority 최적화                     |
| `src/components/sections/featured-products.tsx` | 수정      | 첫 번째 이미지 priority 추가                     |
| `src/components/sections/category-preview.tsx`  | 수정      | 첫 번째 이미지 priority 추가                     |
| `src/lib/services/product.service.ts`           | 참조      | Notion API 서비스 레이어                         |

## 구현 단계

### 단계 1: 웹 폰트 최적화 (next/font)

- [ ] `src/app/layout.tsx`에 `next/font/google` 적용
  - Noto Sans KR (한국어) 또는 시스템 폰트 우선 설정
  - `display: 'swap'` 설정으로 FOIT 방지
- [ ] 불필요한 외부 폰트 `<link>` 제거

### 단계 2: Next.js Image 최적화

- [ ] `src/components/product/product-card.tsx`의 `<Image>`에 `sizes` 속성 추가
  - 모바일(< 768px): `50vw`
  - 태블릿(768px~1024px): `33vw`
  - 데스크톱(> 1024px): `25vw`
- [ ] `FeaturedProducts`, `CategoryPreview`의 첫 번째 카드 이미지에 `priority` 추가 (LCP 최적화)
- [ ] 상품 상세 페이지 대표 이미지에 `priority` 추가

### 단계 3: Notion API 병렬 페칭

- [ ] `src/app/page.tsx`에서 `Promise.all` 적용
  ```
  const [featured, categoryPreviews] = await Promise.all([
    getFeaturedProducts(),
    getCategoryPreviewProducts()
  ])
  ```
- [ ] 카테고리 페이지에서 독립적인 API 호출 병렬화 검토

### 단계 4: '더 보기' 버튼 UX

- [ ] 카테고리 페이지(`/category/[slug]`)에 '더 보기' 버튼 구현
  - URL 파라미터(`page`) 방식으로 Server Component에서 처리
  - 현재 커서 기반 페이지네이션 유지하되 UX 개선
  - 마지막 페이지 도달 시 버튼 숨김

### 단계 5: 스켈레톤 UI 개선

- [ ] `src/app/category/[slug]/loading.tsx`에 `ProductCardSkeleton` 실제 활용
  - 그리드 레이아웃과 일치하는 스켈레톤 수 표시 (12개)
- [ ] 홈 페이지 `loading.tsx` 스켈레톤 UI 검토 및 개선

### 단계 6: React Suspense 세분화

- [ ] 홈 페이지 섹션별 `<Suspense>` 경계 적용
  - `FeaturedProducts`, `CategoryPreview` 각각 독립 Suspense
- [ ] streaming SSR 동작 확인

### 단계 7: 검증 및 성능 측정

- [ ] `npm run check-all` 통과
- [ ] `npm run build` 성공
- [ ] Playwright MCP로 Lighthouse 성능 점수 측정
- [ ] 기존 기능 회귀 테스트

## 테스트 체크리스트

### Happy Path

- [ ] 홈 페이지 로딩 시 병렬 API 호출 확인 (서버 로그)
- [ ] 상품 카드 이미지에 `sizes` 속성 적용 확인 (DevTools → Elements)
- [ ] '더 보기' 버튼 클릭 시 추가 상품 로드
- [ ] 카테고리 페이지 로딩 중 스켈레톤 12개 표시
- [ ] Lighthouse Performance 점수 90+ 달성

### 에러 케이스

- [ ] 병렬 페칭 중 하나 실패 시 전체 페이지 에러 처리 (error.tsx 동작)
- [ ] 마지막 페이지에서 '더 보기' 버튼 미표시

### 경계값

- [ ] 상품 1개인 카테고리에서 '더 보기' 버튼 미표시
- [ ] 상품 없는 카테고리에서 EmptyState 정상 표시
- [ ] 느린 네트워크(Throttle) 상황에서 스켈레톤 UI 정상 표시

### 성능 테스트

- [ ] Lighthouse Performance: 90+
- [ ] LCP(Largest Contentful Paint): < 2.5초
- [ ] CLS(Cumulative Layout Shift): < 0.1
- [ ] 최적화 전후 성능 비교 기록

### 회귀 테스트

- [ ] 홈 > 카테고리 > 상품 상세 전체 플로우 정상
- [ ] 검색 + 정렬 조합 정상 동작
- [ ] 모바일(375px) 반응형 레이아웃 정상

## 수락 기준

- [ ] Lighthouse Performance 점수 90+ 달성
- [ ] 홈 페이지 병렬 페칭 적용 (Promise.all)
- [ ] 상품 카드 이미지 `sizes` 속성 적용
- [ ] '더 보기' 버튼 정상 동작
- [ ] 웹 폰트 최적화 적용 (next/font)
- [ ] 기존 기능 회귀 없음 (E2E 테스트 통과)
- [ ] `npm run check-all && npm run build` 성공

---

**작업 상태**: 대기 중
**의존성**: Task 010-1 완료 (완료됨)
**다음 작업**: Task 013 (Task 011과 함께 완료 후)
