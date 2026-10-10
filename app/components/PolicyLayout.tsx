import Link from "next/link";
import type { ReactNode } from "react";

export function PolicySection({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-6 sm:py-8 md:py-10 border-b border-stone-200 last:border-b-0">
      <h2 className="flex items-baseline gap-2.5 sm:gap-3 text-xl sm:text-2xl md:text-3xl font-serif text-stone-900 mb-3 sm:mb-4 leading-snug">
        <span className="text-xs sm:text-sm font-sans font-semibold tracking-widest text-stone-400">
          {num}
        </span>
        {title}
      </h2>
      <div className="space-y-3 sm:space-y-4 text-sm sm:text-[15px] md:text-base leading-relaxed text-stone-700">
        {children}
      </div>
    </section>
  );
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 sm:space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5 sm:gap-3">
          <span className="mt-2 sm:mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PolicyLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="h-16 md:h-20 flex items-center justify-between px-[5%] sm:px-[6%] sticky top-0 z-40 border-b border-stone-200 backdrop-blur-md bg-white/70">
        <Link
          href="/"
          className="group flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-900 transition-colors"
        >
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-stone-300 bg-white/80 group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </span>
          <span className="hidden sm:inline">Back to Store</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <span className="font-serif text-lg sm:text-xl md:text-2xl text-stone-900">
          Little Meadow
        </span>
      </header>

      <main className="px-[4%] sm:px-[6%] py-8 sm:py-12 md:py-20">
        <article className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm px-5 py-8 sm:px-8 sm:py-12 md:px-14 md:py-16">
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-stone-500 mb-3 sm:mb-4">
              Policies
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif italic text-stone-900 leading-tight">
              {title}
            </h1>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-6 mb-6 sm:mt-8 sm:mb-8" />
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-stone-700 max-w-2xl mx-auto">
              {intro}
            </p>
            <p className="text-xs sm:text-sm text-stone-500 mt-3 sm:mt-4">
              Last updated: October 2026
            </p>
          </div>

          {children}

          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-sm font-semibold tracking-wide text-stone-900">
              Little Meadow by Ayra &amp; Hadin
            </p>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-stone-500 mt-2 italic">
              Made with love for little moments.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
