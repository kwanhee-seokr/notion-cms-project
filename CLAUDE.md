# Claude Code 개발 지침

**Jangs 리빙 스마트스토어 홍보 사이트 MVP**

- Notion CMS 기반으로 네이버 스마트스토어 'Jangs 리빙'의 상품을 카테고리별 Dashboard 형태로 홍보하고, 방문자를 스마트스토어 구매 페이지로 유도하는 웹사이트

## Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/roadmaps/ROADMAP.md

## 핵심 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19.1.0 + TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york style)
- **Validation**: Zod
- **UI Components**: Radix UI + Lucide Icons
- **External API**: @notionhq/client (Notion API SDK)
- **Development**: ESLint + Prettier + Husky + lint-staged

## 프로젝트 구조

```
src/
├── app/                    # App Router 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 (Dashboard)
│   ├── category/[slug]/   # 카테고리 페이지
│   └── product/[id]/      # 상품 상세 페이지
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── layout/            # Header, Footer, MobileNav
│   ├── product/           # 상품 카드, 그리드, 가격 등
│   ├── category/          # 카테고리 카드, 그리드
│   ├── search/            # 검색바, 정렬
│   ├── sections/          # 홈 페이지 섹션
│   └── common/            # 페이지네이션, 빈 상태
├── lib/
│   ├── services/          # Notion API 서비스 레이어
│   ├── utils/             # 유틸리티 (product-parser)
│   ├── constants.ts       # 카테고리, 정렬, 설정 상수
│   ├── env.ts             # 환경변수 검증 (Zod)
│   ├── format.ts          # 날짜, 통화, 할인율 포맷
│   ├── logger.ts          # 구조화된 로깅
│   └── notion.ts          # Notion API 클라이언트
└── types/                 # TypeScript 타입 정의
```

## 자주 사용하는 명령어

```bash
npm run dev         # 개발 서버 실행 (Turbopack)
npm run build       # 프로덕션 빌드
npm run check-all   # typecheck + lint + format:check
```

## 작업 완료 체크리스트

```bash
npm run check-all   # 모든 검사 통과 확인
npm run build       # 빌드 성공 확인
```

## 코딩 규칙

- 2칸 들여쓰기, 작은따옴표
- React 컴포넌트: PascalCase
- 변수/함수: camelCase
- 비동기: async/await + try-catch
- 주석/커밋/문서: 한국어
- Server Component 우선, Client는 최소한으로
