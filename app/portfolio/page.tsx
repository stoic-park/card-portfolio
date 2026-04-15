import Link from "next/link";
import { defaultProfile } from "@/lib/profile";
import { PortfolioView } from "@/components/PortfolioView";

export const metadata = { title: `포트폴리오 — ${defaultProfile.name}` };

export default function PortfolioPage() {
  return (
    <div className="min-h-dvh bg-neutral-50">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-900">← 명함으로</Link>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-neutral-900">About</Link>
          <Link href="/contact" className="hover:text-neutral-900">Contact</Link>
          <Link href="/studio" className="hover:text-neutral-900">Studio</Link>
        </div>
      </nav>
      <PortfolioView profile={defaultProfile} />
    </div>
  );
}
