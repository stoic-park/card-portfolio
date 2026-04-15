import Link from "next/link";

const features = [
  {
    title: "Markdown 입력",
    desc: "cv.md를 붙여넣으면 경력·프로젝트·스킬을 자동 파싱합니다.",
    tag: "01",
  },
  {
    title: "라이브 프리뷰",
    desc: "5개 브랜드 테마, 드래그·휠로 카드 이미지 즉시 편집합니다.",
    tag: "02",
  },
  {
    title: "원클릭 배포",
    desc: "Vercel 토큰 하나로 전용 URL에 명함 사이트가 생성됩니다.",
    tag: "03",
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      {/* Top nav */}
      <nav
        className="sticky top-0 z-10 flex h-14 items-center justify-between px-6 backdrop-blur"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <Link href="/" className="text-sm font-semibold tracking-tight">
          card-portfolio
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/stoic-park/card-portfolio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition"
            style={{ border: "1px solid var(--border)", color: "var(--fg)" }}
          >
            GitHub
          </a>
          <Link
            href="/studio"
            className="inline-flex h-8 items-center rounded-md px-3 text-xs font-semibold transition"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            스튜디오 열기
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-32">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.28em]"
          style={{ color: "var(--fg-subtle)" }}
        >
          Card Portfolio · Studio
        </p>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.35] tracking-tight md:text-6xl md:leading-[1.3]">
          마크다운 이력서를
          <br />
          <span style={{ color: "var(--accent)" }}>명함 + 포트폴리오</span>로.
        </h1>
        <p
          className="mt-6 max-w-xl text-base md:text-lg"
          style={{ color: "var(--fg-muted)" }}
        >
          cv.md 한 장, 브랜드 테마 하나, 원클릭 배포.
          QR 코드까지 자동 생성되는 미니멀 스튜디오.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/studio"
            className="inline-flex h-11 items-center rounded-md px-6 text-sm font-semibold transition hover:opacity-90"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            스튜디오 시작 →
          </Link>
          <a
            href="https://github.com/stoic-park/card-portfolio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-md px-6 text-sm font-semibold transition hover:bg-[var(--surface-2)]"
            style={{ border: "1px solid var(--border-strong)", color: "var(--fg)" }}
          >
            GitHub에서 보기
          </a>
        </div>
      </section>

      {/* Features — hairline grid */}
      <section
        className="mx-auto max-w-6xl"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.tag}
              className="px-6 py-10 md:py-14"
              style={{
                borderRight: i < features.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <p
                className="font-mono text-[11px] tracking-[0.28em]"
                style={{ color: "var(--fg-subtle)" }}
              >
                {f.tag}
              </p>
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="mx-auto max-w-6xl px-6 py-8"
        style={{ borderTop: "1px solid var(--border)", color: "var(--fg-subtle)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span>Built with Next.js · Deployed on Vercel</span>
          <span className="font-mono">v0.1</span>
        </div>
      </footer>
    </main>
  );
}
