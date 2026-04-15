import Link from "next/link";
import { profile } from "@/lib/profile";

export const metadata = { title: `About — ${profile.name}` };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-10 text-sm">
        <Link href="/" className="text-neutral-500 hover:text-neutral-900">← 명함으로</Link>
      </nav>
      <h1 className="text-3xl font-bold">About</h1>
      <p className="mt-4 text-lg text-neutral-700">{profile.tagline}</p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-neutral-700">
        {profile.summary.map((s) => <li key={s}>{s}</li>)}
      </ul>
    </main>
  );
}
