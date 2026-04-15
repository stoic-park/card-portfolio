# card-portfolio

명함 스타일 인트로 + 포트폴리오 페이지. Next.js App Router · Tailwind · QR.

## 기능
- `/` 명함 화면: 앞/뒤 3D flip, 테마 3종 (Minimal · Dark · Colorful), QR 코드
- `/portfolio` 상세 포트폴리오 (Skills · Experience · Projects)
- `/about`, `/contact`

## 개발
```bash
npm install
npm run dev
```

## 환경변수
- `NEXT_PUBLIC_SITE_URL` — QR이 가리킬 배포 URL (Vercel이면 `VERCEL_URL` 자동 사용)

## 배포 (Vercel)
```bash
npx vercel
```
프레임워크 자동 감지. 환경변수에 `NEXT_PUBLIC_SITE_URL` 설정 권장.

## 구조
- `app/` 라우트 (server components)
- `components/` BusinessCard, CardScene, ThemeSwitcher (client)
- `lib/profile.ts` 프로필 데이터 (단일 소스)
- `lib/themes.ts` 테마 디자인 토큰
