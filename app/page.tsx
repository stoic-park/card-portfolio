import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-neutral-50 to-white text-neutral-900">
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Card Portfolio Studio</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight">
          마크다운 이력서를<br />
          <span className="text-blue-600">명함 + 포트폴리오</span>로
        </h1>
        <p className="mt-6 max-w-xl text-lg text-neutral-600">
          cv.md 하나 붙여넣고, 브랜드 테마 고르고, 원클릭으로 Vercel에 배포하세요.
          QR까지 자동 생성됩니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/studio"
            className="inline-flex items-center rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
          >
            스튜디오 열기 →
          </Link>
          <a
            href="https://github.com/stoic-park/card-portfolio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
          >
            GitHub
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 border-t border-neutral-200">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Markdown 입력",
              desc: "cv.md를 붙여넣으면 경력·프로젝트·스킬을 자동 파싱합니다.",
            },
            {
              title: "라이브 프리뷰",
              desc: "5개 브랜드 테마, 드래그·휠로 카드 이미지 즉시 편집.",
            },
            {
              title: "원클릭 배포",
              desc: "Vercel 토큰 하나면 명함 사이트가 전용 URL에 생성됩니다.",
            },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-10 border-t border-neutral-200 text-xs text-neutral-500">
        Built with Next.js · Deployed on Vercel
      </footer>
    </main>
  );
}
