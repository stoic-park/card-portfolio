import type { Metadata } from "next";
import "./globals.css";

const title = "Card Portfolio Studio";
const description = "마크다운 이력서를 명함 + 포트폴리오 사이트로. 원클릭 배포.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&family=Geist:wght@300;400;500;600;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
