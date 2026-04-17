# Mobile Responsive 개편 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모바일(320px~) Critical + Major 이슈를 해결해 가로 스크롤 없이 iOS/Android에서 완전히 사용 가능하게 만든다.

**Architecture:** 코드 분석 결과 대부분의 이슈가 이미 수정되어 있음. 실제 남은 작업은 (1) globals.css에 `overflow-x: clip` 추가, (2) DeployPanel URL 줄바꿈, (3) DevTools 검증 3단계로 매우 좁다.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS, TypeScript

---

## 현황 요약 (코드 분석 기준)

이미 구현 완료된 항목:
- ✅ 랜딩 nav: GitHub 버튼 `hidden sm:flex`, Studio 버튼 모바일 축약 텍스트
- ✅ 랜딩 Hero: `px-4 sm:px-6`, h1 `clamp(28px,6vw,56px)`, CTA `w-full sm:w-auto flex-col sm:flex-row`
- ✅ Studio nav: `⋯` 드롭다운 `md:hidden`, 데스크톱 3버튼 `hidden md:flex`
- ✅ Studio 모바일 편집/프리뷰 탭 전환 (`mobileView` state, `lg:hidden`)
- ✅ Studio 4탭: `overflow-x-auto` 스크롤
- ✅ Markdown textarea: `min-h-[50vh]`, `text-base`(16px)
- ✅ Form inputs: `.input` 클래스 → `font-size: var(--fs-input)` = 16px
- ✅ RowControls: `btn-sm` (40px — 밀집 행에서 허용 범위)
- ✅ CardEditor: 핀치줌 (pointersRef/pinchRef), 핸들 `h-11 w-11`(44px), Pointer Events
- ✅ Deploy 버튼: `btn-md`(44px), 입력 `text-base`

실제 남은 작업:
- ❌ `body { overflow-x: clip }` 미적용
- ❌ DeployPanel 배포 결과 URL `<a>` — `break-all` 없어서 긴 URL이 가로 overflow
- ❌ DeployPanel QR 대상 라디오 레이블 `font-mono text-[11px]` URL — 좁은 폭에서 overflow 가능

---

## 파일 목록

| 파일 | 변경 |
|------|------|
| `app/globals.css` | body `overflow-x: clip` 추가 |
| `components/DeployPanel.tsx` | 결과 URL, QR 라디오 URL `break-all` 추가 |

---

### Task 1: globals.css — body overflow-x 차단

**Files:**
- Modify: `app/globals.css:160-166`

- [ ] **Step 1: body에 overflow-x: clip 추가**

`app/globals.css` 160번째 줄 부근 `html, body { height: 100%; }` 바로 아래에 추가:

```css
html, body { height: 100%; }
body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--fg);
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
```

- [ ] **Step 2: 커밋**

```bash
cd /Users/stpark/99.personal/01.laboratory/card-portfolio
git add app/globals.css
git commit -m "fix(mobile): prevent horizontal scroll via overflow-x clip"
```

---

### Task 2: DeployPanel — 긴 URL overflow 방지

**Files:**
- Modify: `components/DeployPanel.tsx:190-252`

이슈:
1. 배포 성공 결과 URL `<a>` (line 252) — `break-all` 없음
2. QR 라디오 레이블 안의 `font-mono text-[11px]` URL span — 좁은 폭에서 overflow

- [ ] **Step 1: 결과 URL break-all 추가**

`components/DeployPanel.tsx` 252번째 줄:

```tsx
// 변경 전
<a href={state.url} target="_blank" rel="noreferrer" className="text-xs text-green-700 underline">
  {state.url}
</a>

// 변경 후
<a href={state.url} target="_blank" rel="noreferrer" className="break-all text-xs text-green-700 underline">
  {state.url}
</a>
```

- [ ] **Step 2: QR 라디오 레이블 URL span에 break-all 추가**

`components/DeployPanel.tsx` QR 라디오 섹션 (line ~190, ~200):

```tsx
// "배포 사이트 루트" 라디오 레이블 (line ~190)
// 변경 전
<span>배포 사이트 루트 <span className="font-mono text-[11px]">{predictedUrl}</span></span>

// 변경 후
<span>배포 사이트 루트 <span className="break-all font-mono text-[11px]">{predictedUrl}</span></span>
```

```tsx
// "배포 사이트 이력 앵커" 라디오 레이블 (line ~200)
// 변경 전
<span>배포 사이트 이력 앵커 <span className="font-mono text-[11px]">{predictedUrl}/#resume</span>

// 변경 후
<span>배포 사이트 이력 앵커 <span className="break-all font-mono text-[11px]">{predictedUrl}/#resume</span>
```

또한 하단 "현재 QR" 표시 (line ~225):

```tsx
// 변경 전
<span className="font-mono">{resolveQrUrl(profile)}</span>

// 변경 후
<span className="break-all font-mono">{resolveQrUrl(profile)}</span>
```

- [ ] **Step 3: 커밋**

```bash
git add components/DeployPanel.tsx
git commit -m "fix(mobile): add break-all to long URLs in DeployPanel"
```

---

### Task 3: DevTools 검증

- [ ] **Step 1: 개발 서버 시작**

```bash
cd /Users/stpark/99.personal/01.laboratory/card-portfolio
npm run dev
```

브라우저에서 `http://localhost:3000` 열기

- [ ] **Step 2: Chrome DevTools 모바일 에뮬레이션 확인**

DevTools → Toggle Device Toolbar → 아래 순서로 체크:

| 기기 | 폭 | 체크 포인트 |
|------|------|------|
| iPhone SE | 375px | 랜딩 nav, Hero, Studio 탭 |
| Galaxy S20 | 360px | Studio 편집/프리뷰 전환, Form 입력 |
| 커스텀 | 320px | 가로 스크롤 없음 확인 |

각 화면에서:
- 가로 스크롤바 없음 ✓
- 모든 버튼이 탭으로 누를 수 있는 크기 ✓
- input 포커스 시 zoom 없음 (iOS 에뮬 기준) ✓
- Studio 편집↔프리뷰 탭 전환 동작 ✓

- [ ] **Step 3: 발견된 추가 이슈 수정**

검증 중 새로운 🔴/🟡 이슈 발견 시 동일 커밋 패턴으로 수정:
- 파일 수정 → `git add <file>` → `git commit -m "fix(mobile): <what>"`

- [ ] **Step 4: 최종 커밋 (추가 수정 없으면 생략)**

```bash
git log --oneline -5
```

Expected: Task 1, 2 커밋이 보임.

---

## 성공 기준

- [ ] 320px에서 가로 스크롤 없음
- [ ] Studio 편집/프리뷰 탭 전환 동작
- [ ] iOS Safari에서 input 포커스 zoom 없음 (font-size 16px)
- [ ] Deploy 결과 URL이 좁은 폭에서 줄바꿈
- [ ] CardEditor 핀치줌 동작 (실기기 or iOS Simulator)
