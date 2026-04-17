# Mobile Responsive 개편 설계

작성: 2026-04-17

## 배경

랜딩(`/`)과 Studio(`/studio`) 전 영역이 데스크톱 전제로 구현되어 모바일에서 레이아웃이 깨진다.
기존 진단(`docs/plans/mobile-issues.md`)을 기반으로 🔴 Critical + 🟡 Major를 해결한다.
🟢 Minor(배포 HTML 회전 공식, Lighthouse 측정 등)는 이번 범위 외.

## 결정 사항

- Studio 모바일 입력/프리뷰 전환: **탭 전환 방식** (상단 "입력 | 프리뷰" 탭)
- 실행 순서: **공통 토큰 선행 → 영역별 순차**

## 범위

| 영역 | 파일 | 대상 |
|------|------|------|
| 공통 토큰 | `app/globals.css` | 🔴🟡 전체 |
| 랜딩 | `app/page.tsx` | 🔴🟡 |
| Studio 쉘 | `components/Studio.tsx` | 🔴🟡 |
| Form 탭 | `components/Studio.tsx` 내부 | 🟡 |
| Markdown 탭 | `components/Studio.tsx` 내부 | 🟡 |
| Deploy 탭 | `components/DeployPanel.tsx` | 🟡 |
| CardEditor | `components/CardEditor.tsx` | 🔴🟡 |

## 설계

### 1. 공통 토큰 (`app/globals.css`)

```css
/* iOS Safari auto-zoom 방지 — 전역 */
input, textarea, select { font-size: 16px; }

/* 가로 스크롤 방지 */
body { overflow-x: clip; }
```

Tailwind 클래스 표준:
- 터치 타겟: `h-11`(44px) / 아이콘 버튼: `h-10 w-10`(40px, 패딩 포함 44px)
- 페이지 패딩: `px-4 sm:px-6`
- 타이포: h1 `text-[clamp(28px,6vw,56px)]`, 본문 `text-base`(16px)

### 2. 랜딩 (`app/page.tsx`)

**🔴 nav overflow (320px)**
- 변경 전: 로고 + GitHub 버튼 + "스튜디오 열기" 버튼 한 줄
- 변경 후: 모바일에서 로고 + "스튜디오 열기"만 표시, GitHub 링크는 제거 또는 `hidden sm:flex`

**🟡 터치 타겟**
- nav 버튼 `h-8` → `h-11`

**🟡 Hero**
- `px-6` → `px-4 sm:px-6`
- h1: `text-[clamp(28px,6vw,48px)]`
- CTA 버튼: 모바일에서 `w-full flex-col gap-3`, 데스크톱에서 `flex-row`

### 3. Studio 쉘 (`components/Studio.tsx`)

**🔴 상단 nav overflow**
- Download JSON / Reset / Clear 3버튼 → `⋯` 드롭다운으로 접기 (모바일에서)
- `hidden sm:flex` 패턴으로 데스크톱에서는 그대로 노출

**🔴 4탭 + 우측 액션 같은 줄 overflow**
- 탭 행과 액션(.md 업로드/파싱) 행을 분리 (`flex-col`)
- 액션은 탭 아래 별도 줄 또는 현재 탭 컨텐츠 상단에 배치

**🔴 모바일 레이아웃 — 입력/프리뷰 탭 전환**
- `lg:grid-cols-2` → 모바일(`< lg`)에서 탭 전환
- 탭: "편집" / "미리보기" 두 개 버튼, 상단 고정
- 데스크톱: 기존 2-col 유지

**🟡 모든 버튼 터치 타겟**
- `h-8` → `h-11`, 아이콘 버튼 `h-7 w-7` → `h-10 w-10`

### 4. Form 탭

**🟡 input/textarea font-size**
- 공통 토큰에서 전역 적용으로 해결

**🟡 RowControls 터치 타겟**
- `h-7 w-7`(28px) → `h-10 w-10`(40px)

**🟡 추가/삭제 버튼**
- `py-1.5` → `py-2.5` (높이 44px 근접)

### 5. Markdown 탭

**🟡 textarea 높이**
- `min-h-[320px]` → `min-h-[60vh]`

**🟡 font-size**
- `text-xs`(12px) → `text-sm`(14px) 최소 (공통 16px 토큰 적용 시 자동 해결)

### 6. Deploy 탭 (`components/DeployPanel.tsx`)

**🟡 input font-size**
- 공통 토큰으로 해결

**🟡 Deploy 버튼**
- `px-4 py-2` → `h-11 px-6`

**🟡 결과 URL / 긴 문자열**
- `break-all` 추가

### 7. CardEditor (`components/CardEditor.tsx`)

**🔴 핀치 줌 미구현**
- `onPointerDown`에서 `touches.length === 2` 감지
- 두 포인터 거리(`Math.hypot`) 변화로 scale 계산
- 기존 wheel 줌 로직과 통합

**🔴 스케일 핸들 터치 타겟**
- `h-5 w-5`(20px) → `h-11 w-11`(44px), 시각적 크기는 내부 아이콘으로 유지

**🟡 hover → Pointer Events**
- `onMouseEnter/Leave` → `onPointerEnter/Leave`

## 성공 기준

- [ ] iPhone SE(320px) ~ iPad Mini(768px) 가로 스크롤 없음
- [ ] 모든 터치 타겟 ≥ 40px (아이콘 버튼) / ≥ 44px (주요 액션)
- [ ] iOS Safari에서 input 포커스 시 zoom 없음
- [ ] Studio 모바일에서 입력 → 프리뷰 탭 전환 동작
- [ ] CardEditor 핀치 줌 동작

## 제외 범위 (Minor)

- `lib/generate-site.ts` 배포 HTML 회전 공식 / `.socials` 36px
- Lighthouse Mobile 점수 측정
- 실기기 검증 (10.10.20.40:3100)
