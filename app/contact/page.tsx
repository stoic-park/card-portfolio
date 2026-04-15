import Link from "next/link";
import { profile } from "@/lib/profile";

export const metadata = { title: `Contact — ${profile.name}` };

export default function ContactPage() {
  const items = [
    { label: "Email", href: `mailto:${profile.email}`, value: profile.email },
    { label: "GitHub", href: profile.github, value: profile.github },
    { label: "Blog", href: profile.blog, value: profile.blog },
  ];
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-10 text-sm">
        <Link href="/" className="text-neutral-500 hover:text-neutral-900">← 명함으로</Link>
      </nav>
      <h1 className="text-3xl font-bold">Contact</h1>
      <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
        {items.map((i) => (
          <li key={i.label} className="flex items-center justify-between py-4">
            <span className="text-sm uppercase tracking-widest text-neutral-500">{i.label}</span>
            <a href={i.href} className="text-neutral-900 underline underline-offset-4" target="_blank" rel="noreferrer">
              {i.value}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
