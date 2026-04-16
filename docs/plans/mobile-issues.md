# 모바일 반응형 진단 — 이슈 목록

작성: 2026-04-16 · 방식: 소스 정적 분석 (브라우저 DevTools 스크린샷 후속 첨부 예정)
대상 최소폭: 320px (iPhone SE 1세대)

범례: 🔴 critical (레이아웃 깨짐/사용 불가) · 🟡 major (UX 저하) · 🟢 minor (폴리시)

---

## 1. 랜딩 `/` — `app/page.tsx`

- 🔴 **nav 우측 버튼 2개 + 로고가 320px에서 overflow 가능성**. `px-6`(24px) × 2 + 로고 텍스트 + GitHub 버튼(h-8 px-3) + "스튜디오 열기"(h-8 px-3 한글 5자) → 합산 약 300~320px. gap-2 포함 시 아이폰 SE에서 줄바꿈/밀림. (p.26, p.35–52)
- 🟡 **nav 버튼 높이 h-8(32px) = 터치 타겟 44px 미만**. (p.40, p.47) HIG 위반.
- 🟡 **Hero `px-6`** 좁은 폭 낭비. `px-4 sm:px-6` 권장. (p.56)
- 🟡 **Hero h1 `text-4xl`(36px) md:`text-6xl`(60px)** 320px에서 36px은 여유 있으나 `clamp()` 미사용 → 계획서 원칙 5 위반. (p.63)
- 🟢 **Hero CTA 버튼 h-11(44px)** 터치 타겟 OK. 다만 모바일에서 full-width 스택(계획서 요구)이 아님 — `flex-wrap` + auto-width 상태. (p.75–92)
- 🟢 Feature grid는 `grid-cols-1 md:grid-cols-3`로 이미 모바일 대응. hairline은 `borderRight`이라 1-col에서 무의미한 스타일은 자동 무력화됨. ✅
- 🟢 Footer는 `flex-wrap` 적용 OK. (p.129)

## 2. Studio 쉘 `/studio` — `components/Studio.tsx`

- 🔴 **메인 레이아웃 `grid-cols-1 lg:grid-cols-2`** — lg(1024px) 미만에서는 1-col이지만, **입력/프리뷰가 세로로 쌓이면 각 섹션이 `h-dvh`의 절반도 안 되는 공간에 스크롤 발생**. 모바일에서는 탭으로 입력/프리뷰 전환 UI 필요. (p.143)
- 🔴 **상단 nav 우측 3개 버튼(Download JSON / Reset / Clear)이 320px 초과**. `px-6` + 로고·sub-label + 버튼 3×h-8 → overflow. (p.120–140)
- 🔴 **4탭 nav + 우측 액션(.md 업로드 / 파싱)이 같은 줄**에서 좁은 폭에 터짐. (p.146–171)
- 🟡 nav 로고 옆 `/ Studio` sub-label은 모바일에서 생략 후보. (p.126)
- 🟡 **모든 action 버튼 h-8**(32px) — 44px 미달. 상단 nav 3개, 탭 우측 2개, 리스트 RowControls(h-7 w-7 = 28px). (p.131–139, p.163–169, p.348–350)
- 🟡 탭 하단 underline `absolute inset-x-2 -bottom-[14px]` — 컨테이너 overflow-hidden 환경에서 underline 잘림 위험. (p.157)
- 🟡 **Form 입력 `.input` font-size 14px** → iOS Safari auto-zoom 유발 (계획서 원칙 6 위반). (p.319)
- 🟡 Markdown textarea `text-xs`(12px) — iOS auto-zoom. (p.181)
- 🟡 `min-h-[320px]` textarea는 `min-h-[60vh]` 계획서 요구와 어긋남. (p.181)
- 🟡 Preview 컬럼 `min-h-[60vh]` + `py-10` → 모바일 세로 쌓임 상황에서 카드 렌더 공간 협소. (p.278)
- 🟢 `h-dvh` 사용 ✅ (p.119)
- 🟢 Form 2-col grid는 `grid-cols-1 sm:grid-cols-2`로 이미 모바일 대응. ✅ (p.189, p.203, p.208)
- 🟢 RowControls(↑/↓/✕) **h-7 w-7 = 28px** → 44px 미달, 오터치 위험. (p.348–350)

## 3. Markdown 탭

- 🔴 textarea font 12px → iOS zoom. (Studio.tsx p.181)
- 🟡 `min-h-[320px]` → 모바일에서 화면 절반 이상이 탭 헤더/기타 UI에 먹힘. `min-h-[60vh]` 또는 `h-dvh - nav` 계산 필요.
- 🟡 파싱 안내 문구(`text-[11px]`) 가독성 낮음. (p.183)
- 🟡 **가상 키보드 올라올 때 `h-dvh` 기반 레이아웃이 재계산 안 됨** — `100dvh`/`100svh` 혼용 검토 필요.

## 4. Form 탭

- 🟡 **모든 `<input>`/`<textarea>` font 14px** → iOS zoom. (Studio.tsx p.319)
- 🟡 RowControls 터치 타겟 28px (p.348–350).
- 🟡 Experience/Project 카드 `p-3`(12px) — 모바일에서 `p-4` 권장.
- 🟡 **추가/삭제 버튼 `px-3 py-1.5`** 터치 영역 부족. (p.365, p.402)
- 🟢 2-col grid는 `sm:grid-cols-2`로 모바일 1-col ✅.

## 5. CardEditor — `components/CardEditor.tsx`

