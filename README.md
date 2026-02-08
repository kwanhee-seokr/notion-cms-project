# Jangs 리빙 - 스마트스토어 홍보 사이트

Notion CMS 기반으로 네이버 스마트스토어 **[Jangs 리빙](https://smartstore.naver.com/jangsliving)** 의 상품을 홍보하는 웹사이트입니다.

## 프로젝트 개요

- Notion 데이터베이스를 CMS로 활용하여 상품 정보를 관리
- 카테고리별 Dashboard 형태의 상품 쇼케이스 제공
- 상품 클릭 시 네이버 스마트스토어 구매 페이지로 연결

## 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 15 (App Router + Turbopack) |
| **Language** | TypeScript 5, React 19 |
| **CMS** | Notion API (@notionhq/client) |
| **Styling** | TailwindCSS v4 + shadcn/ui (new-york) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

## 주요 기능

- 카테고리별 상품 목록 (가구/인테리어, 생활/건강, 패션잡화 등 8개 카테고리)
- BEST/NEW 태그 상품 우선 노출
- 상품 검색 및 정렬 (최신순, 가격순, 할인율순)
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 네이버 스마트스토어 구매 링크 연결

## 시작하기

### 사전 요구사항

- Node.js 18.17+
- Notion API 키 ([발급 방법](https://developers.notion.com/docs/getting-started))
- Notion 데이터베이스 설정

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Notion API 키와 데이터베이스 ID 입력
```

### 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

### 빌드

```bash
npm run build
```

## 프로젝트 구조

```
notion-cms-project/
├── docs/                    # 프로젝트 문서
│   ├── PRD.md              # 제품 요구사항 문서
│   ├── guides/             # 개발 가이드
│   └── roadmaps/           # 로드맵 및 분석 자료
├── src/
│   ├── app/                # Next.js App Router 페이지
│   ├── components/         # React 컴포넌트
│   └── lib/                # 유틸리티 및 API 클라이언트
├── public/                 # 정적 파일
├── CLAUDE.md               # Claude Code 개발 지침
└── package.json
```

## 환경 변수

| 변수명 | 설명 |
|--------|------|
| `NOTION_API_KEY` | Notion Internal Integration Token |
| `NOTION_DATABASE_ID` | 상품 데이터베이스 ID |

## 문서

- [PRD (제품 요구사항)](./docs/PRD.md)
- [베스트 프랙티스 분석](./docs/roadmaps/notion-cms-smartstore-best-practices.md)

## 라이선스

MIT
