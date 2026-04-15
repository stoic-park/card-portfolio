import type { Profile } from "./schema";

export const profile: Profile = {
  name: "박성택",
  nameEn: "Sungtaek Park",
  title: "Frontend Developer",
  tagline: "사용자 중심의 설계를 고민하는 프론트엔드 개발자",
  email: "demige79@gmail.com",
  github: "https://github.com/stoic-park",
  blog: "https://stoic-park.vercel.app",
  location: "Seoul, Korea",
  socials: {
    linkedin: "",
    twitter: "",
    website: "https://stoic-park.vercel.app",
  },
  skills: [
    "React", "TypeScript", "Next.js", "Tailwind CSS",
    "React Query", "Zustand", "Vite", "Apache ECharts",
    "Storybook", "Turborepo", "Vitest",
  ],
  summary: [
    "기획·디자인·개발 직군 간 협업으로 서비스 품질과 UX를 지속 개선",
    "자동화·테스트 환경 구축으로 효율적인 개발 문화에 기여",
    "대용량 데이터 시각화 및 렌더링 성능 최적화 경험",
  ],
  experience: [
    {
      company: "에이아이비즈",
      role: "Frontend Developer",
      period: "2025.11 ~ 재직중",
      desc: "온프레미스 제조 설비 데이터 분석 웹 솔루션. 대용량 센서 데이터 시각화·분석 고도화, 프론트 분리 배포 체계 구축.",
    },
    {
      company: "원프레딕트",
      role: "Frontend Developer",
      period: "2021.01 - 2024.07",
      desc: "예지보전 솔루션 프론트엔드 개발. 제품 운영, 디자인 시스템 구축, CI/CD 파이프라인 개선 전반 담당.",
    },
  ],
  projects: [
    {
      name: "고장진단 웹 솔루션 고도화",
      org: "에이아이비즈",
      period: "2025.11 ~",
      stack: ["React 18", "TypeScript", "Vite", "Tailwind", "React Query", "Zustand", "ECharts"],
      highlights: [
        "다중 조건·시나리오 비교 분석 구조로 확장",
        "수십만~백만 포인트 차트 렌더링 병목 해결, INP 향상",
        "IndexedDB 기반 캐싱 레이어 설계·도입",
      ],
    },
    {
      name: "변압기 예측진단 (Guardione Substation)",
      org: "원프레딕트",
      period: "2021.06 - 2024.07",
      stack: ["React", "TypeScript", "styled-components", "Jotai", "ECharts"],
      highlights: [
        "레거시 JS를 React로 전면 마이그레이션",
        "GS 인증 1등급 획득 (리팩토링·테스트·문서화 주도)",
        "PDF 보고서 생성 시간 3분 → 10초 (90%+ 단축)",
      ],
    },
    {
      name: "터빈 자동 진단 (Guardione Turbo)",
      org: "원프레딕트",
      period: "2023.10 - 2024.06",
      stack: ["React", "TypeScript", "Zustand", "ECharts"],
      highlights: [
        "Orbit, Bode/Polar, Shaft Centerline, Spectrum 복합 차트 개발",
        "JSON 기반 Server Driven UI로 고객사별 대시보드 구성",
        "Redux Toolkit → Zustand 리팩토링으로 구조 단순화",
      ],
    },
    {
      name: "사내 디자인 시스템 (OPDS)",
      org: "원프레딕트",
      period: "2023.12 - 2024.06",
      stack: ["React", "vanilla-extract", "Storybook", "Turborepo", "pnpm"],
      highlights: [
        "Atomic Design 기반 공통 컴포넌트 개발",
        "Pnpm workspaces + Turborepo 모노레포 구축",
        "Figma Tokens → vanilla-extract 자동 변환 스크립트",
      ],
    },
  ],
};

export const defaultProfile = profile;
export type { Profile } from "./schema";