- 🔴 **wheel 기반 줌이 터치에서 동작 안 함** — 핀치 제스처 미구현. `touches.length === 2` 경로 없음. (p.94–99)
- 🔴 **scale 핸들 20px(h-5 w-5)** — 터치 타겟 44px 미달, 명함 우하단에서 정확히 잡기 어려움. (p.184)
- 🟡 `onMouseEnter/Leave`로 grid guide hover — 터치에서는 무효. (p.107–108) Pointer 기반으로 교체.
- 🟡 `max-w-[420px]` 고정 — 320px에서는 margin 없이 꽉 차지만 `px` 완충 부재 시 edge까지 붙음. (p.102)
- 🟢 `touch-none` class로 기본 터치 스크롤은 차단됨 ✅ (p.109)
- 🟢 `pointerdown/move/up` 이미 Pointer Events 사용 — 계획서가 요구한 통합은 이미 부분적으로 달성. (p.36–55) 다만 핀치/두 손가락은 별도 코드 필요.
- 🟢 `aspectRatio: 1.75/1` 비율 유지 ✅ (p.111)

## 6. Deploy 탭 — `components/DeployPanel.tsx`

- 🟡 **Vercel Token input `font-mono text-xs`(12px)** → iOS zoom + 가독성 저하. Password 마스킹으로 zoom은 일부 우회되나 font-size 16px 권장. (p.117–118)
- 🟡 프로젝트 이름/Team ID input `text-sm`(14px) → iOS zoom. (p.152, p.164)
- 🟡 QR 대상 라디오 그룹 `text-[11px]` 모노 URL이 **좁은 폭에서 가로 overflow** 가능. `break-all` 또는 `truncate` 필요. (p.186–224)
- 🟡 **Deploy 버튼 `px-4 py-2`** — 계산 높이 약 32px. 44px 승격 필요. (p.245)
- 🟡 결과 URL `<a>` 줄바꿈 없이 긴 문자열 → horizontal scroll. `break-all` 권장. (p.250)
- 🟢 `grid-cols-1 sm:grid-cols-2` ✅ (p.145)
- 🟢 `flex-wrap` checkbox row ✅ (p.121)

## 7. 배포 HTML — `lib/generate-site.ts`

- 🟢 `min-height: 100dvh`, `overflow-x: hidden` ✅ (p.123)
- 🟢 `@media (orientation: portrait) and (max-width: 640px)`로 90도 회전 로직 이미 존재 ✅ (p.126–134)
- 🟡 **회전 시 `margin: calc((82dvh / 1.75 - 82dvh) / 2) 0`** — 1.75 비율 기준 회전 후 높이 보정 공식. 작은 폰(320×568)에서 hero + QR 카드가 **뷰포트에 안 맞아 잘림** 가능성. dvh 기반이라 주소창 토글에 흔들림.
- 🟡 **`.scroll-hint` hover 전용 인터랙션** — 모바일 탭에는 존재하지만 터치 타겟 크기 미지정. (p.165)
- 🟡 `.resume { padding: 64px 24px 96px }` 모바일 과한 상하 여백. `padding: 40px 16px 64px` 정도로 축소 제안. (p.168)
- 🟡 `.resume h1 36px` → `clamp(28px, 6vw, 36px)` 고려.
- 🟡 `.back-sub { white-space: nowrap; ... ellipsis }` — github/blog URL이 말줄임 처리되지만 모바일에서 **QR 110px + 여백으로 info 영역 200px 미만** → 이메일조차 ellipsis될 수 있음. (p.164, p.239–245)
- 🟡 `.socials a { width/height 36px }` — 44px 미달. (p.178)
- 🟢 `chips flex-wrap` ✅

---

## 교차 관심사 (전 영역 공통)

| 축 | 현황 | 계획서 원칙 | 조치 |
|---|---|---|---|
| input font-size | 12~14px 혼재 | 원칙 6 (≥16px) | `.input` 토큰을 16px로 상향 (SC 탭 전체 적용) |
| 터치 타겟 | 대부분 28–36px | 원칙 2 (44×44) | 공통 버튼 토큰 `h-9` → `h-11` 승격 / RowControls `h-7` → `h-10 w-10` |
| 타이포 스케일 | 고정 px + md: 분기 | 원칙 5 (clamp) | globals.css에 `--fs-h1: clamp(28px, 6vw, 56px)` 등 추가 |
| 가로 스크롤 | nav/tab/URL overflow 위험 | 원칙 3 | 최상위 `overflow-x: clip`, 긴 URL `break-all` |
| 브레이크포인트 | `sm:`(640)/`md:`(768)/`lg:`(1024) 혼용 | 원칙 1 | 상시 모바일 우선 점검 — 특히 Studio 쉘은 `lg:` 기준을 `md:`로 당길지 검토 |

---

## 다음 단계 제안 (계획서 2~3단계 진입 전 의사결정 포인트)

1. **공통 토큰 먼저 (2단계)** — `app/globals.css`에 `--fs-*`, `--touch-*`, `--space-*` 추가. `.input` 기본 16px로.
2. **랜딩 nav** 햄버거/압축안 (3단계 첫 PR).
3. **Studio 쉘 레이아웃 모드 결정** — 모바일에서 (a) 입력/프리뷰를 탭 전환, (b) 세로 스크롤, (c) 바텀시트 중 택1. **→ 사용자 결정 필요**.
4. **CardEditor 스파이크** — 핀치 줌 + 44px 핸들은 별도 브랜치에서 검증 후 병합.
5. **배포 HTML**은 마지막. 회전 공식/QR 뒷면 레이아웃 재설계 필요.

## 미완료 (이 패스에서 못 한 것)

- 실제 DevTools 스크린샷 (iPhone SE / 15 Pro / Pixel 7 / iPad Mini) 3 해상도 × 주요 뷰 ≈ 15장. 사용자가 `npm run dev:mobile` 띄운 뒤 수동 캡처가 빠름.
- Lighthouse Mobile 실측.
- 실기기 확인 (10.10.20.40:3100).
