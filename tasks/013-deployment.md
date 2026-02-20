# Task 013: 배포 및 운영 준비

## 목표

Vercel 배포 설정, 프로덕션 환경 변수 구성, 에러 모니터링(Vercel Analytics), 로깅 시스템 운영 설정, 배포 체크리스트 검증, 크로스 브라우저 테스트를 수행하여 프로덕션 배포를 완료한다.

## 배경

- Phase 4 Task 011(SEO), Task 012(성능 최적화) 완료 후 진행
- `docs/deployment-checklist.md` 파일이 존재하나 다른 프로젝트 기준으로 작성됨 → Jangs 리빙 기준으로 업데이트 필요
- `vercel.json`이 이미 존재 → 내용 확인 후 필요 시 수정
- `src/lib/logger.ts` 기구현 → 프로덕션 환경 설정 확인만 필요

## 관련 파일

| 파일                           | 작업 유형 | 설명                                      |
| ------------------------------ | --------- | ----------------------------------------- |
| `src/app/layout.tsx`           | 수정      | Vercel Analytics 컴포넌트 추가            |
| `src/lib/logger.ts`            | 참조      | 구조화된 로깅 시스템 (프로덕션 레벨 확인) |
| `src/lib/env.ts`               | 참조      | 환경변수 검증 스키마                      |
| `vercel.json`                  | 수정      | Vercel 배포 설정 확인 및 업데이트         |
| `docs/deployment-checklist.md` | 수정      | Jangs 리빙 기준으로 내용 업데이트         |

## 구현 단계

### 단계 1: deployment-checklist.md 업데이트

- [ ] `docs/deployment-checklist.md`를 Jangs 리빙 프로젝트 기준으로 업데이트
  - 불필요한 항목 제거 (관리자 로그인, 견적서 등 다른 프로젝트 내용)
  - Jangs 리빙 기능 테스트 항목으로 교체
    - 홈 페이지 Dashboard 로드
    - 카테고리별 상품 목록 표시
    - 상품 상세 페이지 표시
    - '네이버에서 구매하기' 링크 동작
    - 검색/정렬 기능

### 단계 2: Vercel Analytics 적용

- [ ] `@vercel/analytics` 패키지 설치
  ```
  npm install @vercel/analytics
  ```
- [ ] `src/app/layout.tsx`에 `<Analytics />` 컴포넌트 추가
- [ ] (선택) `@vercel/speed-insights` 패키지 설치 및 적용

### 단계 3: 환경 변수 및 vercel.json 확인

- [ ] `vercel.json` 내용 확인 및 필요 시 업데이트
  - 빌드 명령어: `npm run build`
  - 출력 디렉토리: `.next`
- [ ] 프로덕션 필요 환경변수 목록 정리
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`
  - `NEXT_PUBLIC_BASE_URL` (프로덕션 도메인)
- [ ] `src/lib/env.ts`에서 `NEXT_PUBLIC_BASE_URL` 환경변수 검증 추가 (미적용 시)

### 단계 4: 로거 프로덕션 설정 확인

- [ ] `src/lib/logger.ts` 로그 레벨이 프로덕션에서 `error`/`warn`만 출력하는지 확인
- [ ] `NODE_ENV=production` 시 `debug`/`info` 로그 억제 확인

### 단계 5: 최종 빌드 검증

- [ ] `npm run check-all` 통과
- [ ] `npm run build` 성공
- [ ] 빌드 output 크기 확인 (번들 사이즈)

### 단계 6: Playwright MCP 크로스 브라우저 테스트

- [ ] Chrome에서 전체 기능 테스트
- [ ] Firefox에서 전체 기능 테스트
- [ ] 모바일 뷰포트(375px) 반응형 검증
- [ ] 태블릿 뷰포트(768px) 반응형 검증

### 단계 7: Vercel 배포 실행

- [ ] GitHub 저장소 main 브랜치 push
- [ ] Vercel Dashboard에서 환경변수 설정
- [ ] Vercel 자동 배포 확인
- [ ] 프로덕션 URL에서 기능 테스트

## 테스트 체크리스트

### Happy Path

- [ ] 프로덕션 URL 접근 시 홈 페이지 정상 로드
- [ ] Notion 실제 데이터가 프로덕션에서 정상 표시
- [ ] 카테고리 클릭 → 상품 목록 표시
- [ ] 상품 클릭 → 상품 상세 페이지 표시
- [ ] '네이버에서 구매하기' 버튼 → 스마트스토어 새 탭 이동
- [ ] 검색 기능 정상 동작
- [ ] 정렬 기능 정상 동작
- [ ] Vercel Analytics 대시보드에서 페이지뷰 수집 확인

### 에러 케이스

- [ ] 존재하지 않는 상품 ID → 404 페이지 정상 표시
- [ ] 존재하지 않는 카테고리 slug → 404 페이지 정상 표시

### 크로스 브라우저 테스트

- [ ] Chrome 최신 버전 정상 동작
- [ ] Firefox 최신 버전 정상 동작
- [ ] Edge 최신 버전 정상 동작 (가능 시)

### 반응형 테스트

- [ ] 모바일(375px): 햄버거 메뉴, 2열 그리드 정상
- [ ] 태블릿(768px): 3열 그리드 정상
- [ ] 데스크톱(1280px): 4열 그리드, 네비게이션 정상

### 성능 확인

- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse SEO: 90+
- [ ] Lighthouse Accessibility: 90+

## 수락 기준

- [ ] Vercel 배포 성공 및 프로덕션 URL 정상 접근
- [ ] Notion 실제 데이터 프로덕션에서 정상 표시
- [ ] Vercel Analytics 데이터 수집 확인
- [ ] Chrome, Firefox 크로스 브라우저 정상 동작
- [ ] 모바일(375px) 반응형 레이아웃 정상
- [ ] `docs/deployment-checklist.md` Jangs 리빙 기준으로 업데이트 완료
- [ ] 배포 체크리스트 모든 항목 통과

---

**작업 상태**: 대기 중
**의존성**: Task 011 완료 + Task 012 완료
**다음 작업**: MVP 완료
