# 모바일 반응형 전면 개편 계획

작성: 2026-04-15

## 배경

현재 랜딩(`/`)과 Studio(`/studio`) 모두 데스크톱 뷰포트 전제로 짜여 있어 모바일에서 레이아웃이 깨진다. **처음부터 끝까지** 모바일 우선으로 재설계한다.

## 작업 환경

- `npm run dev:mobile` (이미 추가됨) → 0.0.0.0:3100 바인딩
- 주 검증: **Chrome DevTools Device Mode** (iPhone 15 Pro / Pixel 7 / iPad Mini)
- 실기기: `http://10.10.20.40:3100` (Mac IP, Wi-Fi 기준)
- iOS Simulator는 Xcode 설치 완료 후 병행
- 최소 지원 폭: **320px** (iPhone SE 1세대)

## 원칙

1. **모바일 우선 CSS** — Tailwind의 기본 = 모바일. `sm:`/`md:`/`lg:`부터 데스크톱 확장.
2. **터치 타겟 최소 44×44px** (Apple HIG)
3. **가로 스크롤 금지** — 최상위 컨테이너는 `overflow-x: clip` 또는 `max-w-full`.
4. **sticky nav 높이 = h-14**은 유지. 탭바는 모바일에서 하단 고정 또는 상단 가로 스크롤.
5. **폰트 스케일** — 모바일에서 본문 15~16px, 제목은 `clamp()` 기반.
6. **입력 필드 zoom 방지** — iOS Safari는 `font-size: 16px` 미만 input에서 auto-zoom. 모든 `input`/`textarea` ≥ 16px.

## 영역별 체크리스트

### 1. 랜딩 `/` (`app/page.tsx`)
- [ ] Hero 섹션: 타이포 스케일 (`clamp`), CTA 버튼 full-width 스택
- [ ] Feature grid: 데스크톱 3-col → 모바일 1-col, hairline 유지
- [ ] Sticky nav: 메뉴를 햄버거 또는 logo + CTA만
- [ ] `overflow-x` 검사

### 2. Studio 쉘 `/studio` (`components/Studio.tsx`)
- [ ] **4탭 내비게이션** — 좁은 폭에서 가로 스크롤 또는 2x2 그리드, 현재 탭 강조
- [ ] 콘텐츠 영역 padding 축소 (`px-4 sm:px-6 lg:px-8`)
- [ ] 탭 간 상태 보존 (현재는 OK로 추정, 확인)

### 3. Markdown 탭
- [ ] textarea 높이 `min-h-[60vh]`, 폰트 16px
- [ ] 붙여넣기/포커스 시 가상 키보드 대비 (`h-dvh` 활용)

### 4. Form 탭 (Experience/Project CRUD)
- [ ] 2-col 입력 그리드 → 모바일 1-col
- [ ] 추가/삭제/↑↓ 버튼을 44px 터치 영역 확보
- [ ] 리스트 아이템 카드화 (border + padding)

### 5. CardEditor (`components/CardEditor.tsx`)
- [ ] **가장 어려운 영역**. 드래그·휠·핸들이 터치 이벤트에서 어색.
- [ ] Pointer Events API로 마우스/터치 통합 (`onPointerDown/Move/Up`)
- [ ] 휠 줌 → 핀치 줌 (`touches.length === 2`에서 거리 계산)
- [ ] 핸들 크기 모바일에서 확대 (32px 이상)
- [ ] 캔버스 폭은 컨테이너 100%, 높이는 비율 유지

### 6. Deploy 탭 (`components/DeployPanel.tsx`)
- [ ] Token input 폰트 16px, full-width
- [ ] 배포 진행 상태 로그 `overflow-auto`
- [ ] 결과 URL 복사 버튼 가독성

### 7. 배포된 카드 사이트 (`lib/generate-site.ts`)
- [ ] 이력 섹션(`#resume`) 반응형 검증
- [ ] 90도 회전 카드의 스크롤 힌트 위치
- [ ] 기존 `@media (orientation: portrait)` 로직 그대로인지 확인

## 실행 순서 (권장)

1. **진단 세션** — 7개 영역을 Chrome DevTools device mode로 훑으면서 스크린샷 + 이슈 목록 작성 (`docs/plans/mobile-issues.md`)
2. **공통 토큰 보강** — `app/globals.css`에 `--space-*`, breakpoint-aware 타이포 변수 추가
3. **랜딩 → Studio 쉘 → 각 탭 → CardEditor → 배포 HTML** 순서로 영역별 PR (각 커밋 단위)
4. CardEditor는 별도 스파이크 후 병합

## 성공 기준

- [ ] iPhone SE(320px)~iPad Mini(768px) 전 구간에서 가로 스크롤 없음
- [ ] 모든 터치 타겟 ≥ 44×44px
- [ ] Studio에서 CV 입력 → 카드 편집 → 배포까지 모바일만으로 가능
- [ ] Lighthouse Mobile score ≥ 90 (Performance, Accessibility)

## 참고 파일

- `app/page.tsx` — 랜딩
- `app/globals.css` — 디자인 토큰
- `components/Studio.tsx` — 4탭 쉘
- `components/CardEditor.tsx` — 드래그 에디터
- `components/DeployPanel.tsx` — 배포 패널
- `lib/generate-site.ts` — 배포 HTML 생성기 (모바일 CSS 포함)
